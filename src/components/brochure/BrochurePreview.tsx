
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageOption } from "@/lib/types";
import { Printer } from "lucide-react";
import ContactInfo from "@/components/layout/ContactInfo";

interface BrochurePreviewProps {
  packages: PackageOption[];
}

const BrochurePreview = ({ packages }: BrochurePreviewProps) => {
  const brochureRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = brochureRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <html>
        <head>
          <title>Midcheshire Valeting - Service Brochure</title>
          <style>${styles}</style>
          <style>
            @page {
              size: A5;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: #000;
              color: #fff;
            }
            .brochure-container {
              width: 148mm;
              height: 210mm;
              margin: 0 auto;
              padding: 10mm;
              box-sizing: border-box;
              page-break-after: always;
            }
            .gold-text {
              color: #BF953F;
            }
            .service-item {
              border: 1px solid rgba(191, 149, 63, 0.3);
              margin-bottom: 10px;
              padding: 10px;
              border-radius: 5px;
            }
            .contact-page {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100%;
              text-align: center;
            }
            .logo {
              max-width: 80%;
              margin-bottom: 20px;
            }
            .contact-info {
              margin-top: 20px;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="brochure-container">
            <h1 style="text-align: center; margin-bottom: 20px;">
              Our <span class="gold-text">Services</span>
            </h1>
            <div style="margin-bottom: 20px;">
              ${packages.map(pkg => `
                <div class="service-item">
                  <h2 style="margin-top: 0; display: flex; justify-content: space-between;">
                    <span>${pkg.name}</span>
                    <span class="gold-text">£${pkg.basePrice}</span>
                  </h2>
                  <p>${pkg.description}</p>
                  <ul style="padding-left: 20px;">
                    ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="brochure-container contact-page">
            <img src="/lovable-uploads/db88bc12-bb88-4318-a91c-da8a3314c406.png" alt="Mid-Cheshire Valeting" class="logo" />
            <h2>Get in <span class="gold-text">Touch</span></h2>
            <div class="contact-info">
              <p>14 Manor Square, Winsford, CW7 2YG</p>
              <p>07927 208 228 | 07845 574 743</p>
              <p>info@midcheshirevaleting.com</p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Brochure Preview</h2>
        <Button 
          onClick={handlePrint} 
          className="gold-gradient text-black hover:shadow-gold/20"
        >
          <Printer size={16} className="mr-2" /> Print Brochure
        </Button>
      </div>
      
      <div className="overflow-auto">
        <div 
          ref={brochureRef} 
          className="w-[148mm] mx-auto bg-black/70 border border-gold/30 p-8 rounded-md min-h-[210mm]"
        >
          <div className="mb-8">
            <h2 className="text-center text-2xl font-bold text-white mb-6">
              Our <span className="text-gold">Services</span>
            </h2>
            
            <div className="space-y-4">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="bg-black/60 border-gold/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-white">{pkg.name}</h3>
                      <span className="text-gold font-semibold">£{pkg.basePrice}</span>
                    </div>
                    
                    <p className="text-sm text-gold/70 mb-3">{pkg.description}</p>
                    
                    <ul className="text-sm text-white space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2 text-gold">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center mt-12 pt-8 border-t border-gold/30">
            <img 
              src="/lovable-uploads/db88bc12-bb88-4318-a91c-da8a3314c406.png" 
              alt="Mid-Cheshire Valeting" 
              className="h-24 w-auto mb-6" 
            />
            
            <h3 className="text-xl font-medium text-white mb-4">
              Get in <span className="text-gold">Touch</span>
            </h3>
            
            <div className="text-center">
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrochurePreview;
