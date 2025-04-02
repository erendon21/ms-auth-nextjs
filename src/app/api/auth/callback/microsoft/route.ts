// src/app/api/auth/callback/microsoft/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface BackendAuthResponse {
  token: string;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return new NextResponse("Missing code", { status: 400 });

  try {
    const backendRes = await axios.post<BackendAuthResponse>(
      "http://localhost:3000/auth/microsoft",
      { code }
    );

    const jwt = backendRes.data.token;

    const res = NextResponse.redirect("https://pointyfi.io");
    res.cookies.set("token", jwt, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed authentication", { status: 500 });
  }
}
