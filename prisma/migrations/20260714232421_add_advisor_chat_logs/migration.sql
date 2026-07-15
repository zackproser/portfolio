-- CreateTable
CREATE TABLE IF NOT EXISTS "advisor_chat_logs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" TEXT,
    "turn" INTEGER NOT NULL DEFAULT 1,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "via" TEXT,
    "tools" TEXT,
    "posts" TEXT,

    CONSTRAINT "advisor_chat_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "advisor_chat_logs_session_id_idx" ON "advisor_chat_logs"("session_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "advisor_chat_logs_created_at_idx" ON "advisor_chat_logs"("created_at");
