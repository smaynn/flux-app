# Flux-Schnell 文生图 MVP 网站

这是一个基于 Next.js 开发的文生图（文字生成图像）MVP网站，使用 Replicate API 实现文本到图像的生成功能。该项目旨在提供简洁的用户界面，让用户能够通过输入文本描述来生成相应的图像。

## 项目架构

本项目使用以下技术栈：

- **Next.js**: React框架，用于构建用户界面和服务端渲染
- **TypeScript**: 提供类型安全的JavaScript开发体验
- **Tailwind CSS**: 用于快速构建响应式UI
- **Replicate API**: 用于文本到图像的生成
- **React Hook Form**: 用于表单处理和验证
- **hCaptcha**: 用于防止API滥用的人机验证

## 页面结构

1. **首页 (/)**: 
   - 简洁的欢迎界面
   - 文生图功能的简要介绍
   - 开始使用按钮

2. **生成页面 (/generate)**:
   - 文本输入区域，用于描述想要生成的图像
   - 可选参数设置（如图像尺寸、风格等）
   - hCaptcha人机验证
   - 生成按钮
   - 生成历史记录展示区域

3. **API路由 (/api/generate)**:
   - 处理生成请求
   - 验证hCaptcha响应
   - 与Replicate API交互
   - 返回生成的图像URL

## 隐私保护

为保护用户隐私和API密钥安全：

- API密钥存储在环境变量中，不会暴露在前端代码中
- 所有API请求通过服务端API路由进行，避免在客户端直接调用第三方服务
- 人机验证系统防止API滥用
- 不会在客户端存储敏感信息

## 本地开发

```bash
# 安装依赖
npm install

# 创建.env.local文件并添加您的密钥
# REPLICATE_API_KEY=your_api_key_here
# NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key_here
# HCAPTCHA_SECRET_KEY=your_secret_key_here

# 运行开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 部署到Vercel

1. Fork或克隆此仓库到您的GitHub账户
2. 在Vercel上创建一个新项目，并连接到您的GitHub仓库
3. 在Vercel项目设置中添加环境变量：
   - `REPLICATE_API_KEY`: 您的Replicate API密钥
   - `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`: 您的hCaptcha站点密钥
   - `HCAPTCHA_SECRET_KEY`: 您的hCaptcha密钥
4. 部署项目

## 注意事项

- 本项目仅作为MVP演示使用，不建议用于生产环境
- 请遵守Replicate的使用条款和限制
- 生成的图像可能受版权保护，请谨慎使用
- 如需详细了解hCaptcha设置，请参考项目根目录的`hcaptcha-setup.md`文件

## 后续改进方向

1. 添加用户认证系统
2. 实现图像历史记录功能
3. 添加更多模型选择
4. 优化移动端体验
5. 添加图像编辑功能

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
