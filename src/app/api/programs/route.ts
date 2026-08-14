import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const degreeLevel = searchParams.get("degreeLevel") || "";
    const field = searchParams.get("field") || "";
    const city = searchParams.get("city") || "";
    const universityId = searchParams.get("universityId") || "";
    const language = searchParams.get("language") || "";
    const minTuition = searchParams.get("minTuition");
    const maxTuition = searchParams.get("maxTuition");

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { field: { contains: search } },
        { university: { name: { contains: search } } },
        { university: { city: { contains: search } } },
      ];
    }

    if (degreeLevel) {
      where.degreeLevel = degreeLevel;
    }

    if (field) {
      where.field = { contains: field };
    }

    if (language) {
      where.language = { contains: language };
    }

    if (universityId) {
      where.universityId = universityId;
    }

    if (city) {
      where.university = { ...where.university, city: { equals: city } };
    }

    if (minTuition || maxTuition) {
      where.tuitionFee = {};
      if (minTuition) where.tuitionFee.gte = parseFloat(minTuition);
      if (maxTuition) where.tuitionFee.lte = parseFloat(maxTuition);
    }

    const programs = await prisma.program.findMany({
      where,
      include: {
        university: {
          select: {
            id: true,
            slug: true,
            name: true,
            city: true,
            type: true,
            logoUrl: true,
          },
        },
      },
      orderBy: { tuitionFee: "asc" },
    });

    return apiSuccess({ programs });
  } catch (error: any) {
    console.error("GET Programs Error:", error);
    return apiError(error.message || "Failed to fetch programs", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req, true);
    if (!session || session.role !== "ADMIN") {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { name, field, degreeLevel, language, tuitionFee, duration, description, requirements, universityId, facultyId } = body;

    if (!name || !field || !degreeLevel || !tuitionFee || !universityId) {
      return apiError("Required fields missing", 400);
    }

    const university = await prisma.university.findUnique({ where: { id: universityId } });
    if (!university) return apiError("University not found", 404);

    const slug = `${slugify(university.name)}-${slugify(name)}-${degreeLevel.toLowerCase()}`;

    const program = await prisma.program.create({
      data: {
        slug,
        name,
        field,
        degreeLevel,
        language: language || "English",
        tuitionFee: parseFloat(tuitionFee),
        duration,
        description,
        requirements,
        universityId,
        facultyId: facultyId || null,
      },
    });

    return apiSuccess({ program }, "Program created successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create program", 500);
  }
}
