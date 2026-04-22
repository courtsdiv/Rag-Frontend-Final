/**
 * Spinner Component
 *
 * This component is responsible for indicating to the user
 * that a background process is currently running.
 *
 * In this application, it is primarily used while:
 * - A file is being uploaded
 * - Documents are being chunked
 * - Embeddings are being generated
 * - Data is being indexed into the vector database
 *
 * This component does NOT:
 * - Control when loading starts or stops
 * - Perform any background processing
 * - Interact with the backend
 *
 * It is a purely presentational loading indicator.
 */

import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    /**
     * Container for the spinner and status message.
     *
     * data-testid is used to support automated testing
     * by providing a stable selector for loading states.
     */
    <div
      className={styles.spinnerContainer}
      data-testid="upload-spinner"
    >
      {/* 
        Visual loading indicator.
        The animation itself is handled via CSS.
      */}
      <div className={styles.spinnerCircle}></div>

      {/* Informational text explaining what is currently happening */}
      Uploading & indexing file...
    </div>
  );
}
