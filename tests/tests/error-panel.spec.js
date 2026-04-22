// tests/error-panel.spec.js
import { test, expect } from '@playwright/test';

test('shows an error message when the backend returns an error', async ({ page }) => {
  // 1. Go to your running frontend
  await page.goto('/');

  // 2. Mock /api/Rag/answer to return an ApiError response
  await page.route('**/api/Rag/answer', async route => {
    // Simulate your backend error shape
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'The AI model is currently unavailable.',
        errorCode: 'LLM_UNAVAILABLE',
      }),
    });
  });

  // 3. Fill in a question
  const input = page.getByPlaceholder(/ask a question/i);
  await input.fill('What is Qdrant?');

  // 4. Click the Ask button
  const askButton = page.getByRole('button', { name: /ask/i });
  await askButton.click();

  // 5. Assert that the error panel/message appears
  await expect(
    page.getByText(/ai model is currently unavailable/i)
  ).toBeVisible();
});