"use client";

import { useEffect, useState } from "react";

export default function CheckEnv() {
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [clientInfo, setClientInfo] = useState({
    hcaptchaSiteKeySet: false,
    hcaptchaSiteKeyValue: "",
    nodeEnv: "",
    nextPublicVars: [] as string[],
  });

  useEffect(() => {
    // 获取客户端环境变量
    setClientInfo({
      hcaptchaSiteKeySet: !!process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
      hcaptchaSiteKeyValue: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
        ? process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY.substring(0, 5) + "..."
        : "",
      nodeEnv: process.env.NODE_ENV || "",
      nextPublicVars: Object.keys(process.env).filter((key) =>
        key.startsWith("NEXT_PUBLIC_")
      ),
    });

    // 从API获取服务器端环境变量信息
    fetch("/api/debug")
      .then((res) => res.json())
      .then((data) => {
        setDebugInfo(data.debugInfo);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("获取调试信息失败", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">环境变量检查工具</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 客户端环境变量 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              客户端环境变量
            </h2>

            <div className="space-y-3">
              <div className="flex items-start">
                <span className="font-medium min-w-40">NEXT_PUBLIC_HCAPTCHA_SITE_KEY:</span>
                <span
                  className={
                    clientInfo.hcaptchaSiteKeySet
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400 font-bold"
                  }
                >
                  {clientInfo.hcaptchaSiteKeySet
                    ? "已设置 (" + clientInfo.hcaptchaSiteKeyValue + ")"
                    : "未设置"}
                </span>
              </div>

              <div className="flex items-start">
                <span className="font-medium min-w-40">NODE_ENV:</span>
                <span>{clientInfo.nodeEnv}</span>
              </div>

              <div className="flex items-start">
                <span className="font-medium min-w-40">Next.js 公共变量:</span>
                <span>
                  {clientInfo.nextPublicVars.length > 0
                    ? clientInfo.nextPublicVars.join(", ")
                    : "无"}
                </span>
              </div>
            </div>
          </div>

          {/* 服务器端环境变量 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
              服务器端环境变量
            </h2>

            {isLoading ? (
              <p className="text-center py-4">加载中...</p>
            ) : debugInfo ? (
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="font-medium min-w-40">NEXT_PUBLIC_HCAPTCHA_SITE_KEY:</span>
                  <span
                    className={
                      debugInfo.hcaptchaSiteKeySet
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400 font-bold"
                    }
                  >
                    {debugInfo.hcaptchaSiteKeySet
                      ? "已设置 (" + debugInfo.hcaptchaSiteKeyValue + ")"
                      : "未设置"}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="font-medium min-w-40">HCAPTCHA_SECRET_KEY:</span>
                  <span
                    className={
                      debugInfo.hcaptchaSecretKeySet
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400 font-bold"
                    }
                  >
                    {debugInfo.hcaptchaSecretKeySet ? "已设置" : "未设置"}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="font-medium min-w-40">Next.js 公共变量:</span>
                  <span>
                    {debugInfo.nextPublicVars.length > 0
                      ? debugInfo.nextPublicVars.join(", ")
                      : "无"}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="font-medium min-w-40">检测时间:</span>
                  <span>{new Date(debugInfo.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-red-500">获取服务器信息失败</p>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            问题排查指南
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong className="text-red-600 dark:text-red-400">如果hCaptcha不显示:</strong>
            </p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                确保在Vercel项目设置中添加了<code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">NEXT_PUBLIC_HCAPTCHA_SITE_KEY</code>环境变量
              </li>
              <li>
                确保密钥格式正确，不包含额外的引号或空格
              </li>
              <li>
                添加或修改环境变量后，需要重新部署Vercel项目
              </li>
              <li>
                注意：只有<code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">NEXT_PUBLIC_</code>前缀的环境变量才会暴露给客户端
              </li>
              <li>
                如果您使用了测试密钥，请确认它是否仍然有效
              </li>
            </ol>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Vercel环境变量设置步骤:
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-blue-800 dark:text-blue-200">
                <li>登录您的Vercel账户</li>
                <li>进入您的项目</li>
                <li>点击 "Settings" 选项卡</li>
                <li>在左侧菜单中选择 "Environment Variables"</li>
                <li>添加键<code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">NEXT_PUBLIC_HCAPTCHA_SITE_KEY</code>和对应的值</li>
                <li>添加键<code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">HCAPTCHA_SECRET_KEY</code>和对应的值</li>
                <li>点击 "Save" 保存更改</li>
                <li>重新部署您的项目</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 