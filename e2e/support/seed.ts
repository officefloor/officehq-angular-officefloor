// Shared per-spec data setup (DESIGN.md §9, BASE_CHECKLIST.md §D). Each spec's beforeEach RESETS
// then SEEDS via the app's /__test__ endpoint — this is Arrange, not Assert. Specs still ASSERT
// only through the UI (data-test-id). SKELETON — TODO: finalise the fixture shape per checkpoint.
import { request } from '@playwright/test';

const BASE = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

export async function resetAndSeed(fixture: unknown): Promise<void> {
  const api = await request.newContext({ baseURL: BASE });
  try {
    await api.post('/__test__/reset');
    await api.post('/__test__/seed', { data: fixture });
  } finally {
    await api.dispose();
  }
}

// Usage in a spec:
//   test.beforeEach(async () => { await resetAndSeed({ /* rows this spec needs */ }); });
