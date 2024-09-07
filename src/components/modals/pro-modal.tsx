"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";

// interface ProModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   loading: boolean;
// }

export const ProModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Upgrade to Pro"
      description="Subscribe now to unlock unlimited conversations and advanced features!"
      isOpen={proModal.isOpen}
      onClose={proModal.onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button variant={"outline"} onClick={proModal.onClose}>
          Cancel
        </Button>

        <Button variant={"price"} onClick={() => {
          // Add your subscription logic here
          console.log("Redirecting to subscription page...");
          proModal.onClose();
        }}>
          Subscribe Now
        </Button>
      </div>
    </Modal>
  );
};
