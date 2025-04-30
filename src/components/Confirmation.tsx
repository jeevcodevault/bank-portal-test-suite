
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KYCFormData, UploadedDocument } from "@/lib/types";
import { generateConfirmationPDF } from "@/lib/pdfGenerator";
import { Check, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ConfirmationProps {
  formData: KYCFormData;
  documents: UploadedDocument[];
}

const Confirmation: React.FC<ConfirmationProps> = ({ formData, documents }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      const url = await generateConfirmationPDF(formData, documents);
      setPdfUrl(url);
      toast.success("Confirmation PDF generated successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `KYC_Confirmation_${formData.fullName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Document Downloaded Successfully");
  };

  return (
    <div className="pb-6">
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-2">
            <Check className="h-6 w-6 text-green-500" />
            <CardTitle className="text-xl font-medium text-green-800">KYC Form Submitted</CardTitle>
          </div>
          <CardDescription>
            Your KYC form and documents have been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-sm mb-2">Personal Details</h4>
              <ul className="space-y-1 text-sm">
                <li><span className="text-muted-foreground">Name:</span> {formData.fullName}</li>
                <li><span className="text-muted-foreground">Email:</span> {formData.email}</li>
                <li><span className="text-muted-foreground">Mobile:</span> {formData.mobile}</li>
                <li><span className="text-muted-foreground">DOB:</span> {formData.dob ? formData.dob.toLocaleDateString() : 'N/A'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Submitted Documents</h4>
              <ul className="space-y-1 text-sm">
                {documents.map(doc => (
                  <li key={doc.id} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-bank-primary" />
                    <span>{doc.type === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t flex flex-col sm:flex-row gap-4 justify-end">
            {!pdfUrl ? (
              <Button 
                onClick={handleGeneratePDF} 
                className="bg-bank-primary hover:bg-bank-dark text-white"
                disabled={isGenerating}
                data-testid="generate-pdf-button"
              >
                {isGenerating ? "Generating..." : "Generate Confirmation PDF"}
              </Button>
            ) : (
              <Button 
                onClick={handleDownloadPDF} 
                className="bg-bank-secondary hover:bg-opacity-90 text-white flex items-center gap-2"
                data-testid="download-pdf-button"
              >
                <Download className="h-4 w-4" />
                Download Confirmation
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Confirmation;
