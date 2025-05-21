import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

// Replicate API 客户端初始化
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
});

// 定义模型输入参数的接口
interface ModelInput {
  prompt: string;
  aspect_ratio: string;
  negative_prompt: string;
  num_inference_steps: number;
  seed: number;
  guidance_scale: number;
  // output_format?: string;
  // output_quality?: number;
}

// 定义前端请求体的接口
interface RequestBody {
  prompt: string;
  aspectRatio: string;
}

// 定义 Replicate 错误对象的接口
interface ReplicateError {
  title?: string;
  detail?: string;
  // Replicate API有时也可能直接返回字符串错误
}

// 定义 Replicate 预测响应的接口
interface ReplicatePrediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  input?: ModelInput;
  output?: string[] | null; // 成功时通常是字符串URL数组，失败或处理中可能为null
  error?: ReplicateError | string | null; // 错误信息可以是对象或字符串
  logs?: string;
  metrics?: { predict_time?: number; [key: string]: string | number | boolean | null | undefined }; // metrics可以包含predict_time等，以及其他键值对
}

// 辅助函数：轮询预测状态直到完成或失败
async function pollPrediction(predictionId: string): Promise<ReplicatePrediction> {
  let predictionStatus: ReplicatePrediction;
  const startTime = Date.now();
  const timeout = 300000; // 5分钟超时

  while (Date.now() - startTime < timeout) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      // 使用类型断言，因为replicate.predictions.get返回的是泛型Promise<Prediction>
      predictionStatus = (await replicate.predictions.get(predictionId)) as ReplicatePrediction;
      console.log("Polling status:", predictionStatus.status);
      if (predictionStatus.status === "succeeded" || predictionStatus.status === "failed" || predictionStatus.status === "canceled") {
        return predictionStatus;
      }
    } catch (error) {
      console.error("Polling error:", error);
      // 简单重试
    }
  }
  throw new Error("预测超时");
}

// 验证前端输入并准备模型输入的函数
async function validateAndProcessInput(req: NextRequest): Promise<ModelInput> {
  const body: RequestBody = await req.json();
  const { prompt, aspectRatio } = body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return Promise.reject(new Error("Prompt is required and must be a non-empty string."));
  }
  const validAspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"];
  if (!aspectRatio || typeof aspectRatio !== "string" || !validAspectRatios.includes(aspectRatio)) {
    return Promise.reject(new Error(`Invalid aspect ratio. Must be one of: ${validAspectRatios.join(", ")}`));
  }
  if (prompt.length > 500) {
    return Promise.reject(new Error("Prompt cannot exceed 500 characters."));
  }

  const modelInput: ModelInput = {
    prompt,
    aspect_ratio: aspectRatio,
    negative_prompt: "",
    num_inference_steps: 4,
    seed: -1,
    guidance_scale: 0,
  };

  console.log("API侧准备传递给模型的输入 (modelInput):", modelInput);
  return modelInput;
}

export async function POST(request: NextRequest) {
  try {
    const modelInput = await validateAndProcessInput(request);
    console.log("准备运行 Replicate 模型，输入:", modelInput);

    const initialPrediction = (await replicate.predictions.create({
      model: "black-forest-labs/flux-schnell",
      input: modelInput,
    })) as ReplicatePrediction;

    console.log("Replicate 初始预测响应:", initialPrediction);

    if (!initialPrediction || !initialPrediction.id) {
      throw new Error("未能创建 Replicate 预测任务");
    }

    const finalPrediction = await pollPrediction(initialPrediction.id);
    console.log("Replicate 最终预测响应:", finalPrediction);

    if (finalPrediction.status === "succeeded") {
      // output 期望是 string[] | null
      if (Array.isArray(finalPrediction.output) && finalPrediction.output.length > 0) {
        const imageUrl = finalPrediction.output[0];
        if (typeof imageUrl === 'string') {
          return NextResponse.json({ imageUrl });
        } else {
          console.error("Replicate API 返回的 output[0] 不是字符串:", finalPrediction.output);
          throw new Error("Replicate API 返回了无效的图像数据格式。");
        }
      } else {
        console.error("Replicate API 返回的 output 格式不符合预期 (非数组、空数组或null):", finalPrediction.output);
        throw new Error("Replicate API 未返回预期的图像数据。");
      }
    } else {
      // 处理错误信息
      let errorDetail = "未知错误";
      if (finalPrediction.error) {
        if (typeof finalPrediction.error === 'string') {
          errorDetail = finalPrediction.error;
        } else if (typeof finalPrediction.error === 'object' && finalPrediction.error.detail) {
          errorDetail = finalPrediction.error.detail;
        } else if (typeof finalPrediction.error === 'object' && finalPrediction.error.title) {
          errorDetail = finalPrediction.error.title;
        }
      }
      throw new Error(`图像生成失败: ${errorDetail} (状态: ${finalPrediction.status})`);
    }
  } catch (error: unknown) {
    let errorMessage = "发生未知错误";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("API 错误 (POST /api/generate):", errorMessage, error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}