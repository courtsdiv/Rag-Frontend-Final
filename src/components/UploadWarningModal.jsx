import styles from "./UploadWarningModal.module.css";

export default function UploadWarningModal({ show, onCancel, onConfirm }) {
  if (!show) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Large File Detected</h3>

        <p className={styles.text}>
          This file is over 50KB and may take longer to process.
        </p>

        <div className={styles.buttonRow}>
          <button onClick={onCancel} className={styles.cancelButton}>
            No
          </button>

          <button onClick={onConfirm} className={styles.confirmButton}>
            Yes, continue
          </button>
        </div>
      </div>
    </div>
  );
}