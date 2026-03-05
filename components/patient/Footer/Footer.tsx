import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-20">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-5">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl text-[#14B8A6] font-bold text-[#0F172A]">
              MediCare
            </h2>
            <p className="text-sm text-gray-500">
              Smart hospital management and seamless doctor appointment
              booking system designed to simplify healthcare access.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#0F172A]">Quick Links</h3>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#14B8A6] transition">
                Home
              </Link>
              <Link href="/doctors" className="hover:text-[#14B8A6] transition">
                Our Doctors
              </Link>
              <Link href="/services" className="hover:text-[#14B8A6] transition">
                Services
              </Link>
              <Link href="/contact" className="hover:text-[#14B8A6] transition">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#0F172A]">Services</h3>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p>Dental Care</p>
              <p>Cardiology</p>
              <p>Neurology</p>
              <p>General Medicine</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#0F172A]">Contact</h3>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p>support@medicare.com</p>
              <p>+92 300 1234567</p>
              <p>Karachi, Pakistan</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-[#E5E7EB] mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MediCare. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;