"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_COUNTS } from "@/constant";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";
import { useChat as useNum } from "@/context/chat-provider";
import { Modal } from "@/components/ui/modal";


interface FreeCounterProps {
//   numberOfMessages: number;
  isPro: boolean;
}

export const FreeCounter = ({  isPro = false }: FreeCounterProps) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();
  const [showModal, setShowModal] = useState(false); // New state to control modal

  
  const {incrementMessages, numberOfMessages} = useNum(); 




  useEffect(() => {
    setMounted(true);
  }, []);




  if (!mounted) {
    return null;
  }



  if (isPro) return null;

  const handleSubscription = async () => {
    try {
      // const response = await axios.get('/api/stripe');
      // window.location.href = response.data.url;
      setShowModal(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="px-3 ">
      <Card className="bg-gray-300 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-black mb-4">
            <p>{numberOfMessages}/{MAX_FREE_COUNTS} Free Generations</p>
            <Progress value={(numberOfMessages / MAX_FREE_COUNTS) * 100} max={MAX_FREE_COUNTS} className="mt-2" />
          </div>
          <Button onClick={handleSubscription} className="w-full" variant="price">
            Upgrade
            <Zap className="h-5 w-5 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>

      {showModal && (
        <Modal
          isOpen={showModal} // Ensures the modal is open based on showModal state
          onClose={() => setShowModal(false)}
          title="Upgrade Information"
          description="Information about the upgrade feature"
        >
          <p className="text-teal-900 p-4 rounded-lg">
          <span className="font-semibold text-teal-900">Heads up!</span> This upgrade feature is still in the testing phase, 
          as this project remains a hobby for now. Going live with upgrades will require additional resources, so payments aren’t 
          being accepted yet. There is a stripe integration in place.
          <br /><br />
          If you're interested in upgrading or have feature suggestions, there is a stripe integration in place so feel free to reach out at{" "}
          <a href="mailto:shiva.khatri01@gmail.com" className="text-teal-900 underline">
            shiva.khatri01@gmail.com
          </a>.
        </p>

        </Modal>
      )}

    </div>
  );
};
