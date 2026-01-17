-- CreateTable
CREATE TABLE "newsletter_expansions" (
    "id" TEXT NOT NULL,
    "newsletter_id" TEXT NOT NULL,
    "bulletPoints" TEXT[],
    "expandedContent" TEXT NOT NULL,
    "model" TEXT NOT NULL DEFAULT 'claude-sonnet-4',
    "tokens_used" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_expansions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "source" TEXT DEFAULT 'website',
    "resend_contact_id" TEXT,
    "subscribed_at" TIMESTAMP(3),
    "unsubscribed_at" TIMESTAMP(3),
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "bulletPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contentMdx" TEXT,
    "contentHtml" TEXT,
    "resend_broadcast_id" TEXT,
    "resend_audience_id" TEXT,
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "emails_sent" INTEGER NOT NULL DEFAULT 0,
    "emails_delivered" INTEGER NOT NULL DEFAULT 0,
    "emails_opened" INTEGER NOT NULL DEFAULT 0,
    "emails_clicked" INTEGER NOT NULL DEFAULT 0,
    "emails_bounced" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "users" ADD COLUMN "audience_segment" TEXT;

-- CreateIndex
CREATE INDEX "newsletter_expansions_newsletter_id_idx" ON "newsletter_expansions"("newsletter_id");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_email_key" ON "newsletter_subscriptions"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_resend_contact_id_key" ON "newsletter_subscriptions"("resend_contact_id");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_email_status_idx" ON "newsletter_subscriptions"("email", "status");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_status_idx" ON "newsletter_subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_slug_key" ON "newsletters"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_resend_broadcast_id_key" ON "newsletters"("resend_broadcast_id");

-- CreateIndex
CREATE INDEX "newsletters_sent_at_idx" ON "newsletters"("sent_at");

-- CreateIndex
CREATE INDEX "newsletters_status_scheduled_at_idx" ON "newsletters"("status", "scheduled_at");
