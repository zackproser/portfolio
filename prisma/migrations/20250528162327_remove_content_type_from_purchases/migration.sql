/*
  Warnings:

  - You are about to drop the column `content_type` on the `email_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `content_type` on the `purchases` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,content_slug,email_type]` on the table `email_notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,content_slug,email_type]` on the table `email_notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,content_slug]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,content_slug]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "email_notifications_email_content_type_content_slug_email_t_key";

-- DropIndex
DROP INDEX "email_notifications_user_id_content_type_content_slug_email_key";

-- DropIndex
DROP INDEX "purchases_email_content_type_content_slug_key";

-- DropIndex
DROP INDEX "purchases_user_id_content_type_content_slug_key";

-- AlterTable
ALTER TABLE "email_notifications" DROP COLUMN "content_type";

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "content_type";

-- CreateIndex
CREATE UNIQUE INDEX "email_notifications_user_id_content_slug_email_type_key" ON "email_notifications"("user_id", "content_slug", "email_type");

-- CreateIndex
CREATE UNIQUE INDEX "email_notifications_email_content_slug_email_type_key" ON "email_notifications"("email", "content_slug", "email_type");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_user_id_content_slug_key" ON "purchases"("user_id", "content_slug");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_email_content_slug_key" ON "purchases"("email", "content_slug");
