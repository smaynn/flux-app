import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const debugInfo = {
    hcaptchaSiteKeySet: !!process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
    hcaptchaSecretKeySet: !!process.env.HCAPTCHA_SECRET_KEY,
    hcaptchaSiteKeyValue: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.substring(0, 5) + '...',
    timestamp: new Date().toISOString(),
    nextPublicVars: Object.keys(process.env).filter(key => key.startsWith("NEXT_PUBLIC_")),
  };

  return NextResponse.json({ debugInfo }, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
} 