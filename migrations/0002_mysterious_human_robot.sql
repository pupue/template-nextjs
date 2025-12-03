DROP INDEX "idx_transactions_date";--> statement-breakpoint
ALTER TABLE `categories` ALTER COLUMN "type" TO "type" text NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_transactions_date` ON `transactions` (`date`);