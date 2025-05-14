
import SocialLinks from "@/components/layout/SocialLinks";

const ConnectWithUs = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
      <div className="text-gray-300 mb-4">
        <p className="mb-4">Get in touch with us through any of these platforms:</p>
        <SocialLinks showLabels={true} />
      </div>
    </div>
  );
};

export default ConnectWithUs;
