
import FeedbackSnippet from "../home/feedback/FeedbackSnippet";
import FooterCopyright from "./FooterCopyright";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gold/20 pt-16 pb-8 px-4 animate-fade-in">
      <div className="container mx-auto">
        {/* Feedback Snippet Section */}
        <FeedbackSnippet />
        
        {/* Copyright Section */}
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;
