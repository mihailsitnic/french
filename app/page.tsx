import styles from "./page.module.scss";

export default function Home() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Read in French, understand in English.</h1>
      <p className={styles.lead}>
        Import a passage from a book with the <strong>+ Import</strong> button
        above. Each French word or phrase appears with its English translation
        underneath — hover a pair to see it together, click the French to hear
        it pronounced.
      </p>
      <p className={styles.lead}>
        Learn French one small conversation at a time. Don't try to learn
        hundreds of words at once. Instead, spend just five minutes a day
        exploring one real-life situation from different angles. Order a coffee,
        buy a croissant, ask for directions, or introduce yourself.
      </p>

      <p className={styles.lead}>
        Repeat the same scenario throughout the week until it feels natural.
        Small, consistent steps build real confidence and real conversations. 🥰
      </p>
    </section>
  );
}
