import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '环境变量检查',
  description: '检查Flux-Schnell应用的环境变量配置',
};

export default function CheckEnvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
} 