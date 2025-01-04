import React, { useState } from "react";
import Stepper from "react-stepper-horizontal";
import AccountInformationForm from "./AccountInformationForm";
import NominalSelection from "./NominalSelection";
import PaymentMethodSelection from "./PaymentMethodSelection";
import ConfirmationPurchase from "./ConfirmationPurchase";
import CompletionScreen from "./CompletionScreen";

const paymentCategories = [
  {
    category: "eWallet",
    methods: [
      { id: 1, name: "Gopay", description: "eWallet", imageUrl: "/images/gopay.png" },
      { id: 2, name: "OVO", description: "eWallet", imageUrl: "/images/ovo.png" },
      { id: 3, name: "Dana", description: "eWallet", imageUrl: "/images/dana.png" },
      { id: 4, name: "Jenius", description: "eWallet", imageUrl: "/images/jenius.png" },
      { id: 5, name: "Sakuku", description: "eWallet", imageUrl: "/images/sakuku.png" },
      { id: 6, name: "i.Saku", description: "eWallet", imageUrl: "/images/isaku.png" },
      { id: 7, name: "LinkAja", description: "eWallet", imageUrl: "/images/linkaja.png" },
    ],
  },
  {
    category: "mBanking",
    methods: [
      { id: 8, name: "BCA Mobile", description: "mBanking", imageUrl: "/images/bca.png" },
      { id: 9, name: "Livin'", description: "mBanking", imageUrl: "/images/mandiri.png" },
      { id: 10, name: "BSI", description: "mBanking", imageUrl: "/images/bsi.png" },
      { id: 11, name: "BNI", description: "mBanking", imageUrl: "/images/bni.png" },
      { id: 12, name: "BRI", description: "mBanking", imageUrl: "/images/bri.png" },
      { id: 13, name: "Danamon", description: "mBanking", imageUrl: "/images/danamon.png" },
      { id: 14, name: "OCTO Mobile", description: "mBanking", imageUrl: "/images/octo.png" },
    ],
  },
];

const nominalOptions = [
  {
    id: 1,
    amount: 20000,
    discountPrice: "21.200",
    originalPrice: "24.300",
    savings: "Rp3.100",
    imageUrl: "/images/token-icon.png",
  },
  {
    id: 2,
    amount: 50000,
    discountPrice: "52.700",
    originalPrice: "55.800",
    savings: "Rp3.100",
    imageUrl: "/images/token-icon.png",
  },
  {
    id: 3,
    amount: 100000,
    discountPrice: "105.200",
    originalPrice: "108.300",
    savings: "Rp3.100",
    imageUrl: "/images/token-icon.png",
  },
  {
    id: 4,
    amount: 200000,
    discountPrice: "210.200",
    originalPrice: "213.300",
    savings: "Rp3.100",
    imageUrl: "/images/token-icon.png",
  },
];

const TokenPurchaseForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    accountNumber: "",
    selectedNominal: null,
    paymentMethod: null,
    whatsappNumber: "6281234567890",
    promoCode: "",
    totalPayment: 0,
    adminFee: 0,
    tokenNumber: "",
    customerName: "Di*** *****ra",
    tariff: "RIM / 900 VA",
  });

  const handleFormUpdate = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4)); // Ensure it doesn't go past the last step
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0)); // Ensure it doesn't go below the first step
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-screen-md min-h-[95vh] flex flex-col"
      >

        <Stepper
          steps={[
            { title: "Input Account" },
            { title: "Select Nominal" },
            { title: "Payment Method" },
            { title: "Confirm Purchase" },
            { title: "Complete" },
          ]}
          activeStep={currentStep}
          activeColor={currentStep === 4 ? "#38A169" : "#E53E3E"} // Green if on the last step
          completeColor="#38A169" // Green for completed steps
          completeBarColor="#38A169"
          size={32}
          circleFontSize={14}
          lineMarginOffset={10}
        />

        <div className="mt-4">
          {currentStep === 0 && (
            <AccountInformationForm
              meterNumber={formData.accountNumber}
              onNext={() => handleNext()}
            />
          )}


          {currentStep === 1 && (
            <NominalSelection
              options={nominalOptions}
              selectedNominal={formData.selectedNominal}
              onSelect={(value) => handleFormUpdate("selectedNominal", value)}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 2 && (
            <PaymentMethodSelection
              categories={paymentCategories}
              selectedMethod={formData.paymentMethod} // Pass the currently selected method
              onSelect={(method) => handleFormUpdate("paymentMethod", method)} // Update the selected method
              onNext={handleNext} // Advance to the next step when "Next" is clicked
              onBack={handleBack} // Go back to the previous step
            />
          )}



          {currentStep === 3 && (
            <ConfirmationPurchase
              defaultWhatsAppNumber={formData.whatsappNumber}
              promoCode={formData.promoCode}
              totalBill={formData.totalPayment}
              adminFee={formData.adminFee || 1000}
              selectedNominalToken={formData.selectedNominal || 0} // Pass selected nominal
              onPurchase={() => {
                handleFormUpdate("tokenNumber", "3764 5107 6744 0134 9435");
                handleNext();
              }}
              onBack={handleBack} // Pass onBack for the Back button
              onApplyPromo={(promo) => console.log("Applying promo:", promo)}
              onViewAvailablePromos={() => console.log("Viewing available promos")}
            />
          )}



          {currentStep === 4 && (
            <CompletionScreen
              tokenNumber={formData.tokenNumber}
              customerNumber={formData.accountNumber}
              customerName={formData.customerName}
              tariff={formData.tariff}
              nominal={formData.selectedNominal?.toString() || ""}
              price={formData.totalPayment - formData.adminFee}
              adminFee={formData.adminFee}
              totalPayment={formData.totalPayment}
              orderTime={new Date().toLocaleString()}
              paymentMethod={formData.paymentMethod?.name || ""}
            />
          )}
        </div>
      </div>

    </div>

  );
};

export default TokenPurchaseForm;
