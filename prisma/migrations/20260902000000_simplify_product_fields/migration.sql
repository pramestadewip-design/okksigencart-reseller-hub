-- Simplify Product fields per owner request: fewer fields on the admin
-- form. benefits/audience/deviceSupport/limitations/marketingExplanation
-- are dropped (folded into one free-form "description"); ProductFAQ is
-- dropped entirely in favor of a single "troubleshooting" text field.
-- Table was empty at the time of this migration — no data loss.

-- DropForeignKey
ALTER TABLE "product_faqs" DROP CONSTRAINT "product_faqs_product_id_fkey";

-- DropTable
DROP TABLE "product_faqs";

-- AlterTable
ALTER TABLE "products"
  DROP COLUMN "benefits",
  DROP COLUMN "audience",
  DROP COLUMN "limitations",
  DROP COLUMN "device_support",
  DROP COLUMN "marketing_explanation",
  ADD COLUMN "troubleshooting" TEXT,
  ALTER COLUMN "terms" SET NOT NULL;
