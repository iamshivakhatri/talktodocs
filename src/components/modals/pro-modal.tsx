"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Upgrade to Pro"
      description="Subscribe now to unlock unlimited conversations and advanced features!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={loading} variant={"price"} onClick={() => {
          // Add your subscription logic here
          console.log("Redirecting to subscription page...");
          onClose();
        }}>
          Subscribe Now
        </Button>
      </div>
    </Modal>
  );
};
