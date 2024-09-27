import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { CheckCircleIcon } from "lucide-react";
import FeatureShowcase from "./landing-feature";

const font = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const testimonials = [
  {
    name: "Harvard University",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Harvard_Wreath_Logo_1.svg/1200px-Harvard_Wreath_Logo_1.svg.png",
  },
  {
    name: "Stanford University",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Stanford_University_seal_2003.svg/1200px-Stanford_University_seal_2003.svg.png",
  },
  {
    name: "Howard University",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Howard_University_seal.svg/1200px-Howard_University_seal.svg.png",
  },
  {
    name: "University of California",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/University_of_California%2C_Berkeley_seal.svg/1200px-University_of_California%2C_Berkeley_seal.svg.png",
  },
];

const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <FeatureShowcase />

      <h2
        className={cn(
          "text-center text-3xl text-white font-extrabold mb-10 mt-20",
          font.className
        )}
      >
        Trusted by people on
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-4/5 md:w-3/4 m-auto">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105"
          >
            <CardHeader>
              <CardTitle>
                <div className="flex flex-col items-center text-center">
                  <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600">
                    {testimonial.name}
                  </p>
                  <img
                    src={testimonial.logo}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-teal-500 mt-4"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 text-center">
              <p className="text-gray-600 text-sm leading-relaxed italic"></p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2
          className={cn(
            "text-center text-3xl text-white font-extrabold mb-10 mt-20",
            font.className
          )}
        >
          Pricing
        </h2>

        <div className="grid gap-y-3 grid-cols-1 sm:grid-cols-2 sm:gap-x-3 w-4/5 md:w-3/4 m-auto text-lg">
          {/* Basic Plan */}
          <Card className="bg-white rounded-lg p-4">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-teal-500 mr-2" />
                  <p className="text-lg text-transparent bg-clip-text bg-teal-400">
                    Basic
                  </p>
                </div>
                <p className="text-3xl mt-2">Free</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-teal-400 mr-2" />
                  Access to the app
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-teal-400 mr-2" />
                  Converse up to 20 contents
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                  Limited features
                </li>
              </ul>
              <div className="text-right mt-6">
                <Button variant="basic" className="rounded-full">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PRO Plan */}
          <div
            className="rounded-lg p-[3px]"
            style={{
              background: "linear-gradient(to right, teal, cyan, blue)",
            }}
          >
            <Card className="bg-white rounded-lg p-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-teal-500 mr-2" />
                    <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600">
                      PRO
                    </p>
                  </div>
                  <p className="text-3xl mt-2">$10</p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-teal-400 mr-2" />
                    Access to the app
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-teal-400 mr-2" />
                    Converse up to 500 contents
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-teal-400 mr-2" />
                    Full features access
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-teal-400 mr-2" />
                    Priority support
                  </li>
                </ul>
                <div className="text-right mt-6">
                  <Button variant="price" className="rounded-full">
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingContent;