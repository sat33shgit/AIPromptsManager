import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ message: "Validation failed", issues: error.flatten() }, { status: 422 });
  }

  return NextResponse.json(
    { message: error instanceof Error ? error.message : "Unexpected server error" },
    { status: 500 }
  );
}
