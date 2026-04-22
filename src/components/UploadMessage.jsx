/**
 * UploadMessage Component
 *
 * This component is responsible for displaying short status
 * messages related to file uploads.
 *
 * It:
 * - Displays informational messages to the user
 *   (e.g. upload success, indexing started, etc.)
 *
 * This component does NOT:
 * - Handle file uploads
 * - Perform validation or processing
 * - Decide when a message should be shown
 *
 * It simply renders a message passed in from a parent component.
 */

import styles from "./UploadMessage.module.css";

/**
 * @param {Object} props
 * @param {string} props.message - Message to display to the user
 */
export default function UploadMessage({ message }) {
  /**
   * If no message is provided, do not render anything.
   *
   * This prevents showing an empty message box
   * when there is no upload-related feedback to display.
   */
  if (!message) return null;

  return (
    /**
     * Container for displaying upload-related status messages.
     */
    <div className={styles.messageBox}>
      {message}
    </div>
  );
}