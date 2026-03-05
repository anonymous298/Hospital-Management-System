import CallToActionSection from "@/components/patient/Landing/CallToActionSection";
import DoctorListingPreview from "@/components/patient/Landing/DoctorListingPreview";
import FeaturesSection from "@/components/patient/Landing/FeaturesSection";
import HeroSection from "@/components/patient/Landing/HeroSection";
import HowItWorksSection from "@/components/patient/Landing/HowItWorksSection";
import StatisticsSection from "@/components/patient/Landing/StatisticsSection";
import TestimonialsSection from "@/components/patient/Landing/TestimonialsSection";


export default function Home() {

  return (
    <div>

        {/* Hero Section for our Patient Landing Page */}
        <HeroSection/>

        {/* Features Section for our Patient Landing Page */}
        <FeaturesSection/>

        {/* Doctor Listing preview section for our Patient Landing Page */}
        <DoctorListingPreview/>

        {/* How It Works Section for our Patient Landing Page */}
        <HowItWorksSection/>

        {/* Testimonial Section for our Patient Landing Page */}
        <TestimonialsSection/>

        {/* Statistics Section for Patient Landing Page */}
        <StatisticsSection/>

        {/* Call-To-Action for Patient Landing Page */}
        <CallToActionSection/>

    </div>
  );
}