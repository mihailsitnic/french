"use client";
import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import styles from "./modal.module.scss";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  icon,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modal__overlay} />

        <Dialog.Content
          className={`${styles.modal__content} ${styles[`modal__content--${size}`]}`}
        >
          <header className={styles.modal__header}>
            <Dialog.Title className={styles.modal__title}>
              {icon && <span className={styles.modal__icon}>{icon}</span>}
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                className={styles.modal__close}
                aria-label="Close modal"
              >
                <Image src="/x.svg" alt="Close" width={24} height={24} />
              </button>
            </Dialog.Close>
          </header>

          {description && (
            <Dialog.Description className={styles.modal__description}>
              {description}
            </Dialog.Description>
          )}

          {children && <div className={styles.modal__body}>{children}</div>}

          {footer && <footer className={styles.modal__footer}>{footer}</footer>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
