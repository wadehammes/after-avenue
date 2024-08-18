import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  draftMode().disable();

  redirect(searchParams.get("redirect") || "/");
}
