import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "PDF Chat Creation",
    description: "Upload any PDF and instantly create an interactive chat experience. Our advanced AI processes the content, allowing you to engage with your documents in a conversational manner.",
    imageSrc: "/api/placeholder/480/270", // Placeholder for GIF
    alt: "PDF to Chat Conversion"
  },
  {
    title: "YouTube Video Insights",
    description: "Enter a YouTube URL to generate a chat based on the video content. Our system analyzes the audio and provides a chat interface to discuss and explore the video's content in depth.",
    imageSrc: "/api/placeholder/480/270", // Placeholder for GIF
    alt: "YouTube URL to Chat"
  },
  {
    title: "Audio to Chat Conversion",
    description: "Record or upload audio to create a chat interface for easy interaction. Perfect for podcasts, lectures, or any audio content you want to explore through conversation.",
    imageSrc: "/api/placeholder/480/270", // Placeholder for GIF
    alt: "Audio Recording to Chat"
  }
];

const FeatureShowcase = () => {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-200">
          Powerful Features at Your Fingertips
        </h2>
        <div className="space-y-24">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden shadow-lg border-0">
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="md:w-1/2">
                  <img
                    className="h-64 w-full object-cover md:h-full"
                    src={feature.imageSrc}
                    alt={feature.alt}
                  />
                </div>
                <CardContent className="p-8 md:w-1/2 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <Button className="self-start bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                    Learn More
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;