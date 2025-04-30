import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";
import { KYCFormData } from "@/lib/types";

interface KYCFormProps {
  onFormSubmit: (data: KYCFormData) => void;
}

const KYCForm: React.FC<KYCFormProps> = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState<KYCFormData>({
    fullName: '',
    email: '',
    mobile: '',
    dob: undefined,
    address: '',
    gender: '',
    services: {
      internetBanking: false,
      mobileBanking: false,
      creditCard: false,
      loanOptions: false,
    },
    accountType: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof KYCFormData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name as keyof KYCFormData]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleServiceChange = (service: keyof typeof formData.services, checked: boolean) => {
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [service]: checked
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof KYCFormData, string>> = {};
    
    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender selection is required';
    }
    
    if (!formData.accountType) {
      newErrors.accountType = 'Account type selection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onFormSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      dob: undefined,
      address: '',
      gender: '',
      services: {
        internetBanking: false,
        mobileBanking: false,
        creditCard: false,
        loanOptions: false,
      },
      accountType: '',
    });
    setErrors({});
  };

  // Required field indicator component
  const RequiredFieldIndicator = () => (
    <Asterisk className="h-3 w-3 text-red-500 inline-block ml-1" />
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-6" id="kyc-form">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Name <RequiredFieldIndicator />
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            className={errors.fullName ? "border-red-500" : ""}
            data-testid="fullName-input"
          />
          {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <RequiredFieldIndicator />
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "border-red-500" : ""}
            data-testid="email-input"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-sm font-medium">
            Mobile Number <RequiredFieldIndicator />
          </Label>
          <Input
            id="mobile"
            name="mobile"
            placeholder="10-digit mobile number"
            value={formData.mobile}
            onChange={handleInputChange}
            className={errors.mobile ? "border-red-500" : ""}
            maxLength={10}
            data-testid="mobile-input"
          />
          {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob" className="text-sm font-medium">
            Date of Birth <RequiredFieldIndicator />
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dob"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dob && "text-muted-foreground",
                  errors.dob ? "border-red-500" : ""
                )}
                data-testid="dob-input"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dob ? format(formData.dob, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dob}
                onSelect={(date) => {
                  setFormData({ ...formData, dob: date });
                  if (errors.dob) {
                    setErrors({ ...errors, dob: undefined });
                  }
                }}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address <RequiredFieldIndicator />
          </Label>
          <Textarea
            id="address"
            name="address"
            placeholder="Enter your full address"
            value={formData.address}
            onChange={handleInputChange}
            className={errors.address ? "border-red-500" : ""}
            rows={3}
            data-testid="address-input"
          />
          {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Gender <RequiredFieldIndicator />
          </Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => {
              setFormData({ ...formData, gender: value as 'male' | 'female' | 'other' });
              if (errors.gender) {
                setErrors({ ...errors, gender: undefined });
              }
            }}
            className={cn("flex items-center space-x-4", errors.gender ? "border-red-500" : "")}
            data-testid="gender-input"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Services Interested In</Label>
          <div className="grid grid-cols-2 gap-2" data-testid="services-input">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="internetBanking" 
                checked={formData.services.internetBanking}
                onCheckedChange={(checked) => handleServiceChange('internetBanking', checked === true)}
              />
              <Label htmlFor="internetBanking">Internet Banking</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mobileBanking" 
                checked={formData.services.mobileBanking}
                onCheckedChange={(checked) => handleServiceChange('mobileBanking', checked === true)}
              />
              <Label htmlFor="mobileBanking">Mobile Banking</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="creditCard" 
                checked={formData.services.creditCard}
                onCheckedChange={(checked) => handleServiceChange('creditCard', checked === true)}
              />
              <Label htmlFor="creditCard">Credit Card</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="loanOptions" 
                checked={formData.services.loanOptions}
                onCheckedChange={(checked) => handleServiceChange('loanOptions', checked === true)}
              />
              <Label htmlFor="loanOptions">Loan Options</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType" className="text-sm font-medium">
            Account Type <RequiredFieldIndicator />
          </Label>
          <Select 
            value={formData.accountType} 
            onValueChange={(value: 'savings' | 'current' | 'salary' | 'nri') => {
              setFormData({ ...formData, accountType: value });
              if (errors.accountType) {
                setErrors({ ...errors, accountType: undefined });
              }
            }}
          >
            <SelectTrigger 
              id="accountType"
              className={cn(errors.accountType ? "border-red-500" : "")}
              data-testid="accountType-input"
            >
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="current">Current</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="nri">NRI</SelectItem>
            </SelectContent>
          </Select>
          {errors.accountType && <p className="text-red-500 text-xs">{errors.accountType}</p>}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          data-testid="reset-button"
        >
          Reset Form
        </Button>
        <Button 
          type="submit"
          className="bg-bank-primary hover:bg-bank-dark text-white"
          data-testid="submit-button"
        >
          Submit Form
        </Button>
      </div>
    </form>
  );
};

export default KYCForm;
