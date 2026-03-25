// tests/tests/chat-qdrant-unavailable.spec.js
import { test, expect } from '@playwright/test';

test('shows vector DB unavailable error when Qdrant is down', async ({ page }) => {
  // 1. Mock /api/Rag/answer to simulate Qdrant / vector DB being unavailable
  await page.route('**/api/Rag/answer', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({
        errorCode: 'VECTOR_DB_UNAVAILABLE',
        message: 'The vector database is currently unavailable.',
      }),
    });
  });

  // 2. Open the app
  await page.goto('http://localhost:5173/'); // change if your dev URL is different

  // 3. Type any question into the chat input
  const questionInput = page.getByTestId('chat-input');
  await questionInput.fill('Test when Qdrant is unavailable');

  // 4. Click the Ask button
  const askButton = page.getByRole('button', { name: 'Ask' });
  await askButton.click();

  // 5. ErrorBox should be visible with the vector DB unavailable message
  const errorBox = page.getByTestId('error-box');
  await expect(errorBox).toBeVisible();
  await expect(errorBox).toContainText('The vector database is currently unavailable.');
});