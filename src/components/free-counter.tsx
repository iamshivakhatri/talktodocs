"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_COUNTS } from "@/constant";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";
import axios from "axios";
import { useChat as useNum } from "@/context/chat-provider";


interface FreeCounterProps {
//   numberOfMessages: number;
  isPro: boolean;
}

export const FreeCounter = ({  isPro = false }: FreeCounterProps) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();
  
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
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
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
    </div>
  );
};
