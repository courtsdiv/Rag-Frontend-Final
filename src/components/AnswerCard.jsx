import styles from "./AnswerCard.module.css";

export default function AnswerCard({ answer }) {
  if (!answer) return null;

  return (
    <div className={styles.container}
    data-testid="answer-card">
      <h2 className={styles.title}>Answer</h2>
      <p className={styles.answerText}>{answer}</p>
    </div>
  );
}