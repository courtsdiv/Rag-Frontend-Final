import { test, expect } from '@playwright/test';

test('shows LLM unavailable error when model is unavailable', async ({ page }) => {
  // Mock the backend to simulate LLM failure
  await page.route('**/api/Rag/answer', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({
        errorCode: 'LLM_UNAVAILABLE',
        message: 'The AI model is currently unavailable.',
      }),
    });
  });

  await page.goto('/');

  const questionInput = page.getByTestId('chat-input');
  await questionInput.fill('Test LLM unavailable');

  const askButton = page.getByRole('button', { name: 'Ask' });
  await askButton.click();

  const errorBox = page.getByTestId('error-box');
  await expect(errorBox).toBeVisible();
  await expect(errorBox).toContainText('The AI model is currently unavailable.');
});