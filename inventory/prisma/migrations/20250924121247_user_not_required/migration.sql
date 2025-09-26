-- DropForeignKey
ALTER TABLE "public"."Inventory" DROP CONSTRAINT "Inventory_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Inventory" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Inventory" ADD CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
