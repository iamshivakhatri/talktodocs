const AuthLayout = ({ children }: {children: React.ReactNode}) => {
    return (
         <div className="flex items-center justify-center h-full bg-green-950">
        {children}

        </div>
    );
}

export default AuthLayout;