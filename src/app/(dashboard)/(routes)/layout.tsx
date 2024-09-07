import NavbarComponent from "@/components/navbar-component";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col flex-grow bg-gray-100 h-full">
      <div className="sticky top-0 z-50  bg-gray-900 text-white  border-gray-400">
        <NavbarComponent />
      </div>
      {children}
    </div>
  );
};

export default LandingLayout;
