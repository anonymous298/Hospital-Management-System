import Navbar from "@/components/user/Navbar/Navbar";
import type { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="absolute top-0 w-full">
        <Navbar />

        <main className="min-h-screen">
            {children}
        </main>

        {/* <Footer/> */}
      </div>
    </>
  );
}
