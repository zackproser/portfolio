-- Migrate article purchases to the new unified purchases table
-- This migration assumes that users have already been migrated with their IDs preserved

-- Article purchases
INSERT INTO "purchases" ("id", "userId", "contentType", "contentSlug", "purchaseDate", "stripePaymentId", "amount", "email")
VALUES
  ('ap_24', '44', 'article', 'rag-pipeline-tutorial', '2025-01-05 22:37:52.697325', 'pi_3Qe2S9EDHFkvZ1e919kovYeJ', 20.00, 'sm@intermine.com'),
  ('ap_25', '46', 'article', 'multiple-git-profiles-automated', '2025-01-06 16:48:46.237759', 'pi_3QeJTrEDHFkvZ1e91FkOTL4x', 5.00, 'zack@workos.com'),
  ('ap_26', '46', 'article', 'rag-pipeline-tutorial', '2025-01-06 17:21:31.11189', 'pi_3QeJzYEDHFkvZ1e90SkxPbDw', 20.00, 'zack@workos.com'),
  ('ap_35', '3', 'article', 'multiple-git-profiles-automated', '2025-01-07 03:28:28.355286', 'pi_3QeTSvEDHFkvZ1e90UBgdWQX', 5.00, 'zackproser@gmail.com'),
  ('ap_36', '51', 'article', 'rag-pipeline-tutorial', '2025-01-07 08:03:38.465116', 'pi_3QeXlEEDHFkvZ1e90z3u4q2g', 20.00, 'mishkin.connectev@gmail.com'),
  ('ap_37', '61', 'article', 'rag-pipeline-tutorial', '2025-02-08 22:02:19.518672', 'pi_3QqM1vEDHFkvZ1e915JrCPBH', 49.00, 'chitouatanda@gmail.com'),
  ('ap_38', '63', 'article', 'rag-pipeline-tutorial', '2025-02-15 14:43:50.396869', 'pi_3QsmatEDHFkvZ1e90OnrXMN6', 49.00, 's.coulter555@gmail.com');

-- Note: The course purchases table was empty in the snapshot, so no course purchases to migrate

-- Migrate course enrollments
-- Note: This assumes the courses table has already been migrated with the same IDs
INSERT INTO "courseenrollments" ("enrollment_id", "user_id", "course_id", "enrollment_date")
VALUES
  (1, '31', 1, '2024-03-13 15:09:41.954371'),
  (3, '33', 1, '2024-03-13 15:13:32.324942'),
  (4, '34', 1, '2024-03-13 15:15:09.969793'),
  (5, '35', 1, '2024-03-13 15:16:37.427016'),
  (6, '36', 1, '2024-03-13 15:17:38.194543'),
  (7, '37', 1, '2024-03-13 15:18:45.742278'); 