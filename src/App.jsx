/**
 * App Component
 *
 * This is the root component of the frontend application.
 * It is responsible for composing all UI components and hooks
 * that make up the RAG chat interface.
 *
 * It:
 * - Coordinates chat behaviour via the useChat hook
 * - Coordinates file upload behaviour via the useFileUpload hook
 * - Renders the overall page layout
 *
 * This component does NOT:
 * - Contain business logic
 * - Call the backend directly
 * - Manage low-level state for chat or uploads
 *
 * It acts as the composition and orchestration layer.
 */

import UploadWarningModal from "./components/UploadWarningModal";
import ChatInput from "./components/ChatInput";
import Spinner from "./components/Spinner";
import UploadMessage from "./components/UploadMessage";
import ErrorBox from "./components/ErrorBox";

import { useChat } from "./hooks/useChat";
import { useFileUpload } from "./hooks/useFileUpload";

import styles from "./App.module.css";

export default function App() {
  /**
   * Chat-related state and actions.
   * All chat logic is encapsulated inside useChat.
   */
  const {
    messages,
    question,
    setQuestion,
    sendMessage,
    clearChat,
    errorMsg,
    statusCode,
    errorCode,
  } = useChat();

  /**
   * File upload and indexing behaviour.
   * All upload-related logic is encapsulated inside useFileUpload.
   */
  const {
    uploadFile,
    uploading,
    showUploadWarning,
    handleFileUpload,
    cancelUpload,
    confirmUpload,
  } = useFileUpload();

  return (
    <div className={styles.page}>
      {/*
        Modal warning shown when the user selects
        a moderately large file that may take longer to process.
      */}
      <UploadWarningModal
        show={showUploadWarning}
        onCancel={cancelUpload}
        onConfirm={confirmUpload}
      />

      {/*
        Main application card.
        Contains chat history, input, and feedback components.
      */}
      <div className={styles.card}>
        {/* Application title */}
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>RAG Pipeline</h1>
        </div>

        {/*
          Chat history area.
          Displays both user and assistant messages.
        */}
        <div className={styles["chat-history"]}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.bubble} ${styles[msg.role]}`}
            >
              {/* Main message content */}
              <div className={styles["bubble-content"]}>
                {msg.content}
              </div>

              {/*
                Optional context display for assistant messages.
                Shows which retrieved chunks were used to generate the answer.
              */}
              {msg.role === "assistant" &&
                msg.context?.length > 0 && (
                  <div className={styles["bubble-context"]}>
                    <strong>Context used</strong>
                    <ul>
                      {msg.context.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
        </div>

        {/*
          Chat input area.
          Handles user questions, file uploads, and clearing chat.
        */}
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          askBackend={sendMessage}
          clearChat={clearChat}
          handleFileUpload={handleFileUpload}
        />

        {/* Loading indicator shown while indexing is in progress */}
        {uploading && <Spinner />}

        {/* Informational message after file upload/indexing */}
        <UploadMessage message={uploadFile} />

        {/* Centralised error display */}
        <ErrorBox
          statusCode={statusCode}
          errorCode={errorCode}
          message={errorMsg}
        />
      </div>
    </div>
  );
}