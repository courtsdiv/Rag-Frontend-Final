import styles from "./UploadMessage.module.css";

export default function UploadMessage({ message }) {
  if (!message) return null;

  return (
    <div className={styles.messageBox}>
      {message}
    </div>
  );
}