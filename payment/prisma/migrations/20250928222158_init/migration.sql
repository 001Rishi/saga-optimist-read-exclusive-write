-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
