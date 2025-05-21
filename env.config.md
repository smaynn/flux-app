# 环境变量配置

本项目需要以下环境变量才能正常运行：

## 本地开发

在项目根目录创建一个名为 `.env.local` 的文件，并添加以下内容：

```
# Replicate API密钥
REPLICATE_API_KEY=your_replicate_api_key_here
```

## Vercel部署

在Vercel部署时，需要在项目设置中添加以下环境变量：

1. `REPLICATE_API_KEY`: Replicate API密钥

## 如何获取Replicate API密钥

1. 访问 [Replicate官网](https://replicate.com) 并注册账号
2. 登录后，在个人设置页面找到API令牌选项
3. 创建一个新的API令牌
4. 复制生成的API密钥，并添加到环境变量中

**注意**: 请妥善保管您的API密钥，不要将其提交到代码仓库中。 