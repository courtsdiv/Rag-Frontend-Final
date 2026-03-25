import { useState } from "react";

import UploadWarningModal from "./components/UploadWarningModal";
import ChatInput from "./components/ChatInput";
import Spinner from "./components/Spinner";
import UploadMessage from "./components/UploadMessage";
import ErrorBox from "./components/ErrorBox";
import AnswerCard from "./components/AnswerCard";
import ContextList from "./components/ContextList";

import styles from "./App.module.css";

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [contextChunks, setContextChunks] = useState([]);

  const [statusCode, setStatusCode] = useState(null);
  const [errorCode, setErrorCode] = useState("");
  const [uploadFile, setUploadFile] = useState("");

  const [showUploadWarning, setShowUploadWarning] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // PROCESS FILE UPLOAD
  async function processFileUpload(file) {
    setUploadFile("");
    setUploading(true);

    const text = await file.text();

    try {
      const response = await fetch("/api/Rag/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(text),
      });

      if (!response.ok) {
        const data = await response.json();
        setUploadFile(`Error: ${data.errorCode} - ${data.message}`);
        return;
      }

      const result = await response.json();
      setUploadFile(result.message);
    } catch (err) {
      setUploadFile("Could not reach backend.");
    } finally {
      setUploading(false);
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
    }
  }

  // FILE UPLOAD HANDLER
  async function handleFileUpload(e) {
    setUploadFile("");

    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      setUploadFile("Only .txt files are allowed.");
      return;
    }

    const fiftyKb = 50 * 1024;
    const oneMb = 1_000_000;

    if (file.size > fiftyKb && file.size <= oneMb) {
      setPendingFile(file);
      setShowUploadWarning(true);
      return;
    }

    await processFileUpload(file);
  }

  // CLEAR CHAT
  function clearChat() {
    setQuestion("");
    setAnswer("");
    setContextChunks([]);
    setErrorMsg("");
    setStatusCode(null);
    setErrorCode("");
    setUploadFile("");
  }

  // ASK BACKEND
  async function askBackend() {
    setContextChunks([]);
    setErrorMsg("");
    setStatusCode(null);
    setErrorCode("");
    setAnswer("Loading...");

    try {
      const response = await fetch("/api/Rag/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        setStatusCode(response.status);

        if (!contentType.includes("application/json")) {
          setErrorMsg("Could not reach the backend.");
          setErrorCode("BACKEND_OFFLINE");
          setAnswer("");
          return;
        }

        const data = await response.json();
        setErrorMsg(data.message || "Something went wrong.");
        setErrorCode(data.errorCode || "UNKNOWN_ERROR");
        setAnswer("");
        return;
      }

      const data = await response.json();

      if (!data.answer) {
        setErrorMsg("No answer found.");
        setErrorCode("NO_ANSWER");
        return;
      }

      setAnswer(data.answer);
      setContextChunks(data.context || []);
    } catch (err) {
      setErrorMsg("Could not reach the backend.");
      setErrorCode("BACKEND_OFFLINE");
      setAnswer("");
    }
  }

  return (
    <div className={styles.page}>
      <UploadWarningModal
        show={showUploadWarning}
        onCancel={() => {
          const fileInput = document.getElementById("fileInput");
          if (fileInput) fileInput.value = "";
          setShowUploadWarning(false);
          setPendingFile(null);
        }}
        onConfirm={() => {
          setShowUploadWarning(false);
          processFileUpload(pendingFile);
          setPendingFile(null);
          const fileInput = document.getElementById("fileInput");
          if (fileInput) fileInput.value = "";
        }}
      />

      <div className={styles.card}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Query Mind</h1>
        </div>

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          setErrorMsg={setErrorMsg}
          askBackend={askBackend}
          clearChat={clearChat}
          handleFileUpload={handleFileUpload}
        />

        {uploading && <Spinner />}

        <UploadMessage message={uploadFile} />

        <ErrorBox
          statusCode={statusCode}
          errorCode={errorCode}
          message={errorMsg}
        />

        {answer && !errorMsg && <AnswerCard answer={answer} />}

        <ContextList chunks={contextChunks} />
      </div>
    </div>
  );
}