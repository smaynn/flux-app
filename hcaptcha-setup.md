# Flux-Schnell hCaptcha 设置指南

为了保护您的API免受滥用，我们已经实施了hCaptcha人机验证。本指南将帮助您正确设置hCaptcha。

## 1. 环境变量配置

在项目根目录创建或编辑 `.env.local` 文件，添加以下环境变量：

```bash
# Replicate API 密钥 (如果您已经有此项，请保留)
REPLICATE_API_KEY=your_replicate_api_key_here

# hCaptcha 密钥
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=您的hCaptcha站点密钥
HCAPTCHA_SECRET_KEY=您的hCaptcha密钥
```

请将 `您的hCaptcha站点密钥` 和 `您的hCaptcha密钥` 替换为您从hCaptcha管理面板获取的实际密钥。

## 2. Vercel 环境变量设置

如果您在Vercel上部署网站，您还需要在Vercel项目设置中添加这些环境变量：

1. 登录您的Vercel账户
2. 进入您的项目
3. 点击 "Settings" 选项卡
4. 在左侧菜单中选择 "Environment Variables"
5. 添加以下两个环境变量：
   - `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` = 您的hCaptcha站点密钥
   - `HCAPTCHA_SECRET_KEY` = 您的hCaptcha密钥

## 3. 测试模式

在开发过程中，您可以使用hCaptcha的测试模式，不需要真实的验证操作：

- 站点密钥：`10000000-ffff-ffff-ffff-000000000001`
- 密钥：`0x0000000000000000000000000000000000000000`

注意：测试模式仅适用于开发环境，生产环境必须使用真实的hCaptcha密钥。

## 4. 故障排除

如果您遇到hCaptcha验证问题：

1. 确保两个密钥都正确无误
2. 检查浏览器控制台是否有JavaScript错误
3. 确保您的网站域名已在hCaptcha管理面板中注册
4. 如果问题仍然存在，请检查网络请求以查看具体的验证错误

## 5. 进一步定制

您可以通过修改源代码，进一步定制hCaptcha的外观和行为：

- 在 `app/[locale]/page.tsx` 文件中找到hCaptcha组件
- 您可以添加更多属性，如 `theme`, `size`, `language` 等
- 参考 [hCaptcha React文档](https://docs.hcaptcha.com/configuration#jsapi) 了解更多配置选项 