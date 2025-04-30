
import { KYCFormData, UploadedDocument } from "./types";

// This is a simulated PDF generator using blob URLs
export const generateConfirmationPDF = (
  formData: KYCFormData,
  documents: UploadedDocument[]
): Promise<string> => {
  return new Promise((resolve) => {
    // In a real application, this would use a library like jsPDF
    // Here we're simulating the PDF generation with a text blob
    const content = `
      KYC CONFIRMATION
      ----------------
      
      Personal Details:
      - Name: ${formData.fullName}
      - Email: ${formData.email}
      - Mobile: ${formData.mobile}
      - DOB: ${formData.dob ? formData.dob.toLocaleDateString() : 'N/A'}
      - Gender: ${formData.gender}
      - Address: ${formData.address}
      
      Banking Preferences:
      - Account Type: ${formData.accountType}
      - Services: ${Object.entries(formData.services)
        .filter(([_, selected]) => selected)
        .map(([service]) => service.replace(/([A-Z])/g, ' $1').trim())
        .join(', ')}
      
      Uploaded Documents:
      ${documents.map(doc => `- ${doc.type.toUpperCase()}: ${doc.fileName}`).join('\n')}
      
      Document verification is in process. Thank you for submitting your KYC.
    `;

    // Create a blob that simulates a PDF
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Simulate processing time
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
};

// Function to download a simulated document
export const downloadDocument = (docType: string, fileName: string): Promise<string> => {
  return new Promise((resolve) => {
    // In a real application, this would fetch from an API
    // Here we're simulating the document with a text blob
    const content = `This is a simulated ${docType} document for demonstration purposes.`;
    
    // Create a blob that simulates a document
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Simulate download time
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
};
