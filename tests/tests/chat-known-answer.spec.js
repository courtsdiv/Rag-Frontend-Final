// tests/tests/chat-known-answer.spec.js
import { test, expect } from '@playwright/test';

test('shows answer and context for a known question', async ({ page }) => {
  // 1. Mock /api/Rag/answer to return a known answer + context
  await page.route('**/api/Rag/answer', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        answer: 'A supply chain is the network between a company and its suppliers.',
        context: [
          'Source 1: Supply chain is the network between a company and its suppliers.',
          'Source 2: It covers production, shipment, and distribution.'
        ]
      }),
    });
  });

  // 2. Open your app
  await page.goto('/'); // change if your dev URL is different

  // 3. Type a question into the chat input
  const questionInput = page.getByTestId('chat-input');
  await questionInput.fill('What is a supply chain');

  // 4. Click the Ask button
  const askButton = page.getByRole('button', { name: 'Ask' });
  await askButton.click();

  // 5. Assert that the AnswerCard is shown with the expected answer text
  const answerCard = page.getByTestId('answer-card');
  await expect(answerCard).toBeVisible();
  await expect(answerCard).toContainText(
    'A supply chain is the network between a company and its suppliers.'
  );

  // 6. Assert that the ContextList is shown with our context entries
  const contextList = page.getByTestId('context-list');
  await expect(contextList).toBeVisible();
  await expect(contextList).toContainText('Source 1: Supply chain is the network between a company and its suppliers.');
  await expect(contextList).toContainText('Source 2: It covers production, shipment, and distribution.');
});