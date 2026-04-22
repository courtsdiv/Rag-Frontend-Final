/**
 * ChatInput Component
 *
 * This component is responsible for handling all user input
 * related to asking questions in the chat interface.
 *
 * It:
 * - Allows the user to type a question
 * - Allows the user to upload a text file
 * - Submits questions to the backend
 * - Allows the chat to be cleared
 *
 * This component does NOT:
 * - Call the backend API directly
 * - Perform business logic
 * - Manage application-wide state
 *
 * It delegates actions to handler functions passed in as props.
 */

import styles from "./ChatInput.module.css";
import { FiPlus, FiSend, FiTrash2 } from "react-icons/fi";

/**
 * @param {Object} props
 * @param {string} props.question - The current question typed by the user
 * @param {Function} props.setQuestion - Updates the question state
 * @param {Function} props.setErrorMsg - Updates error messages (handled by parent)
 * @param {Function} props.askBackend - Sends the question to the backend
 * @param {Function} props.clearChat - Clears the current chat state
 * @param {Function} props.handleFileUpload - Handles text file uploads
 */
export default function ChatInput({
  question,
  setQuestion,
  setErrorMsg,
  askBackend,
  clearChat,
  handleFileUpload,
}) {
  return (
    /**
     * Main container for all chat input controls.
     */
    <div className={styles.container}>
      
      {/* 
        Upload button.
        When clicked, this triggers the hidden file input element
        so the user can select a text file to upload.
      */}
      <button
        aria-label="Upload file"
        onClick={() => document.getElementById("fileInput").click()}
        className={styles.uploadButton}
      >
        <FiPlus size={32} strokeWidth={2} />
      </button>

      {/* 
        Hidden file input.
        This is visually hidden and only triggered via the upload button.
        Only .txt files are accepted.
      */}
      <input
        id="fileInput"
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* 
        Text input where the user types their question.
        This is a controlled input bound to the `question` state.
      */}
      <input
        value={question}
        onChange={(e) => {
          // Update question state as the user types
          setQuestion(e.target.value);
        }}
        onKeyDown={(e) => {
          /**
           * If the user presses Enter,
           * prevent the default behaviour and submit the question.
           */
          if (e.key === "Enter") {
            e.preventDefault();
            askBackend();
          }
        }}
        placeholder="Ask a question..."
        className={styles.textInput}
        data-testid="chat-input"
      />

      {/* 
        Ask button.
        This submits the question to the backend.
        The button is disabled if the input is empty or contains only whitespace.
      */}
      <button
        aria-label="Ask"
        onClick={askBackend}
        disabled={!question.trim()}
        className={
          !question.trim() ? styles.askButtonDisabled : styles.askButton
        }
      >
        <FiSend size={20} strokeWidth={2} />
      </button>

      {/* 
        Clear button.
        Clears the current chat and resets related UI state.
      */}
      <button
        onClick={clearChat}
        className={styles.clearButton}
        data-testid="clear-button"
        aria-label="Clear"
      >
        <FiTrash2 size={20} strokeWidth={2} />
      </button>
    </div>
  );
}