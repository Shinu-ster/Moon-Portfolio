import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function GET() {
  const allProjects = await db.select().from(projects);
  return NextResponse.json(allProjects);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const image = formData.get("image") as File;

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "projects" }, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
      .end(buffer);
  });

  await db.insert(projects).values({
    title,
    imageUrl: upload.secure_url,
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request){
    const { id } = await req.json();
    await db.delete(projects).where(eq(projects.id,id));
    return NextResponse.json({success: true})
}