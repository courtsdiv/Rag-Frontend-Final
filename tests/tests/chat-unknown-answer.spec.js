// tests/tests/chat-unknown-answer.spec.js
import { test, expect } from '@playwright/test';

test("shows fallback answer and context when question is unknown", async ({ page }) => {
  // 1. Mock /api/Rag/answer to return a "don't know" style answer + context
  await page.route("**/api/Rag/answer", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: "The provided documents do not contain this information.",
        context: [
          "We searched all indexed documents but did not find relevant information.",
        ],
      }),
    });
  });

  // 2. Open the app
  await page.goto("http://localhost:5173/"); // change if your dev URL is different

  // 3. Type an unknown question into the chat input
  const questionInput = page.getByTestId("chat-input");
  await questionInput.fill("What is a table");

  // 4. Click the Ask button
  const askButton = page.getByRole("button", { name: "Ask" });
  await askButton.click();

  // 5. AnswerCard should be visible with our fallback message
  const answerCard = page.getByTestId("answer-card");
  await expect(answerCard).toBeVisible();
  await expect(answerCard).toContainText(
    "The provided documents do not contain this information."
  );

  // 6. ContextList should be visible with the context we mocked
  const contextList = page.getByTestId("context-list");
  await expect(contextList).toBeVisible();
  await expect(contextList).toContainText(
    "We searched all indexed documents but did not find relevant information."
  );
});