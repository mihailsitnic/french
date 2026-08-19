"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Modal } from "../modal";
import Image from "next/image";

export interface SignOutProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const SignOut = ({ isOpen, setIsOpen }: SignOutProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { status } = useSession();

  const isLoadingSession = status === "loading";
  const loading = isLoadingSession || isSubmitting;

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Are you sure?"
      description="You will be logged out of your account and will need to log in again to access your data."
      icon={<Image src="/alert.svg" alt="Alert" width={20} height={20} />}
      footer={
        <>
          <button onClick={() => setIsOpen(false)}>Cancel</button>

          <button onClick={handleSignOut}>Log out</button>
        </>
      }
    />
  );
};
