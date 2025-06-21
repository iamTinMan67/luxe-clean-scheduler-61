
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const EmptyInvoiceState = () => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
        <p className="text-gray-400">No invoices found</p>
      </CardContent>
    </Card>
  );
};

export default EmptyInvoiceState;
