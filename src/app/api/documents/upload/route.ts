import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req, false);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const applicationId = formData.get("applicationId") as string | null;

    if (!file || !type || !applicationId) {
      return apiError("File, document type, and application ID are required", 400);
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
      return apiError("Invalid file type. Only PDF, JPG, PNG, and WebP are allowed.", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiError("File size exceeds maximum limit of 10MB.", 400);
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/${filename}`;

    const documentRecord = await prisma.document.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: publicPath,
      },
    });

    const appDoc = await prisma.applicationDocument.create({
      data: {
        applicationId,
        documentId: documentRecord.id,
        type: type as any,
        status: "PENDING",
      },
      include: {
        document: true,
      },
    });

    return apiSuccess({ document: appDoc }, "Document uploaded successfully", 201);
  } catch (error: any) {
    console.error("Upload Error:", error);
    return apiError(error.message || "Failed to upload document", 500);
  }
}
