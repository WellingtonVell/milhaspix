import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CombinedFormSchema } from "@/features/announcement/schemas";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          error: "Content-Type must be application/json",
          code: "INVALID_CONTENT_TYPE",
        },
        { status: 400 },
      );
    }

    let rawData: unknown;
    try {
      rawData = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          code: "INVALID_JSON",
        },
        { status: 400 },
      );
    }

    const parsed = CombinedFormSchema.safeParse(rawData);

    if (!parsed.success) {
      const errs = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          code: "VALIDATION_ERROR",
          details: errs,
        },
        { status: 400 },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // const isSuccess = false;
    const isSuccess = true;

    if (!isSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Este é apenas um erro para fins de demo. Tente novamente.",
          code: "FAKE_DEMO_ERROR",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Anúncio criado com sucesso!",
    });
  } catch (error) {
    console.error("Error processing announcement:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
