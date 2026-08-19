import styles from "../page.module.scss";

export default function Terms() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.doc}>
        <header className={styles.doc__header}>
          <h2 className={styles.doc__title}>Terms of Service</h2>
          <p className={styles.doc__meta}>Last updated: 19 August 2026</p>

          <p className={styles.doc__intro}>
            Welcome to Mon Ami. These Terms of Service govern your use of Mon
            Ami.com and the services available through the website.
          </p>

          <p className={styles.doc__intro}>
            By using Mon Ami, you agree to these Terms. If you do not agree with
            them, please do not use the Service.
          </p>
        </header>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>1. About Mon Ami</h3>

          <p className={styles.doc__paragraph}>
            Mon Ami is an educational platform designed to help people learn
            languages through reading.
          </p>

          <p className={styles.doc__paragraph}>The Service may allow you to:</p>

          <ul className={styles.doc__list}>
            <li>Read bilingual and adapted texts.</li>
            <li>
              View French text together with English or other translations.
            </li>
            <li>
              Import your own text for translation and language-learning
              purposes.
            </li>
            <li>Generate bilingual word and phrase alignments.</li>
            <li>Listen to AI-generated pronunciation of words and phrases.</li>
            <li>
              Use other language-learning tools that we may introduce in the
              future.
            </li>
          </ul>

          <p className={styles.doc__paragraph}>
            Mon Ami is intended as a learning aid and does not guarantee that
            translations, pronunciations, explanations, or other generated
            content will always be accurate.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>2. AI-Generated Content</h3>

          <p className={styles.doc__paragraph}>
            Some features of Mon Ami use artificial intelligence and third-party
            AI services to generate translations, align words and phrases, and
            produce audio pronunciation.
          </p>

          <p className={styles.doc__paragraph}>
            AI-generated content may contain mistakes, omissions, awkward
            translations, or inaccurate interpretations.
          </p>

          <p className={styles.doc__paragraph}>
            You should treat generated translations and explanations as learning
            aids rather than authoritative linguistic, academic, legal,
            professional, or factual advice.
          </p>

          <p className={styles.doc__paragraph}>
            We may use third-party providers for translation, artificial
            intelligence, text processing, text-to-speech generation, hosting,
            and infrastructure. Their availability may affect the availability
            of Mon Ami features.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>3. Text You Import</h3>

          <p className={styles.doc__paragraph}>
            You may be able to paste or import text into Mon Ami. You retain any
            rights you already have in content you submit.
          </p>

          <p className={styles.doc__paragraph}>
            By submitting content, you give Mon Ami limited permission to
            process that content solely as necessary to provide the Service,
            including translating, analysing, formatting, aligning, and
            generating audio from it.
          </p>

          <p className={styles.doc__paragraph}>
            You are responsible for ensuring that you have the right to submit
            and process the content you upload.
          </p>

          <p className={styles.doc__paragraph}>
            You must not use Mon Ami to upload or process material in a way that
            infringes copyright, privacy rights, intellectual property rights,
            or other legal rights.
          </p>

          <p className={styles.doc__paragraph}>
            Mon Ami does not acquire ownership of books, texts, or other
            material simply because they are processed through the Service.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>
            4. Copyright and Published Books
          </h3>

          <p className={styles.doc__paragraph}>
            Many books and translations are protected by copyright.
          </p>

          <p className={styles.doc__paragraph}>
            Mon Ami may provide tools that allow users to process text for
            personal learning purposes, but the availability of those tools does
            not give you permission to reproduce, distribute, publish, or
            commercially exploit copyrighted material.
          </p>

          <p className={styles.doc__paragraph}>
            You are responsible for determining whether your use of a particular
            text is permitted by law or by the relevant rights holder.
          </p>

          <p className={styles.doc__paragraph}>
            Content made publicly available directly by Mon Ami may consist of
            public-domain material, appropriately licensed material, original
            content, or other material that we are legally entitled to provide.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>5. Acceptable Use</h3>

          <p className={styles.doc__paragraph}>You agree not to use Mon Ami:</p>

          <ul className={styles.doc__list}>
            <li>For unlawful purposes.</li>
            <li>
              To infringe another person's intellectual property or privacy
              rights.
            </li>
            <li>
              To attempt to gain unauthorised access to the Service or its
              infrastructure.
            </li>
            <li>To interfere with or disrupt the operation of the Service.</li>
            <li>
              To circumvent usage limits, security controls, or access
              restrictions.
            </li>
            <li>
              To make automated requests at a volume that could harm the Service
              or generate unreasonable costs.
            </li>
            <li>
              To use Mon Ami&apos;s APIs or server endpoints as an unauthorised
              proxy for third-party AI or text-to-speech services.
            </li>
            <li>
              To introduce malware, malicious code, or other harmful material.
            </li>
          </ul>

          <p className={styles.doc__paragraph}>
            We may restrict or block access where we reasonably believe the
            Service is being abused.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>6. Audio and Pronunciation</h3>

          <p className={styles.doc__paragraph}>
            Mon Ami may generate pronunciation audio using third-party
            text-to-speech technology. Audio is generated for educational
            purposes.
          </p>

          <p className={styles.doc__paragraph}>
            Pronunciation, rhythm, accent, emphasis, and voice characteristics
            may not perfectly represent every native speaker or regional variety
            of French.
          </p>

          <p className={styles.doc__paragraph}>
            Generated voices must not be treated as recordings of a particular
            real person unless explicitly stated otherwise.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>
            7. Availability of the Service
          </h3>

          <p className={styles.doc__paragraph}>
            We may modify, suspend, remove, or introduce features at any time.
          </p>

          <p className={styles.doc__paragraph}>
            Because Mon Ami may rely on third-party services and infrastructure,
            we cannot guarantee uninterrupted or error-free availability.
          </p>

          <p className={styles.doc__paragraph}>
            We may impose reasonable limits on:
          </p>

          <ul className={styles.doc__list}>
            <li>The amount of text that can be imported.</li>
            <li>The number of translations or audio generations.</li>
            <li>Request frequency.</li>
            <li>Usage of computationally expensive features.</li>
          </ul>

          <p className={styles.doc__paragraph}>
            These limits may change as the Service develops.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>8. Free and Paid Features</h3>

          <p className={styles.doc__paragraph}>
            Some or all Mon Ami features may currently be provided free of
            charge.
          </p>

          <p className={styles.doc__paragraph}>
            We may introduce paid features, subscriptions, usage limits, or
            additional plans in the future.
          </p>

          <p className={styles.doc__paragraph}>
            If we introduce paid services, the applicable pricing and any
            additional terms will be clearly presented before you purchase them.
          </p>

          <p className={styles.doc__paragraph}>
            Nothing in these Terms requires you to purchase future paid
            features.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>9. Third-Party Services</h3>

          <p className={styles.doc__paragraph}>
            Mon Ami may rely on third-party services such as AI providers,
            hosting providers, analytics services, and text-to-speech providers.
          </p>

          <p className={styles.doc__paragraph}>
            When necessary to provide a feature you request, information you
            submit may be processed by these providers.
          </p>

          <p className={styles.doc__paragraph}>
            Your use of certain features may therefore also be subject to the
            technical limitations and applicable terms of those providers.
          </p>

          <p className={styles.doc__paragraph}>
            Mon Ami is not responsible for outages or failures caused by
            third-party services that are outside our reasonable control.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>10. Privacy</h3>

          <p className={styles.doc__paragraph}>
            Your privacy is important to us. Information about how we collect,
            use, process, and store personal information is described separately
            in our Privacy Policy.
          </p>

          <p className={styles.doc__paragraph}>
            Where third-party AI or infrastructure providers process data on our
            behalf, we aim to limit the information shared to what is reasonably
            necessary to provide the requested functionality.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>
            11. Intellectual Property in Mon Ami
          </h3>

          <p className={styles.doc__paragraph}>
            Except for user-provided content and third-party material, the Mon
            Ami website, branding, interface, software, design, and original
            content are owned by or licensed to Mon Ami and are protected by
            applicable intellectual property laws.
          </p>

          <p className={styles.doc__paragraph}>
            You may use the Service for its intended purpose.
          </p>

          <p className={styles.doc__paragraph}>
            You may not copy, resell, reproduce, reverse engineer, or
            commercially exploit substantial parts of Mon Ami except where
            permitted by law or with our permission.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>
            12. No Guarantee of Learning Outcomes
          </h3>

          <p className={styles.doc__paragraph}>
            Mon Ami is a language-learning tool.
          </p>

          <p className={styles.doc__paragraph}>
            We do not guarantee that using Mon Ami will result in a particular
            level of language proficiency, examination result, academic result,
            or other learning outcome.
          </p>

          <p className={styles.doc__paragraph}>
            Your progress depends on many factors, including how you use the
            Service.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>
            13. Disclaimer and Limitation of Liability
          </h3>

          <p className={styles.doc__paragraph}>
            We aim to provide a useful and reliable Service, but Mon Ami is
            provided subject to the limitations described in these Terms.
          </p>

          <p className={styles.doc__paragraph}>
            To the extent permitted by law, we are not responsible for losses
            caused solely by:
          </p>

          <ul className={styles.doc__list}>
            <li>Temporary unavailability of the Service.</li>
            <li>Inaccurate AI-generated translations or pronunciation.</li>
            <li>Your reliance on generated content.</li>
            <li>Third-party service outages.</li>
            <li>Use of Mon Ami in a way that is contrary to these Terms.</li>
          </ul>

          <p className={styles.doc__paragraph}>
            Nothing in these Terms excludes or limits liability where it would
            be unlawful to do so.
          </p>

          <p className={styles.doc__paragraph}>
            Nothing in these Terms affects any statutory rights you may have as
            a consumer.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>14. Changes to These Terms</h3>

          <p className={styles.doc__paragraph}>
            We may update these Terms as Mon Ami develops or where changes are
            required for legal, technical, security, or operational reasons.
          </p>

          <p className={styles.doc__paragraph}>
            The latest version will be published on this page together with the
            date it was last updated.
          </p>

          <p className={styles.doc__paragraph}>
            If a material change significantly affects how you use the Service,
            we will take reasonable steps to make the change clear.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>
            15. Termination and Suspension
          </h3>

          <p className={styles.doc__paragraph}>
            You may stop using Mon Ami at any time.
          </p>

          <p className={styles.doc__paragraph}>
            We may suspend or restrict access where reasonably necessary to:
          </p>

          <ul className={styles.doc__list}>
            <li>Protect the Service or its users.</li>
            <li>Prevent abuse or unlawful activity.</li>
            <li>Enforce these Terms.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>16. Governing Law</h3>

          <p className={styles.doc__paragraph}>
            These Terms are governed by the laws of England and Wales, except
            where applicable consumer law gives you mandatory rights under the
            law of another jurisdiction.
          </p>

          <p className={styles.doc__paragraph}>
            If you are a consumer, nothing in this section removes any mandatory
            legal protections available to you.
          </p>
        </section>

        <section className={styles.doc__section}>
          <h3 className={styles.doc__heading}>17. Contact</h3>

          <p className={styles.doc__paragraph}>
            If you have questions about these Terms, please contact us at:
          </p>

          <p className={styles.doc__paragraph}>
            <a href="mailto:mihail.sitnic@gmail.com">mihail.sitnic@gmail.com</a>
          </p>

          <p className={styles.doc__paragraph}>
            Website: <a href="https://monami.fun/">https://monami.fun/</a>
          </p>
        </section>
      </div>
    </div>
  );
}
