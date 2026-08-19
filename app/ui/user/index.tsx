"use client";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Menu } from "../menu";
import Image from "next/image";
import styles from "./user.module.scss";

export type UserPropsTypes = {
  data?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export const User = ({ data }: UserPropsTypes) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleToggleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  };

  useEffect(() => {
    const closeMenuOnClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenuOnClickOutside);
    document.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenuOnClickOutside);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, []);

  if (!data) return null;

  const userInitial = data.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <div ref={containerRef} className={styles["user-container"]}>
      <div
        className={styles["user"]}
        onClick={toggleMenu}
        onKeyDown={handleToggleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {data.image ? (
          <Image
            className={styles["user__avatar"]}
            src={data.image}
            alt={data.name ?? "User avatar"}
            width={32}
            height={32}
          />
        ) : (
          <span className={styles["user__avatar-fallback"]} aria-hidden="true">
            {userInitial}
          </span>
        )}
        <span className={styles["user__details"]}>
          <h4 className={styles["user__name"]}>{data.name}</h4>
          <p className={styles["user__email"]}>{data.email}</p>
        </span>
        <span
          className={`
                        ${styles["user__arrow"]}
                        ${isOpen ? styles["user__arrow--active"] : ""}
                    `}
        />
      </div>
      <Menu isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};
