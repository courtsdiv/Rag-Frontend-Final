// tests/ask-button.spec.js
import { test, expect } from '@playwright/test';

test('Ask button disables when empty and enables when text is entered', async ({ page }) => {
  await page.goto('/');

  // 🔎 Update this if your actual placeholder text is different
  const input = page.getByPlaceholder('Ask a question...');
  const askButton = page.getByRole('button', { name: 'Ask' });

  // Initially: Ask should be disabled when input is empty
  await expect(askButton).toBeDisabled();

  // Type text into the input
  await input.fill('Hello world');

  // After typing: Ask should be enabled
  await expect(askButton).toBeEnabled();
});