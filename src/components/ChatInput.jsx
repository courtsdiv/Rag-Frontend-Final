import styles from "./ChatInput.module.css";
import { FiPlus, FiSend, FiTrash2 } from "react-icons/fi";

export default function ChatInput({
  question,
  setQuestion,
  setErrorMsg,
  askBackend,
  clearChat,
  handleFileUpload,
}) {
  return (
    <div className={styles.container}>
      {/* Upload button on left */}
      <button
        onClick={() => document.getElementById("fileInput").click()}
        className={styles.uploadButton}
      >
        <FiPlus size={32} strokeWidth={2} />
      </button>

      {/* Hidden file input */}
      <input
        id="fileInput"
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Text input */}
      <input
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          if (e.target.value.trim()) setErrorMsg("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && question.trim()) {
            e.preventDefault();
            askBackend();
          }
        }}
        placeholder="Ask a question..."
        className={styles.textInput}
      />

      {/* Ask button */}
      <button
        onClick={askBackend}
        disabled={!question.trim()}
        className={
          !question.trim()
            ? styles.askButtonDisabled
            : styles.askButton
        }
      >
        <FiSend size={20} strokeWidth={2} />
      </button>

      {/* Clear button */}
      <button onClick={clearChat} className={styles.clearButton}>
        <FiTrash2 size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
