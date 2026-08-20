"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import data from "./data";
import styles from "./menu.module.scss";

type MenuPropsTypes = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const Menu = ({ isOpen, setIsOpen }: MenuPropsTypes) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { status } = useSession();

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleLogOutClick = (action?: string) => {
    setIsOpen(false);

    if (action === "logout") {
      handleSignOut();
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.menu}>
          <ul className={styles.menu__list}>
            {data.map((item) => (
              <li key={item.id} className={styles.menu__item}>
                <button
                  type="button"
                  className={styles.menu__button}
                  onClick={() => handleLogOutClick(item.action)}
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    className={styles.menu__icon}
                  />

                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
