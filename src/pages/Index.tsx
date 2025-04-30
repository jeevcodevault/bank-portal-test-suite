import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import KYCForm from "@/components/KYCForm";
import DocumentUpload from "@/components/DocumentUpload";
import Confirmation from "@/components/Confirmation";
import DocumentDownload from "@/components/DocumentDownload";
import { KYCFormData, UploadedDocument, DocumentRecord } from '@/lib/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState("kyc");
  const [formData, setFormData] = useState<KYCFormData | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = (data: KYCFormData) => {
    setFormData(data);
    setActiveTab("documents");
  };

  const handleDocumentsUploaded = (uploadedDocs: UploadedDocument[]) => {
    setDocuments(uploadedDocs);
    setIsSubmitted(true);
    setActiveTab("confirmation");
  };

  // Transform uploaded documents to document records for the download section
  const documentRecords: DocumentRecord[] = documents.map(doc => ({
    id: doc.id,
    type: doc.type === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card',
    fileName: doc.fileName,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-bank-primary text-white py-6 px-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Banking Portal</h1>
          <p className="mt-1 opacity-90">KYC and Document Management</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-white border-b pb-4">
            <CardTitle className="text-lg md:text-xl">Customer Verification Process</CardTitle>
            <CardDescription>
              Please complete all sections to verify your identity and set up your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger 
                  value="kyc" 
                  disabled={activeTab !== "kyc" && !isSubmitted}
                  data-testid="kyc-tab"
                >
                  KYC Form
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  disabled={!formData || (activeTab !== "documents" && !isSubmitted)}
                  data-testid="documents-tab"
                >
                  Upload Documents
                </TabsTrigger>
                <TabsTrigger 
                  value="confirmation" 
                  disabled={!isSubmitted}
                  data-testid="confirmation-tab"
                >
                  Confirmation
                </TabsTrigger>
                <TabsTrigger 
                  value="download" 
                  disabled={!isSubmitted}
                  data-testid="download-tab"
                >
                  Download
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="kyc">
                  <KYCForm onFormSubmit={handleFormSubmit} />
                </TabsContent>
                
                <TabsContent value="documents">
                  {formData && <DocumentUpload onDocumentsUploaded={handleDocumentsUploaded} />}
                </TabsContent>
                
                <TabsContent value="confirmation">
                  {isSubmitted && formData && (
                    <Confirmation formData={formData} documents={documents} />
                  )}
                </TabsContent>
                
                <TabsContent value="download">
                  {isSubmitted && (
                    <DocumentDownload documents={documentRecords} />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-100 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2025 Banking Portal - KYC and Document Management Demo
        </div>
      </footer>
    </div>
  );
};

export default Index;
