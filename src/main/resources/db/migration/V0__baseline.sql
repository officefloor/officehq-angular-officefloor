-- Baseline migration. The base starts with NO DOMAIN TABLES (BASE_CHECKLIST.md §A).
-- cp01 adds the first real tables as V1__*.sql. Keep only extension/test-support scaffolding here,
-- if any. Never edit an applied migration; each checkpoint adds a new versioned file.
SELECT 1;
