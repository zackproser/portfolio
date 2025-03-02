-- CreateTable
CREATE TABLE "free_chapter_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL,
    "product_slug" TEXT NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilled" BOOLEAN NOT NULL DEFAULT false,
    "fulfilled_date" TIMESTAMP(3),

    CONSTRAINT "free_chapter_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "free_chapter_requests_email_idx" ON "free_chapter_requests"("email");

-- CreateIndex
CREATE INDEX "free_chapter_requests_product_slug_idx" ON "free_chapter_requests"("product_slug");

-- CreateIndex
CREATE UNIQUE INDEX "free_chapter_requests_email_product_slug_key" ON "free_chapter_requests"("email", "product_slug");

-- AddForeignKey
ALTER TABLE "free_chapter_requests" ADD CONSTRAINT "free_chapter_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE; 