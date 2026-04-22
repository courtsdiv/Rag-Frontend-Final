/**
 * ContextList Component
 *
 * This component is responsible for displaying the context
 * chunks that were retrieved from the vector database and
 * used to generate the final answer.
 *
 * It:
 * - Receives an array of context chunks as props
 * - Renders each chunk in a readable list format
 *
 * This component does NOT:
 * - Retrieve context from the backend
 * - Perform similarity search or ranking
 * - Modify or process the chunk content
 *
 * It is purely a presentational component.
 */

import styles from "./ContextList.module.css";

/**
 * @param {Object} props
 * @param {string[]} props.chunks - Array of context strings used by the RAG system
 */
export default function ContextList({ chunks }) {
  /**
   * If no context chunks are provided,
   * or the array is empty, do not render the component.
   *
   * This prevents showing an empty "Context used" section
   * when no retrieval has taken place.
   */
  if (!chunks || chunks.length === 0) return null;

  return (
    /**
     * Container for the list of context chunks.
     *
     * data-testid is used to support automated testing
     * by providing a stable selector for this component.
     */
    <div
      className={styles.container}
      data-testid="context-list"
    >
      {/* Section title to clearly indicate what the content represents */}
      <h3 className={styles.title}>Context used</h3>

      {chunks.map((chunk, index) => (
        /**
         * Each chunk represents a piece of retrieved context
         * that contributed to the generated answer.
         *
         * The index is used as a key here because the list
         * is static and not reordered or modified.
         */
        <div key={index} className={styles.item}>
          {chunk}
        </div>
      ))}
    </div>
  );
}