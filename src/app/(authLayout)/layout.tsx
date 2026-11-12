import Image from "next/image";
import logo from "@/assets/logo.svg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#f7f3ee] px-4 py-10">
      <Image
        src={logo}
        width={200}
        height={200}
        alt="Dashboard logo"
        priority
        className="h-auto w-[180px]"
      />
      <div className="w-full max-w-[600px]">{children}</div>
    </main>
  );
};

export default AuthLayout;
