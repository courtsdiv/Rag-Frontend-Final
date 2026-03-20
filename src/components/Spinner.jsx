import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinnerCircle}></div>
      Uploading & indexing file...
    </div>
  );
}