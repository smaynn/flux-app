export default {
  siteTitle: 'Flux-Schnell',
  heroTitle: '即可生成 您的AI创意图像',
  heroSubtitle: '输入您的灵感描述，选择参数，Flux-Schnell 将为您快速生成高质量图像。',
  promptLabel: '图像描述',
  promptPlaceholder: '例如：一只戴着宇航员头盔的可爱猫咪，漂浮在五彩斑斓的星云太空中，超高清细节',
  aspectRatioLabel: '宽高比',
  aspectRatios: {
    square: '正方形 (1:1)',
    widescreen: '宽屏 (16:9)',
    portrait: '竖屏 (9:16)',
    standard: '标准 (4:3)',
    standardPortrait: '标准竖屏 (3:4)',
    photo: '照片 (3:2)',
    photoPortrait: '照片竖屏 (2:3)',
  },
  generateButton: '✨ 生成图像',
  generatingButton: '正在生成...',
  previewAreaPlaceholder: '在此预览您生成的图像',
  loadingMessage: '图像生成中，请稍候...',
  errorTitle: '生成失败',
  footerCopyright: '© {year} Ma Yin. 版权所有。',
  footerContact: '联系我: mayin711@gmail.com',
  switchToChinese: '切换到中文',
  switchToEnglish: 'Switch to English',
  promptRequiredError: '图像描述不能为空',
  hCaptchaLabel: '人机验证',
  hCaptchaRequiredError: '请完成人机验证',
  hCaptchaInvalidError: '人机验证失败，请重试',
} as const; 