// tests/tests/chat-clear-button.spec.js
import { test, expect } from '@playwright/test';

test('clear button resets chat input, answer and context', async ({ page }) => {
  // 1. Mock /api/Rag/answer to return an answer + context
  await page.route('**/api/Rag/answer', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        answer: 'A test answer.',
        context: ['Chunk 1', 'Chunk 2'],
      }),
    });
  });

  // 2. Open the app
  await page.goto('/');

  // 3. Type a question and click Ask
  const input = page.getByTestId('chat-input');
  await input.fill('Some question');

  const askButton = page.getByRole('button', { name: 'Ask' });
  await askButton.click();

  // 4. Confirm answer + context are visible
  const answerCard = page.getByTestId('answer-card');
  await expect(answerCard).toBeVisible();

  const contextList = page.getByTestId('context-list');
  await expect(contextList).toBeVisible();

  // 5. Click Clear
  const clearButton = page.getByTestId('clear-button');
  await clearButton.click();

  // 6. Assertions: chat, answer, and context should be cleared

  // Chat input cleared
  await expect(input).toHaveValue('');

  // Answer cleared
  await expect(answerCard).not.toBeVisible();

  // Context cleared
  await expect(contextList).not.toBeVisible();
});