"use client";
import LandingContent from "@/components/landing-content";
import LandingHero from "@/components/landing-hero";
import LandingNavbar from "@/components/landing-navbar";
import Link from "next/link";



export default function Home() {

 
  return (
    <div>
      <LandingNavbar />
      <LandingHero />
      <LandingContent />      
    </div>

   
  );
}
