/**
 * AnswerCard Component
 *
 * This component is responsible for displaying the answer returned
 * from the backend RAG system.
 *
 * It:
 * - Receives an answer as a prop from a parent component
 * - Displays the answer in a styled card layout
 *
 * This component does NOT:
 * - Fetch data from the backend
 * - Perform any business logic
 * - Modify or process the answer content
 *
 * It is purely a presentational component.
 */

import styles from "./AnswerCard.module.css";

/**
 * Displays the answer text if an answer exists.
 *
 * @param {Object} props
 * @param {string} props.answer - The answer text returned from the backend
 */
export default function AnswerCard({ answer }) {
  /**
   * If no answer has been provided yet,
   * we return null so that nothing is rendered.
   *
   * This avoids showing an empty or unnecessary UI element
   * before the user submits a question.
   */
  if (!answer) return null;

  return (
    /**
     * Container for the answer card.
     *
     * data-testid is used to support automated testing
     * by providing a stable selector for this component.
     */
    <div
      className={styles.container}
      data-testid="answer-card"
    >
      {/* Static title to clearly label the section for the user */}
      <h2 className={styles.title}>Answer</h2>

      {/* Displays the answer text returned from the backend */}
      <p className={styles.answerText}>{answer}</p>
    </div>
  );
}
``