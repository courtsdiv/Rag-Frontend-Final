/**
 * useChat Hook
 *
 * This custom React hook manages all client-side state and behaviour
 * related to the chat interaction with the RAG backend.
 *
 * It:
 * - Stores chat messages (user + assistant)
 * - Tracks the current question being typed
 * - Handles sending questions to the backend
 * - Manages loading, error, and response states
 *
 * This hook does NOT:
 * - Render any UI components
 * - Perform retrieval, embedding, or generation itself
 * - Contain backend or business logic
 *
 * It acts as a coordination layer between the UI
 * and the backend API.
 */

import { useState } from "react";

export function useChat() {
  /**
   * Array of chat messages displayed in the UI.
   * Includes both user messages and assistant responses.
   */
  const [messages, setMessages] = useState([]);

  /**
   * Current question being typed into the chat input.
   */
  const [question, setQuestion] = useState("");

  /**
   * Human-readable error message to display to the user.
   */
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * HTTP status code returned by the backend (if available).
   */
  const [statusCode, setStatusCode] = useState(null);

  /**
   * Application-specific error code returned by the backend.
   */
  const [errorCode, setErrorCode] = useState("");

  /**
   * Sends the current question to the backend RAG API
   * and updates the chat state with the response.
   */
  async function sendMessage() {
    /**
     * Prevent sending empty or whitespace-only questions.
     */
    if (!question.trim()) return;

    /**
     * Construct the user message object.
     */
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    /**
     * Generate a unique ID for the assistant message.
     * This allows us to update the placeholder message
     * once the backend response arrives.
     */
    const assistantId = crypto.randomUUID();

    /**
     * Placeholder assistant message shown while the backend
     * is processing the request.
     */
    const loadingAssistant = {
      id: assistantId,
      role: "assistant",
      content: "Thinking…",
      isLoading: true,
    };

    /**
     * Add the user message and loading assistant message
     * to the chat immediately for responsive UI feedback.
     */
    setMessages((prev) => [...prev, userMessage, loadingAssistant]);

    /**
     * Capture the question text before clearing the input.
     */
    const questionText = question;
    setQuestion("");

    try {
      /**
       * Send the question to the backend RAG endpoint.
       */
      const response = await fetch("/api/Rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: questionText }),
      });

      /**
       * Handle non-success HTTP responses.
       */
      if (!response.ok) {
        let errorBody = null;

        try {
          /**
           * Attempt to parse error details from the response body.
           */
          errorBody = await response.json();
        } catch {
          // Response did not contain a JSON body
        }

        /**
         * Create a standardised error object so the UI
         * can handle all errors consistently.
         */
        const error = new Error(
          errorBody?.message || "Could not reach the backend."
        );

        error.errorCode =
          errorBody?.errorCode || "BACKEND_OFFLINE";

        error.statusCode = response.status;

        throw error;
      }

      /**
       * Parse the successful response.
       */
      const data = await response.json();

      /**
       * Defensive check to ensure a reply was returned.
       */
      if (!data.reply) {
        throw new Error("No reply returned");
      }

      /**
       * Replace the loading assistant message
       * with the final response from the backend.
       *
       * Context chunks are stored alongside the message
       * so they can be displayed in the UI if needed.
       */
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: data.reply,
                context: data.context || [],
                isLoading: false,
              }
            : msg
        )
      );
    } catch (err) {
      /**
       * Extract error details with sensible fallbacks.
       */
      const message =
        err?.message || "Could not reach the backend.";

      const code =
        err?.errorCode || "BACKEND_OFFLINE";

      /**
       * Update the assistant message to display the error
       * instead of a normal response.
       */
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: message,
                isLoading: false,
                isError: true,
              }
            : msg
        )
      );

      /**
       * Store error details for display in a central error UI.
       */
      setErrorMsg(message);
      setErrorCode(code);
      setStatusCode(err?.statusCode ?? null);
    }
  }

  /**
   * Clears the current chat and resets all related state.
   */
  function clearChat() {
    setMessages([]);
    setQuestion("");
    setErrorMsg("");
    setStatusCode(null);
    setErrorCode("");
  }

  /**
   * Expose state and actions to UI components.
   */
  return {
    messages,
    question,
    setQuestion,
    sendMessage,
    clearChat,
    errorMsg,
    statusCode,
    errorCode,
  };
}
