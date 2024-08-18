import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const utmCampaign = searchParams.get("utm_campaign");

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (utmCampaign) {
    requestHeaders.set("x-utmCampaign", utmCampaign);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
