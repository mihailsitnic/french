"use client";
import { useState, useMemo } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.scss";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { status } = useSession();
  const searchParams = useSearchParams();

  const callbackUrl = useMemo(() => {
    const rawCallback = searchParams.get("callbackUrl");

    if (!rawCallback) return "/";

    return rawCallback.startsWith("/") ? rawCallback : "/";
  }, [searchParams]);

  const isLoading = status === "loading";
  const loading = isLoading || isSubmitting;

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    await signIn("google", { callbackUrl });
    setIsSubmitting(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <section className={styles.card}>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={styles.signInBtn}
          >
            Sign in with Google
          </button>

          <p className={styles.legal}>
            By clicking Sign In you agree to Mon Ami&apos;s <br />
            <Link className={styles.legal__link} href="/legal/privacy-policy">
              Privacy Policy
            </Link>
            <span className={styles.legal__separator}> and </span>
            <Link className={styles.legal__link} href="/legal/terms">
              Terms of Service
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default SignInPage;
