/**
 * useFileUpload Hook
 *
 * This custom React hook manages all client-side behaviour
 * related to uploading and indexing text files for the RAG system.
 *
 * It:
 * - Validates uploaded files
 * - Warns users when files are large
 * - Sends file content to the backend for indexing
 * - Tracks upload and processing state
 *
 * This hook does NOT:
 * - Render any UI
 * - Perform chunking or embedding
 * - Interact with the vector database directly
 *
 * It acts as a coordination layer between upload-related UI
 * components and the backend indexing endpoint.
 */

import { useState } from "react";

export function useFileUpload() {
  /**
   * Message returned from the backend after upload/indexing,
   * or client-side validation errors.
   */
  const [uploadFile, setUploadFile] = useState("");

  /**
   * Controls whether the large file warning modal is visible.
   */
  const [showUploadWarning, setShowUploadWarning] = useState(false);

  /**
   * Temporarily stores a file that requires user confirmation
   * before uploading.
   */
  const [pendingFile, setPendingFile] = useState(null);

  /**
   * Indicates whether a file is currently being uploaded
   * and indexed by the backend.
   */
  const [uploading, setUploading] = useState(false);

  /**
   * Sends a validated text file to the backend
   * for chunking, embedding, and indexing.
   */
  async function processFileUpload(file) {
    setUploadFile("");
    setUploading(true);

    /**
     * Read the contents of the text file as a string.
     */
    const text = await file.text();

    try {
      /**
       * Send the file content to the backend indexing endpoint.
       */
      const response = await fetch("/api/Rag/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(text),
      });

      /**
       * Handle non-success responses from the backend.
       */
      if (!response.ok) {
        const data = await response.json();
        setUploadFile(`Error: ${data.errorCode} - ${data.message}`);
        return;
      }

      /**
       * Display success message returned by the backend.
       */
      const result = await response.json();
      setUploadFile(result.message);
    } catch {
      /**
       * Handle network or connectivity errors.
       */
      setUploadFile("Could not reach backend.");
    } finally {
      /**
       * Reset upload state and clear the file input
       * so the same file can be selected again if needed.
       */
      setUploading(false);

      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
    }
  }

  /**
   * Handles file selection from the file input element.
   * Performs validation and decides whether to show
   * a warning modal or proceed directly with upload.
   */
  async function handleFileUpload(e) {
    setUploadFile("");

    const file = e.target.files[0];
    if (!file) return;

    /**
     * Only allow plain text files to ensure predictable
     * chunking and embedding behaviour.
     */
    if (file.type !== "text/plain") {
      setUploadFile("Only .txt files are allowed.");
      return;
    }

    /**
     * File size thresholds.
     *
     * Files over 50KB may take noticeably longer to process,
     * while files over 1MB are not allowed.
     */
    const fiftyKb = 50 * 1024;
    const oneMb = 1_000_000;

    /**
     * Show a warning modal for moderately large files
     * and require explicit user confirmation.
     */
    if (file.size > fiftyKb && file.size <= oneMb) {
      setPendingFile(file);
      setShowUploadWarning(true);
      return;
    }

    /**
     * Proceed immediately for small files.
     */
    await processFileUpload(file);
  }

  /**
   * Cancels the upload after a warning is shown.
   * Resets the pending file and hides the modal.
   */
  function cancelUpload() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";

    setShowUploadWarning(false);
    setPendingFile(null);
  }

  /**
   * Confirms the upload after a warning is shown
   * and proceeds with indexing.
   */
  function confirmUpload() {
    setShowUploadWarning(false);
    processFileUpload(pendingFile);
    setPendingFile(null);
  }

  /**
   * Expose state and actions to UI components.
   */
  return {
    uploadFile,
    uploading,
    showUploadWarning,
    handleFileUpload,
    cancelUpload,
    confirmUpload,
  };
}