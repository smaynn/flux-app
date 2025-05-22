"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { I18nProviderClient, useI18n, useCurrentLocale } from "../../locales/client";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// 表单数据类型定义
type FormData = {
  prompt: string;
  aspectRatio: string;
  hCaptchaToken: string;
  // 可以根据需要添加 outputFormat, outputQuality 等高级选项
};

// 包装实际的页面内容，以便在 I18nProviderClient 内部使用 i18n hooks
function HomePageContent() {
  const t = useI18n();
  const captchaRef = useRef<HCaptcha>(null);

  // 状态管理 (从 generate/page.tsx 移入)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // 表单处理 (从 generate/page.tsx 移入)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      prompt: "",
      aspectRatio: "1:1",
      hCaptchaToken: "",
    },
  });

  // hCaptcha 验证处理
  const onCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setValue("hCaptchaToken", token);
  };

  const onCaptchaExpire = () => {
    setCaptchaToken(null);
    setValue("hCaptchaToken", "");
  };

  const onCaptchaError = (event: string) => {
    console.error("hCaptcha 错误:", event);
    setCaptchaToken(null);
    setValue("hCaptchaToken", "");
  };

  // 生成图像逻辑 (从 generate/page.tsx 移入)
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    console.log("首页发送的数据 (onSubmit data):", data);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `图像生成失败，状态码: ${response.status}`);
      }

      if (result.imageUrl && typeof result.imageUrl === "string") {
        setGeneratedImage(result.imageUrl);
      } else {
        console.error("服务器成功响应但未返回有效的imageUrl:", result);
        throw new Error("服务器成功响应，但未提供有效的图像数据。请检查API日志。");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "生成过程中发生未知错误";
      setError(errorMessage);
      console.error("生成错误 (onSubmit catch):", errorMessage, err);
    } finally {
      setIsGenerating(false);
      // 重置验证码
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
      setCaptchaToken(null);
      setValue("hCaptchaToken", "");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-sky-100 dark:from-slate-800 dark:via-gray-900 dark:to-sky-900/50 text-gray-900 dark:text-gray-100">
      {/* 导航栏 */}
      <header className="w-full py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200/70 dark:border-gray-700/70 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {/* @ts-ignore */}
              {t('siteTitle', { count: 1 })}
            </h1>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 主要内容 - Hero 区集成文生图 */}
      <main className="flex-grow w-full">
        {/* Hero 区，移除渐变背景类 */}
        <section className="py-10 sm:py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  {/* @ts-ignore */}
                  {t('heroTitle', { count: 1 }).split(' ')[0]}
                </span>
                {/* @ts-ignore */}
                {t('heroTitle', { count: 1 }).substring(t('heroTitle', { count: 1 }).indexOf(' ') + 1)}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {/* @ts-ignore */}
                {t('heroSubtitle', { count: 1 })}
              </p>
            </div>

            {/* 父级网格使用 items-stretch 使子项等高 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
              {/* 左侧/主要：图像生成表单 (占3/5宽度) */}
              <div className="lg:col-span-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6 shadow-lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label htmlFor="prompt" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                      {/* @ts-ignore */}
                      {t('promptLabel', { count: 1 })} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="prompt"
                      rows={4}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm text-sm"
                      /* @ts-ignore */
                      placeholder={t('promptPlaceholder', { count: 1 })}
                      /* @ts-ignore */
                      {...register("prompt", { required: t('promptRequiredError', { count: 1 }) })}
                    />
                    {errors.prompt && (
                      <p className="text-red-500 text-xs mt-1">{errors.prompt.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="aspectRatio" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                        {/* @ts-ignore */}
                        {t('aspectRatioLabel', { count: 1 })}
                      </label>
                      <select
                        id="aspectRatio"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm text-sm"
                        {...register("aspectRatio")}
                      >
                        {/* @ts-ignore */}
                        <option value="1:1">{t('aspectRatios.square', { count: 1 })}</option>
                        {/* @ts-ignore */}
                        <option value="16:9">{t('aspectRatios.widescreen', { count: 1 })}</option>
                        {/* @ts-ignore */}
                        <option value="9:16">{t('aspectRatios.portrait', { count: 1 })}</option>
                        {/* @ts-ignore */}
                        <option value="4:3">{t('aspectRatios.standard', { count: 1 })}</option>
                        {/* @ts-ignore */}
                        <option value="3:4">{t('aspectRatios.standardPortrait', { count: 1 })}</option>
                        {/* @ts-ignore */}
                        <option value="3:2">{t('aspectRatios.photo', { count: 1 })}</option>
                        {/* @ts-ignore */}
                        <option value="2:3">{t('aspectRatios.photoPortrait', { count: 1 })}</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* hCaptcha组件 */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                      {/* @ts-ignore */}
                      {t('hCaptchaLabel', { count: 1 })} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-center">
                      <HCaptcha
                        ref={captchaRef}
                        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                        onVerify={onCaptchaVerify}
                        onExpire={onCaptchaExpire}
                        onError={onCaptchaError}
                      />
                    </div>
                    <input 
                      type="hidden" 
                      {...register("hCaptchaToken", {
                        required: "请完成人机验证"
                      })}
                    />
                    {errors.hCaptchaToken && (
                      <p className="text-red-500 text-xs mt-1 text-center">{errors.hCaptchaToken.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating || !captchaToken}
                    className="w-full btn-hover-effect py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {/* @ts-ignore */}
                        {t('generatingButton', { count: 1 })}
                      </>
                    ) : (
                      /* @ts-ignore */
                      t('generateButton', { count: 1 })
                    )}
                  </button>
                </form>
              </div>

              {/* 右侧/次要：图像预览区域 (占2/5宽度) */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <div className="w-full h-full flex items-center justify-center aspect-[4/3] lg:aspect-auto">
                  {isGenerating && (
                    <div className="text-center p-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg className="animate-spin text-blue-500 dark:text-blue-400 h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                      {/* @ts-ignore */}
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{t('loadingMessage', { count: 1 })}</p>
                    </div>
                  )}

                  {error && !isGenerating && (
                    <div className="text-center p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 rounded-lg w-full max-w-sm mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mx-auto mb-1.5 sm:mb-2 h-6 w-6 sm:h-8 sm:w-8">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {/* @ts-ignore */}
                      <p className="text-red-600 dark:text-red-300 text-sm font-medium">{t('errorTitle', { count: 1 })}</p>
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1 break-words">{error}</p>
                    </div>
                  )}

                  {!isGenerating && !error && !generatedImage && (
                    <div className="text-center text-gray-400 dark:text-gray-500 p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 sm:mb-3">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                      {/* @ts-ignore */}
                      <p className="text-xs sm:text-sm">{t('previewAreaPlaceholder', { count: 1 })}</p>
                    </div>
                  )}

                  {generatedImage && !isGenerating && !error && (
                    <div className="w-full h-full relative group flex items-center justify-center">
                      <Image 
                        src={generatedImage} 
                        alt="AI 生成的图像"
                        width={512}
                        height={512}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-md transition-opacity duration-300 ease-in-out animate-fadeIn"
                        onLoad={() => console.log("图像已成功加载到Image组件")}
                        unoptimized
                      />
                      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <a 
                          href={generatedImage} 
                          download={`flux_image_${Date.now()}.webp`}
                          className="p-2 sm:p-2.5 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 dark:hover:bg-gray-600/90 transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
                          title="下载图像"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-gray-200/70 dark:border-gray-700/70 mt-10 sm:mt-12">
        <div className="max-w-7xl mx-auto text-center sm:flex sm:justify-between sm:items-center">
          <div className="mb-3 sm:mb-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {/* @ts-ignore */}
              {t('footerCopyright', { year: new Date().getFullYear(), count: 1 })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <a href="mailto:mayin711@gmail.com" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              {/* @ts-ignore */}
              {t('footerContact', { count: 1 })}
            </a>
            {/* 您可以在这里添加 GitHub 链接等 */}
          </div>
        </div>
      </footer>
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// 默认导出的 Home 组件现在包裹 HomePageContent 并提供 I18nProviderClient
export default function Home() {
  // Since page.tsx is "use client", we can use client hooks here.
  const currentLocale = useCurrentLocale(); // Get locale using the client hook

  if (!currentLocale) {
    // Fallback or loading state if locale is not yet available
    // This might happen briefly during initial load or if context is not ready
    return <div className="w-screen h-screen flex items-center justify-center"><p>Loading locale...</p></div>;
  }

  return (
    <I18nProviderClient 
      locale={currentLocale} 
      fallback={<div className="w-screen h-screen flex items-center justify-center"><p>Loading translations...</p></div>}
    >
      <HomePageContent />
    </I18nProviderClient>
  );
} 