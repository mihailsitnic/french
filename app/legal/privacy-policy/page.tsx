import styles from "../page.module.scss";

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.doc}>
        <header className={styles.doc__header}>
          <h2 className={styles.doc__title}>Privacy Policy</h2>
          <p className={styles.doc__meta}>Last updated: 19 August 2026</p>
          <p className={styles.doc__intro}>
            This policy explains what personal data Mon Ami collects, how it is
            used, and what rights users have regarding access, correction, and
            deletion.
          </p>
        </header>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>1. Google user data</h3>
          <p className={styles.doc__paragraph}>
            If you sign in with Google OAuth, we may receive your name, email
            address, and profile image for account authentication and profile
            setup.
          </p>
          <ul className={styles.doc__list}>
            <li className={styles.doc__listItem}>
              We do not sell Google user data.
            </li>
            <li className={styles.doc__listItem}>
              We do not use it for advertising.
            </li>
            <li className={styles.doc__listItem}>
              We do not use it to train AI models.
            </li>
          </ul>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>2. Information we collect</h3>
          <ul className={styles.doc__list}>
            <li className={styles.doc__listItem}>
              Account details and profile metadata.
            </li>
            <li className={styles.doc__listItem}>
              Conversation and report content.
            </li>
            <li className={styles.doc__listItem}>
              Usage, diagnostics, and device telemetry.
            </li>
            <li className={styles.doc__listItem}>
              Payment and support records where relevant.
            </li>
          </ul>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>3. How information is used</h3>
          <p className={styles.doc__paragraph}>
            Data is used to provide product functionality, process
            authentication and billing, improve reliability, prevent abuse, and
            comply with legal obligations.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>4. Legal basis and retention</h3>
          <p className={styles.doc__paragraph}>
            Where applicable, processing relies on contract, legitimate
            interests, consent, and legal obligations. Data is retained only for
            as long as needed for service, compliance, and security.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>5. Sharing and transfers</h3>
          <p className={styles.doc__paragraph}>
            Data may be processed by trusted providers for hosting,
            authentication, AI, analytics, payments, and support. We do not sell
            personal data. International transfers are protected using
            appropriate safeguards.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>6. User rights</h3>
          <p className={styles.doc__paragraph}>
            Users may request access, correction, deletion, restriction,
            objection, portability, and consent withdrawal where applicable.
          </p>
        </section>

        <p className={styles.doc__callout}>
          Privacy questions and data requests: mihail.sitnic@gmail.com
        </p>
      </div>
    </div>
  );
}
