import styles from "./page.module.scss";

export default function Home() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Read in French, understand in English.</h1>
      <p className={styles.lead}>
        Import a passage from a book with the <strong>+ Import</strong> button above. Each French
        word or phrase appears with its English translation underneath — hover a pair to see it
        together, click the French to hear it pronounced.
      </p>
    </section>
  );
}
