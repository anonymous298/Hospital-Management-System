import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="w-full bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">

        {/* Left Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight">
            Smart & Simple
            <span className="text-[#14B8A6]"> Hospital Management</span>
          </h1>

          <p className="text-gray-600 max-w-lg mx-auto lg:mx-0">
            Manage appointments, doctors, patients and payments in one
            powerful system. Designed to make hospital workflows faster,
            smarter and more efficient.
          </p>

          <div className="flex gap-4 justify-center lg:justify-start">
            <Button className="bg-[#14B8A6] hover:bg-[#0d9488] text-white">
              Book Appointment
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className="border-[#E5E7EB] text-[#0F172A]"
              >
                View Doctors
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/HeroSection.svg"
            alt="medical illustration"
            width={420}
            height={420}
            className="object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;