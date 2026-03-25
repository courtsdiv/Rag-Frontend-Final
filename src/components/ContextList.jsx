import styles from "./ContextList.module.css";

export default function ContextList({ chunks }) {
  if (!chunks || chunks.length === 0) return null;

  return (
    <div className={styles.container}
    data-testid="context-list">
      <h3 className={styles.title}>Context used</h3>

      {chunks.map((chunk, index) => (
        <div key={index} className={styles.item}>
          {chunk}
        </div>
      ))}
    </div>
  );
}