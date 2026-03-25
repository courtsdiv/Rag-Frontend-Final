// tests/tests/upload-file.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';

// Re‑use these paths in all tests
const smallFilePath = path.join(process.cwd(), 'tests', 'tests', 'sample-upload.txt');
const largeFilePath = path.join(process.cwd(), 'tests', 'tests', 'large-sample.txt');

/**
 * Happy path: upload a small .txt file and show success message
 */
test('uploads a .txt file and shows success message', async ({ page }) => {
  // 1. Mock the backend /api/Rag/index call so the test is deterministic
  await page.route('**/api/Rag/index', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Text indexed successfully.',
      }),
    });
  });

  // 2. Go to your running app
  await page.goto('http://localhost:5173/'); // adjust if different

  // 3. Click the visible upload button (aria-label="Upload file")
  const uploadButton = page.getByRole('button', { name: 'Upload file' });
  await uploadButton.click();

  // 4. Attach the .txt file to the hidden <input id="fileInput" ... />
  const fileInput = page.locator('#fileInput');
  await fileInput.setInputFiles(smallFilePath);

  // 5. Assert the success message shown by UploadMessage
  await expect(page.getByText(/text indexed successfully/i)).toBeVisible();
});

/**
 * Spinner appears while upload is in progress
 * Requires Spinner component to render: data-testid="upload-spinner"
 */
test('shows spinner while file is uploading', async ({ page }) => {
  // Delay the backend response so spinner stays visible briefly
  await page.route('**/api/Rag/index', async (route) => {
    await new Promise((r) => setTimeout(r, 1000)); // 1 second delay
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Text indexed successfully.',
      }),
    });
  });

  await page.goto('http://localhost:5173/');

  const uploadButton = page.getByRole('button', { name: 'Upload file' });
  await uploadButton.click();

  const fileInput = page.locator('#fileInput');
  await fileInput.setInputFiles(smallFilePath);

  // Spinner should appear while upload is in progress
  await expect(page.getByTestId('upload-spinner')).toBeVisible();

  // After upload finishes, spinner should disappear and success message be shown
  await expect(page.getByTestId('upload-spinner')).not.toBeVisible();
  await expect(page.getByText(/text indexed successfully/i)).toBeVisible();
});

/**
 * Large file: warning appears, clicking "No" cancels upload
 * Assumes warning text includes "Large file detected"
 * and buttons are labelled "No" and "Yes, continue"
 */
test('large file shows warning and "No" cancels upload', async ({ page }) => {
  let apiCalled = false;

  await page.route('**/api/Rag/index', async (route) => {
    apiCalled = true;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Text indexed successfully.',
      }),
    });
  });

  await page.goto('http://localhost:5173/');

  const uploadButton = page.getByRole('button', { name: 'Upload file' });
  await uploadButton.click();

  const fileInput = page.locator('#fileInput');
  await fileInput.setInputFiles(largeFilePath);

  // Warning modal appears
  const warningText = page.getByText(/large file detected/i);
  await expect(warningText).toBeVisible();

  // Click "No" to cancel the upload
  const noButton = page.getByRole('button', { name: 'No' });
  await noButton.click();

  // Warning should disappear
  await expect(warningText).not.toBeVisible();

  // Backend should NOT have been called
  expect(apiCalled).toBeFalsy();
});

/**
 * Large file: warning appears, clicking "Yes, continue" proceeds with upload
 */
test('large file warning and "Yes, continue" proceeds with upload', async ({ page }) => {
  await page.route('**/api/Rag/index', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Text indexed successfully.',
      }),
    });
  });

  await page.goto('http://localhost:5173/');

  const uploadButton = page.getByRole('button', { name: 'Upload file' });
  await uploadButton.click();

  const fileInput = page.locator('#fileInput');
  await fileInput.setInputFiles(largeFilePath);

  // Warning modal appears
  const warningText = page.getByText(/large file detected/i);
  await expect(warningText).toBeVisible();

  // Click "Yes, continue" to proceed
  const yesButton = page.getByRole('button', { name: 'Yes, continue' });
  await yesButton.click();

  // After confirming, upload should complete and success message should show
  await expect(page.getByText(/text indexed successfully/i)).toBeVisible();
});