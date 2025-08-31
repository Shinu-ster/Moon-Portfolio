import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const allProjects = await db.select().from(projects);
  return NextResponse.json(allProjects);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  console.log(formData);
  const title = formData.get("title") as string;
  const imageUrl = formData.get("image") as string;

  if (!imageUrl) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }

  await db.insert(projects).values({
    title,
    imageUrl,
    isFeatured: false,
  });

  const [newProject] = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.id))
    .limit(1);

  return NextResponse.json(newProject);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const { id, isFeatured } = await req.json();
  await db.update(projects).set({ isFeatured }).where(eq(projects.id, id));

  return NextResponse.json({ success: true });
}
