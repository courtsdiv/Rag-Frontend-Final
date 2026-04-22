import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    <div
      className={styles.spinnerContainer}
      data-testid="upload-spinner"
    >
      <div className={styles.spinnerCircle}></div>
      Uploading & indexing file...
    </div>
  );
}