# Vercel环境变量设置指南

本指南将帮助您在Vercel上正确设置环境变量，以确保hCaptcha人机验证功能正常工作。

## 查看环境变量状态

部署完成后，您可以访问您网站的`/check-env`路径（例如：`https://您的网站.vercel.app/check-env`）来检查环境变量的设置状态。

## 设置环境变量的详细步骤

### 1. 登录Vercel

访问 [Vercel官网](https://vercel.com) 并登录您的账户。

### 2. 选择您的项目

从项目列表中找到并点击您的Flux-Schnell项目。

### 3. 进入项目设置

在项目面板中，点击顶部导航栏的 **Settings** 选项卡。

### 4. 找到环境变量设置

在左侧菜单中，选择 **Environment Variables**。

### 5. 添加hCaptcha相关的环境变量

您需要添加以下两个环境变量：

#### a) NEXT_PUBLIC_HCAPTCHA_SITE_KEY

- **名称**: `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- **值**: 您的hCaptcha站点密钥（例如：10000000-ffff-ffff-ffff-000000000001）
- **环境**: Production, Preview, Development（全选）
- 点击 **Add** 按钮添加此变量

#### b) HCAPTCHA_SECRET_KEY

- **名称**: `HCAPTCHA_SECRET_KEY`
- **值**: 您的hCaptcha密钥（例如：0x0000000000000000000000000000000000000000）
- **环境**: Production, Preview, Development（全选）
- 点击 **Add** 按钮添加此变量

### 6. 重新部署项目

添加环境变量后，您需要重新部署项目以使更改生效：

1. 点击顶部导航栏的 **Deployments** 选项卡
2. 找到您的最新部署
3. 点击部署旁边的 "..." (三点菜单)
4. 选择 **Redeploy** 选项

## 验证设置

完成上述步骤后，请等待部署完成，然后访问您的网站。如果hCaptcha验证按钮正常显示，则说明环境变量已正确设置。

## 故障排除

如果您仍然看不到hCaptcha按钮，请检查以下几点：

1. 确认环境变量名称拼写正确，特别是`NEXT_PUBLIC_`前缀（区分大小写）
2. 确认您的密钥值没有包含额外的引号或空格
3. 确认您已经重新部署了项目
4. 清除浏览器缓存后再次访问您的网站
5. 访问`/check-env`页面查看详细的环境变量状态

## hCaptcha测试密钥

在开发和测试过程中，您可以使用以下测试密钥：

- **站点密钥**: `10000000-ffff-ffff-ffff-000000000001`
- **密钥**: `0x0000000000000000000000000000000000000000`

注意：这些测试密钥只能在开发环境中使用，不适合生产环境。

## 获取真实的hCaptcha密钥

要获取真实的hCaptcha密钥，请访问[hCaptcha官网](https://www.hcaptcha.com/)并注册账户。注册后，您可以在管理面板中添加您的网站域名并获取相应的密钥。 