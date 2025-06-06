-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "github_username" TEXT,
    "avatar_url" TEXT,
    "followers_count" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "content_type" TEXT NOT NULL,
    "content_slug" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_payment_id" TEXT,
    "amount" DECIMAL(65,30),
    "email" TEXT,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT,
    "content_type" TEXT NOT NULL,
    "content_slug" TEXT NOT NULL,
    "email_type" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_notifications_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "vector_databases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_founded" INTEGER NOT NULL,
    "company_funding" TEXT NOT NULL,
    "company_employees" INTEGER NOT NULL,
    "business_info" JSONB,
    "performance_latency" TEXT NOT NULL,
    "performance_throughput" TEXT NOT NULL,
    "performance_scalability" TEXT NOT NULL,
    "query_latency_ms" INTEGER NOT NULL,
    "indexing_speed_vectors_per_sec" INTEGER NOT NULL,
    "memory_usage_mb" INTEGER NOT NULL,
    "scalability_score" INTEGER NOT NULL,
    "accuracy_score" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "security" JSONB NOT NULL,
    "algorithms" JSONB NOT NULL,
    "search_capabilities" JSONB NOT NULL,
    "ai_capabilities" JSONB NOT NULL,
    "deployment" JSONB,
    "scalability_info" JSONB,
    "data_management" JSONB,
    "vector_similarity_search" JSONB,
    "integration_api" JSONB,
    "community_ecosystem" JSONB,
    "pricing" JSONB,
    "additional_features" JSONB,
    "specific_details" JSONB,

    CONSTRAINT "vector_databases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT,
    "conversation" JSONB NOT NULL,
    "lead_score" DOUBLE PRECISION NOT NULL,
    "is_potential_lead" BOOLEAN NOT NULL DEFAULT true,
    "reasons" TEXT[],
    "topics" TEXT[],
    "next_steps" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contacted_at" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo_url" TEXT,
    "category" TEXT NOT NULL,
    "pricing" TEXT,
    "website_url" TEXT NOT NULL,
    "github_url" TEXT,
    "open_source" BOOLEAN,
    "api_access" BOOLEAN,
    "documentation_quality" TEXT,
    "community_size" TEXT,
    "last_updated" TEXT,
    "features" TEXT[],
    "pros" TEXT[],
    "cons" TEXT[],
    "license" TEXT,
    "languages" TEXT[],
    "review_count" INTEGER,
    "review_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_user_id_content_type_content_slug_key" ON "purchases"("user_id", "content_type", "content_slug");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_email_content_type_content_slug_key" ON "purchases"("email", "content_type", "content_slug");

-- CreateIndex
CREATE UNIQUE INDEX "email_notifications_user_id_content_type_content_slug_email_key" ON "email_notifications"("user_id", "content_type", "content_slug", "email_type");

-- CreateIndex
CREATE UNIQUE INDEX "email_notifications_email_content_type_content_slug_email_t_key" ON "email_notifications"("email", "content_type", "content_slug", "email_type");

-- CreateIndex
CREATE INDEX "free_chapter_requests_email_idx" ON "free_chapter_requests"("email");

-- CreateIndex
CREATE INDEX "free_chapter_requests_product_slug_idx" ON "free_chapter_requests"("product_slug");

-- CreateIndex
CREATE UNIQUE INDEX "free_chapter_requests_email_product_slug_key" ON "free_chapter_requests"("email", "product_slug");

-- CreateIndex
CREATE UNIQUE INDEX "vector_databases_name_key" ON "vector_databases"("name");

-- CreateIndex
CREATE INDEX "chat_messages_session_id_idx" ON "chat_messages"("session_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_notifications" ADD CONSTRAINT "email_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "free_chapter_requests" ADD CONSTRAINT "free_chapter_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
