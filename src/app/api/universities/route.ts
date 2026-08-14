import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const type = searchParams.get("type") || "";
    const hasScholarship = searchParams.get("hasScholarship");

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } },
      ];
    }

    if (city) {
      where.city = { equals: city };
    }

    if (type) {
      where.type = { equals: type };
    }

    if (hasScholarship === "true") {
      where.hasScholarship = true;
    }

    const universities = await prisma.university.findMany({
      where,
      include: {
        _count: {
          select: { programs: true },
        },
      },
      orderBy: { ranking: "asc" },
    });

    return apiSuccess({ universities });
  } catch (error: any) {
    console.error("GET Universities Error:", error);
    return apiError(error.message || "Failed to fetch universities", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req, true);
    if (!session || session.role !== "ADMIN") {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { name, city, type, description, logoUrl, coverImageUrl, ranking, website, accommodationInfo, scholarshipInfo, admissionRequirements } = body;

    if (!name || !city || !type) {
      return apiError("Name, city, and type are required", 400);
    }

    const slug = slugify(name);

    const university = await prisma.university.create({
      data: {
        slug,
        name,
        city,
        type,
        description: description || "",
        logoUrl,
        coverImageUrl,
        ranking: ranking ? parseInt(ranking) : null,
        website,
        accommodationInfo,
        scholarshipInfo,
        admissionRequirements,
      },
    });

    return apiSuccess({ university }, "University created successfully", 201);
  } catch (error: any) {
    console.error("POST University Error:", error);
    return apiError(error.message || "Failed to create university", 500);
  }
}
