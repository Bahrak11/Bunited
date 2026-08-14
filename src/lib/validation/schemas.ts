import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().optional(),
  nationality: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

export const applicationStep1Schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  nationality: z.string().min(2),
  dateOfBirth: z.string(),
});

export const applicationStep2Schema = z.object({
  degreeLevel: z.enum(["BACHELOR", "MASTER", "PHD"]),
  programId: z.string().optional(),
  universityId: z.string().optional(),
  preferredCity: z.string().optional(),
  desiredProgram: z.string().optional(),
});

export const applicationStep3Schema = z.object({
  academicInfo: z.object({
    previousSchool: z.string().optional(),
    gpa: z.string().optional(),
    graduationYear: z.string().optional(),
    languageProficiency: z.string().optional(),
    additionalInfo: z.string().optional(),
  }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

export const universitySchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  type: z.enum(["PUBLIC", "PRIVATE"]),
  description: z.string().min(10),
  logoUrl: z.string().optional(),
  coverImageUrl: z.string().optional(),
  ranking: z.number().optional(),
  website: z.string().url().optional().or(z.literal("")),
  accommodationInfo: z.string().optional(),
  scholarshipInfo: z.string().optional(),
  admissionRequirements: z.string().optional(),
  applicationDeadline: z.string().optional(),
  hasScholarship: z.boolean().optional(),
});

export const programSchema = z.object({
  name: z.string().min(2),
  field: z.string().min(2),
  degreeLevel: z.enum(["BACHELOR", "MASTER", "PHD"]),
  language: z.string().min(2),
  tuitionFee: z.number().min(0),
  currency: z.string().default("USD"),
  duration: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  hasScholarship: z.boolean().optional(),
  universityId: z.string(),
  facultyId: z.string().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(5000),
  applicationId: z.string().optional(),
});

export const notificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  studentId: z.string().optional(),
  applicationId: z.string().optional(),
  type: z
    .enum(["APPLICATION_UPDATE", "DOCUMENT_UPDATE", "MESSAGE", "PAYMENT", "SYSTEM"])
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
