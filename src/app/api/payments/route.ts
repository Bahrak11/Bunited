import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req, false);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.userId },
    });

    if (!student) return apiError("Student not found", 404);

    const body = await req.json();
    const { applicationId, amount = 150, currency = "USD", description = "Application Processing Fee", gateway = "MOCK_GATEWAY" } = body;

    const transactionId = `TXN-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        transactionId,
        amount: parseFloat(amount),
        currency,
        status: "COMPLETED",
        description,
        gateway,
        paidAt: new Date(),
        studentId: student.id,
        applicationId: applicationId || null,
        gatewayData: {
          mockProcessed: true,
          gatewayRef: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        },
      },
    });

    // Notify student
    await prisma.notification.create({
      data: {
        title: "Payment Received",
        message: `Your payment of ${currency} ${amount} (${description}) was received successfully. Transaction ID: ${transactionId}`,
        type: "PAYMENT",
        studentId: student.id,
        applicationId: applicationId || null,
      },
    });

    return apiSuccess({ payment }, "Payment recorded successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to process payment", 500);
  }
}
