// tests/tests/chat-backend-offline.spec.js
import { test, expect } from '@playwright/test';

test('shows backend offline error when API returns non-JSON', async ({ page }) => {
  // 1. Mock /api/Rag/answer to simulate backend offline / broken response
  await page.route('**/api/Rag/answer', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'text/plain', // NOT JSON -> triggers BACKEND_OFFLINE branch
      body: 'Internal Server Error',
    });
  });

  // 2. Open the app
  await page.goto('/'); // change if your dev URL is different

  // 3. Type any question
  const questionInput = page.getByTestId('chat-input');
  await questionInput.fill('Test when backend is offline');

  // 4. Click the Ask button
  const askButton = page.getByRole('button', { name: 'Ask' });
  await askButton.click();

  // 5. ErrorBox should be visible with the backend offline message
  const errorBox = page.getByTestId('error-box');
  await expect(errorBox).toBeVisible();
  await expect(errorBox).toContainText('Could not reach the backend.');
});