
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Function to download PDF from HTML content
export const downloadPDF = (fileName: string, htmlContent: string) => {
  try {
    // Create temporary container for HTML content
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.background = 'white';
    container.style.padding = '20px';
    container.style.width = '800px';
    document.body.appendChild(container);
    
    toast.info("Generating PDF...");
    
    // Create PDF from HTML content
    html2canvas(container, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width
      const pageHeight = 295; // A4 height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if content exceeds one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      pdf.save(`${fileName}.pdf`);
      
      // Clean up
      document.body.removeChild(container);
      
      toast.success("PDF generated successfully");
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
  }
};

// Function to create a PDF from a specific element on the page
export const generatePDFFromElement = async (elementId: string, fileName: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Element not found");
      return;
    }
    
    toast.info("Generating PDF...");
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${fileName}.pdf`);
    toast.success("PDF generated successfully");
    
    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
    return null;
  }
};
