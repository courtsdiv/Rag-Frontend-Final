/**
 * ErrorBox Component
 *
 * This component is responsible for displaying error information
 * to the user when something goes wrong during a request.
 *
 * It:
 * - Displays a user-friendly error message
 * - Optionally shows HTTP status codes and backend error codes
 *
 * This component does NOT:
 * - Handle error creation
 * - Perform error logging
 * - Decide when an error occurs
 *
 * It simply renders error details passed in from a parent component.
 */

import styles from "./ErrorBox.module.css";

/**
 * @param {Object} props
 * @param {number|null} props.statusCode - HTTP status code returned by the backend (if available)
 * @param {string|null} props.errorCode - Application-specific error code (if available)
 * @param {string} props.message - Human-readable error message to display
 */
export default function ErrorBox({ statusCode, errorCode, message }) {
  /**
   * If no error message exists, do not render the error box.
   *
   * This prevents displaying an empty error container
   * when the application is in a normal state.
   */
  if (!message) return null;

  return (
    /**
     * Container for displaying error information.
     *
     * data-testid is used to support automated testing
     * by providing a stable selector for this component.
     */
    <div
      className={styles.container}
      data-testid="error-box"
    >
      {/* 
        Error title.
        Displays the HTTP status code if provided,
        followed by an optional application-specific error code.
      */}
      <strong className={styles.title}>
        Error {statusCode !== null && statusCode}{" "}
        {errorCode && `(${errorCode})`}
      </strong>

      {/* Human-readable error message for the user */}
      <p className={styles.message}>{message}</p>
    </div>
  );
}
