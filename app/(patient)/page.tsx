import DoctorListingPreview from "@/components/patient/Landing/DoctorListingPreview";
import FeaturesSection from "@/components/patient/Landing/FeaturesSection";
import HeroSection from "@/components/patient/Landing/HeroSection";
import HowItWorksSection from "@/components/patient/Landing/HowItWorksSection";


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

        

    </div>
  );
}