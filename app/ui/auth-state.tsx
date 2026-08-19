"use client";
import { FC } from "react";
import { useSession } from "next-auth/react";
import { User } from "./user";
import Link from "next/link";
import styles from "./AppHeader.module.scss";

export const AuthState: FC = () => {
  const { status, data: session } = useSession();

  switch (status) {
    case "unauthenticated":
      return (
        <Link className={styles["header__login"]} href="/sign-in">
          Sign In
        </Link>
      );
    case "authenticated":
      return <User data={session.user} />;
    case "loading":
      return <span>loading...</span>;
    default:
      return null;
  }
};
