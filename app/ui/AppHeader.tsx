import Link from "next/link";
import { ImportDialog } from "@/features/import-book/ui/ImportDialog";
import styles from "./AppHeader.module.scss";

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <Link href="/" className={styles.wordmark}>
            <img src="/logo.png" alt="logo" className={styles.logo} />
            Mon Ami
          </Link>
          <ImportDialog />
        </div>
      </div>
    </header>
  );
}
