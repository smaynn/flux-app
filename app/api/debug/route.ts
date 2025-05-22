import { NextRequest, NextResponse } from "next/server";

// 简单的身份验证key，生产环境请使用更安全的方式
const DEBUG_ACCESS_KEY = process.env.DEBUG_ACCESS_KEY || "flux_debug_access";

export async function GET(request: NextRequest) {
  // 获取URL中的访问密钥参数
  const { searchParams } = new URL(request.url);
  const accessKey = searchParams.get("key");
  
  // 在生产环境中验证访问密钥
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && accessKey !== DEBUG_ACCESS_KEY) {
    return NextResponse.json(
      { error: "访问被拒绝，请提供有效的访问密钥" },
      { status: 403 }
    );
  }

  // 准备调试信息，确保不暴露完整的密钥
  const debugInfo: Record<string, any> = {
    env: process.env.NODE_ENV || "unknown",
    hcaptchaSiteKeySet: !!process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
    hcaptchaSecretKeySet: !!process.env.HCAPTCHA_SECRET_KEY,
    timestamp: new Date().toISOString(),
    nextPublicVars: Object.keys(process.env).filter(key => key.startsWith("NEXT_PUBLIC_")),
  };

  // 仅在非生产环境或有访问密钥时显示部分密钥值
  if (!isProduction || accessKey === DEBUG_ACCESS_KEY) {
    debugInfo.hcaptchaSiteKeyHint = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY 
      ? `${process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY.substring(0, 5)}...` 
      : "";
  }

  return NextResponse.json({ debugInfo }, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
} 