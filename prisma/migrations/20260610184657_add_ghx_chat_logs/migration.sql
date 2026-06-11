-- CreateTable
CREATE TABLE IF NOT EXISTS "ghx_chat_logs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "via" TEXT,

    CONSTRAINT "ghx_chat_logs_pkey" PRIMARY KEY ("id")
);
