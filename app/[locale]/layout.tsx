import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css"; // 确保路径正确，因为 layout.tsx 移动了一层

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flux-Schnell 文生图", // 考虑是否也国际化
  description: "基于AI的文字生成图像平台", // 考虑是否也国际化
};

// 函数参数不使用解构，这样可以先等待整个params
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 等待整个props.params对象
  const params = await props.params;
  const locale = params.locale;
  
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {props.children}
      </body>
    </html>
  );
} 