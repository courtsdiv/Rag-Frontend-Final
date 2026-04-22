/**
 * UploadWarningModal Component
 *
 * This component is responsible for warning the user
 * when they attempt to upload a large file.
 *
 * It:
 * - Displays a modal dialog when a file exceeds a size threshold
 * - Informs the user that processing may take longer
 * - Allows the user to either cancel or proceed
 *
 * This component does NOT:
 * - Perform file size validation
 * - Handle file uploads
 * - Control indexing or backend processing
 *
 * It is a purely presentational confirmation modal.
 */

import styles from "./UploadWarningModal.module.css";

/**
 * @param {Object} props
 * @param {boolean} props.show - Controls whether the modal is visible
 * @param {Function} props.onCancel - Called when the user cancels the upload
 * @param {Function} props.onConfirm - Called when the user confirms and proceeds
 */
export default function UploadWarningModal({ show, onCancel, onConfirm }) {
  /**
   * If the modal should not be shown,
   * return null so nothing is rendered.
   *
   * This keeps the modal fully controlled
   * by the parent component.
   */
  if (!show) return null;

  return (
    /**
     * Backdrop that visually separates the modal
     * from the rest of the application and prevents
     * interaction with underlying content.
     */
    <div className={styles.backdrop}>
      {/*
        Modal container.
        Holds the warning message and user action buttons.
      */}
      <div className={styles.modal}>
        {/* Modal title to clearly explain the reason for the warning */}
        <h3 className={styles.title}>Large File Detected</h3>

        {/* Informational text explaining the potential impact */}
        <p className={styles.text}>
          This file is over 50KB and may take longer to process.
        </p>

        {/*
          Action buttons.
          The user can either cancel the upload
          or confirm that they wish to continue.
        */}
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