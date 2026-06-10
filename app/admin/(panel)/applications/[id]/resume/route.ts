import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Route handlers bypass the admin layout, so auth is enforced here.
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const app = await db.application.findUnique({
    where: { id },
    select: { resumeName: true, resumeType: true, resumeData: true },
  });

  if (!app?.resumeData || !app.resumeName) {
    return NextResponse.json({ error: "No resume on file" }, { status: 404 });
  }

  const safeName = app.resumeName.replace(/[^\w.\- ]/g, "_");
  return new NextResponse(new Uint8Array(app.resumeData), {
    headers: {
      "Content-Type": app.resumeType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
    },
  });
}
