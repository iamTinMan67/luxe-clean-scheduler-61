
import { useState, useEffect } from "react";
import { Invoice } from "@/lib/types";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const useInvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Load invoices from localStorage on component mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      try {
        // Parse the JSON and convert date strings to Date objects
        const parsedInvoices = JSON.parse(savedInvoices).map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date)
        }));
        
        // Sort by oldest and pending first
        const sortedInvoices = parsedInvoices.sort((a: Invoice, b: Invoice) => {
          // Sort by paid status first (pending comes first)
          if (a.paid !== b.paid) {
            return a.paid ? 1 : -1;
          }
          // Then sort by date (oldest first)
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        setInvoices(sortedInvoices);
      } catch (error) {
        console.error('Error parsing invoices:', error);
      }
    }
  }, []);
  
  // Function to mark invoice as paid
  const markAsPaid = (invoiceId: string) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, paid: true } : invoice
    );
    
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast.success("Invoice marked as paid", {
      description: `Invoice #${invoiceId} has been marked as paid.`
    });
  };
  
  // Function to generate PDF from invoice
  const generateInvoicePDF = (invoiceId: string) => {
    const invoiceElement = document.getElementById(`invoice-${invoiceId}`);
    
    if (!invoiceElement) {
      toast.error("Could not generate PDF", {
        description: "Invoice element not found"
      });
      return;
    }
    
    toast.info("Generating PDF...", {
      description: "Please wait while we prepare your invoice"
    });
    
    html2canvas(invoiceElement).then(canvas => {
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
      
      pdf.save(`invoice-${invoiceId}.pdf`);
      
      toast.success("PDF Generated", {
        description: `Invoice #${invoiceId} has been saved as PDF`
      });
    });
  };
  
  return {
    invoices,
    markAsPaid,
    generateInvoicePDF
  };
};
