'use client';

import React, { useState } from 'react';
import { Stepper, Step } from 'react-form-stepper';
import { Button, Input, Card, Label } from '@roketid/windmill-react-ui';

const StepperForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    payment: {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    },
    confirmation: {
      agree: false,
    },
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (step, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [field]: value,
      },
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 className="text-lg font-bold">Step 1: Personal Information</h2>
            <div className="space-y-4">
              <Label>
                <span>First Name</span>
                <Input
                  className="mt-1"
                  placeholder="Enter your first name"
                  value={formData.personalInfo.firstName}
                  onChange={(e) =>
                    handleInputChange('personalInfo', 'firstName', e.target.value)
                  }
                />
              </Label>
              <Label>
                <span>Last Name</span>
                <Input
                  className="mt-1"
                  placeholder="Enter your last name"
                  value={formData.personalInfo.lastName}
                  onChange={(e) =>
                    handleInputChange('personalInfo', 'lastName', e.target.value)
                  }
                />
              </Label>
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  placeholder="Enter your email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) =>
                    handleInputChange('personalInfo', 'email', e.target.value)
                  }
                />
              </Label>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-lg font-bold">Step 2: Address</h2>
            <div className="space-y-4">
              <Label>
                <span>Street</span>
                <Input
                  className="mt-1"
                  placeholder="Enter your street"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleInputChange('address', 'street', e.target.value)
                  }
                />
              </Label>
              <Label>
                <span>City</span>
                <Input
                  className="mt-1"
                  placeholder="Enter your city"
                  value={formData.address.city}
                  onChange={(e) =>
                    handleInputChange('address', 'city', e.target.value)
                  }
                />
              </Label>
              <Label>
                <span>State</span>
                <Input
                  className="mt-1"
                  placeholder="Enter your state"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleInputChange('address', 'state', e.target.value)
                  }
                />
              </Label>
              <Label>
                <span>ZIP Code</span>
                <Input
                  className="mt-1"
                  placeholder="Enter your ZIP code"
                  value={formData.address.zip}
                  onChange={(e) =>
                    handleInputChange('address', 'zip', e.target.value)
                  }
                />
              </Label>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-lg font-bold">Step 3: Payment Information</h2>
            <div className="space-y-4">
              <Label>
                <span>Card Number</span>
                <Input
                  className="mt-1"
                  placeholder="Enter your card number"
                  value={formData.payment.cardNumber}
                  onChange={(e) =>
                    handleInputChange('payment', 'cardNumber', e.target.value)
                  }
                />
              </Label>
              <Label>
                <span>Expiration Date</span>
                <Input
                  className="mt-1"
                  placeholder="MM/YY"
                  value={formData.payment.expirationDate}
                  onChange={(e) =>
                    handleInputChange('payment', 'expirationDate', e.target.value)
                  }
                />
              </Label>
              <Label>
                <span>CVV</span>
                <Input
                  className="mt-1"
                  placeholder="Enter CVV"
                  value={formData.payment.cvv}
                  onChange={(e) =>
                    handleInputChange('payment', 'cvv', e.target.value)
                  }
                />
              </Label>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-lg font-bold">Step 4: Confirmation</h2>
            <div className="space-y-4">
              <p>Please confirm your details:</p>
              <pre className="p-4 bg-gray-100 rounded-md text-sm">
                {JSON.stringify(formData, null, 2)}
              </pre>
              <Label>
                <Input
                  type="checkbox"
                  checked={formData.confirmation.agree}
                  onChange={(e) =>
                    handleInputChange('confirmation', 'agree', e.target.checked)
                  }
                />
                <span className="ml-2">I agree to the terms and conditions</span>
              </Label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Stepper
        steps={[
          { label: 'Personal Info' },
          { label: 'Address' },
          { label: 'Payment' },
          { label: 'Confirmation' },
        ]}
        activeStep={currentStep}
        styleConfig={{
          activeBgColor: '#1d4ed8',
          completedBgColor: '#1d4ed8',
          inactiveBgColor: '#e5e7eb',
          activeTextColor: '#fff',
          completedTextColor: '#fff',
          inactiveTextColor: '#6b7280',
        }}
      />

      <Card className="p-4 shadow-md">
        {renderStepContent()}
      </Card>

      <div className="flex justify-between">
        <Button layout="outline" disabled={currentStep === 0} onClick={handleBack}>
          Back
        </Button>
        {currentStep < 3 ? (
          <Button layout="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button layout="primary" onClick={() => alert('Form submitted!')}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepperForm;
