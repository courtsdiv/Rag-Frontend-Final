import styles from "./ErrorBox.module.css";

export default function ErrorBox({ statusCode, errorCode, message }) {
  if (!message) return null;

  return (
    <div className={styles.container}
    data-testid="error-box">
      <strong className={styles.title}>
        Error {statusCode !== null && statusCode}{" "}
        {errorCode && `(${errorCode})`}
      </strong>
      <p className={styles.message}>{message}</p>
    </div>
  );
}