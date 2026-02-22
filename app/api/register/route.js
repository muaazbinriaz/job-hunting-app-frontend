import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      body,
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Registration failed",
      },
      {
        status: error.response?.status || 500,
      },
    );
  }
}
