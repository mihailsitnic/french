"use client";
import { useState } from "react";
import { SignOut } from "./sign-out";
import Link from "next/link";
import Image from "next/image";
import data from "./data";
import styles from "./menu.module.scss";

type MenuPropsTypes = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const Menu = ({ isOpen, setIsOpen }: MenuPropsTypes) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogOutClick = (action?: string) => {
    setIsOpen(false);

    if (action === "logout") {
      setIsLogoutModalOpen(true);
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.menu}>
          <ul className={styles.menu__list}>
            {data.map((item) => (
              <li key={item.id} className={styles.menu__item}>
                {item.link ? (
                  <Link
                    className={styles.menu__link}
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      className={styles.menu__icon}
                    />

                    {item.title}
                  </Link>
                ) : (
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
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <SignOut isOpen={isLogoutModalOpen} setIsOpen={setIsLogoutModalOpen} />
    </>
  );
};
