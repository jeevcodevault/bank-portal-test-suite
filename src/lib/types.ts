
export interface KYCFormData {
  fullName: string;
  email: string;
  mobile: string;
  dob: Date | undefined;
  address: string;
  gender: 'male' | 'female' | 'other' | '';
  services: {
    internetBanking: boolean;
    mobileBanking: boolean;
    creditCard: boolean;
    loanOptions: boolean;
  };
  accountType: 'savings' | 'current' | 'salary' | 'nri' | '';
}

export interface UploadedDocument {
  id: string;
  type: 'aadhaar' | 'pan';
  file: File;
  fileName: string;
}

export interface DocumentRecord {
  id: string;
  type: string;
  fileName: string;
}
