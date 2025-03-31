// src/app/api/auth/callback/microsoft/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface MicrosoftTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface BackendAuthResponse {
  token: string;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return new NextResponse("Missing code", { status: 400 });

  try {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
      client_secret: process.env.AZURE_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI!,
      grant_type: "authorization_code",
    });

    const tokenRes = await axios.post<MicrosoftTokenResponse>(
      `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}/oauth2/v2.0/token`,
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const backendRes = await axios.post<BackendAuthResponse>(
      "http://localhost:3000/auth/microsoft",
      { accessToken }
    );

    const jwt = backendRes.data.token;
    // const res = NextResponse.redirect(new URL("/dashboard", req.url));
    const res = NextResponse.redirect("https://pointyfi.io");
    res.cookies.set("token", jwt, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed authenticatication", { status: 500 });
  }
}
