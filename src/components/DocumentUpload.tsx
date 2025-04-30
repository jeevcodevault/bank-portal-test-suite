
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from 'lucide-react';
import { UploadedDocument } from '@/lib/types';
import { toast } from 'sonner';

interface DocumentUploadProps {
  onDocumentsUploaded: (documents: UploadedDocument[]) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentsUploaded }) => {
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    aadhaar: '',
    pan: '',
  });
  
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  // Helper to validate file type
  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  };

  // Helper to validate file size
  const isValidFileSize = (file: File) => {
    return file.size <= MAX_FILE_SIZE;
  };

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!isValidFileType(file)) {
        setErrors({ ...errors, aadhaar: 'Only PDF, JPG, or PNG files are allowed' });
        setAadhaarFile(null);
        e.target.value = '';
      } else if (!isValidFileSize(file)) {
        setErrors({ ...errors, aadhaar: 'File size must be less than 2MB' });
        setAadhaarFile(null);
        e.target.value = '';
        toast.error('Aadhaar file size exceeds 2MB limit');
      } else {
        setAadhaarFile(file);
        setErrors({ ...errors, aadhaar: '' });
      }
    }
  };

  const handlePanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!isValidFileType(file)) {
        setErrors({ ...errors, pan: 'Only PDF, JPG, or PNG files are allowed' });
        setPanFile(null);
        e.target.value = '';
      } else if (!isValidFileSize(file)) {
        setErrors({ ...errors, pan: 'File size must be less than 2MB' });
        setPanFile(null);
        e.target.value = '';
        toast.error('PAN file size exceeds 2MB limit');
      } else {
        setPanFile(file);
        setErrors({ ...errors, pan: '' });
      }
    }
  };

  const handleSubmitDocuments = () => {
    const newErrors = {
      aadhaar: aadhaarFile ? '' : 'Please upload Aadhaar document',
      pan: panFile ? '' : 'Please upload PAN card document',
    };
    
    setErrors(newErrors);
    
    if (aadhaarFile && panFile) {
      // Both files are uploaded, pass them to parent component
      const documents: UploadedDocument[] = [
        {
          id: `aadhaar-${Date.now()}`,
          type: 'aadhaar',
          file: aadhaarFile,
          fileName: aadhaarFile.name,
        },
        {
          id: `pan-${Date.now()}`,
          type: 'pan',
          file: panFile,
          fileName: panFile.name,
        },
      ];
      
      onDocumentsUploaded(documents);
    }
  };

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = (fileType: 'aadhaar' | 'pan') => {
    if (fileType === 'aadhaar') {
      setAadhaarFile(null);
      if (aadhaarInputRef.current) {
        aadhaarInputRef.current.value = '';
      }
    } else {
      setPanFile(null);
      if (panInputRef.current) {
        panInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Aadhaar Upload */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="aadhaar" className="text-sm font-medium">Upload Aadhaar Card</Label>
                {aadhaarFile && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile('aadhaar')} 
                    className="h-6 w-6 p-0 text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <input
                type="file"
                id="aadhaar"
                ref={aadhaarInputRef}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleAadhaarUpload}
                data-testid="aadhaar-input"
              />
              
              <div 
                onClick={() => triggerFileInput(aadhaarInputRef)}
                className={`border-2 border-dashed rounded-md p-4 cursor-pointer text-center transition-colors
                  ${aadhaarFile ? 'border-green-500 bg-green-50' : errors.aadhaar ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                {aadhaarFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">{aadhaarFile.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(aadhaarFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Click to select Aadhaar Card (PDF/JPG/PNG)</p>
                    <p className="text-xs text-gray-400 mt-1">Max size: 2MB</p>
                  </div>
                )}
              </div>
              
              {errors.aadhaar && <p className="text-red-500 text-xs">{errors.aadhaar}</p>}
            </div>
          </CardContent>
        </Card>

        {/* PAN Upload */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="pan" className="text-sm font-medium">Upload PAN Card</Label>
                {panFile && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile('pan')} 
                    className="h-6 w-6 p-0 text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <input
                type="file"
                id="pan"
                ref={panInputRef}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handlePanUpload}
                data-testid="pan-input"
              />
              
              <div 
                onClick={() => triggerFileInput(panInputRef)}
                className={`border-2 border-dashed rounded-md p-4 cursor-pointer text-center transition-colors
                  ${panFile ? 'border-green-500 bg-green-50' : errors.pan ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                {panFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">{panFile.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(panFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Click to select PAN Card (PDF/JPG/PNG)</p>
                    <p className="text-xs text-gray-400 mt-1">Max size: 2MB</p>
                  </div>
                )}
              </div>
              
              {errors.pan && <p className="text-red-500 text-xs">{errors.pan}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmitDocuments}
          className="bg-bank-primary hover:bg-bank-dark text-white"
          disabled={!aadhaarFile || !panFile}
          data-testid="upload-documents-button"
        >
          Upload Documents
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;
