"use client"

import React, { useEffect, useState } from "react";
import Stepper from "react-stepper-horizontal";
import AccountInformationForm from "./AccountInformationForm";
import NominalSelection from "./NominalSelection";
import PaymentMethodSelection from "./PaymentMethodSelection";
import ConfirmationPurchase from "./ConfirmationPurchase";
import CompletionScreen from "./CompletionScreen";
import Jumbotron from "./Jumbotron";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import Layout from "example/containers/Layout";
import { usePaymentStore } from "hooks/payment/payment-store";
import { useTokenStore } from "hooks/token/token-store";
import { useUser } from "context/UserContext";
import { CopilotKitCSSProperties, CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useCustomerStore } from "hooks/customer/customer-store";

const paymentCategories = [
  {
    category: "eWallet",
    methods: [
      { id: 1, name: "GOPAY", description: "eWallet", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 2, name: "OVO", description: "eWallet", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 3, name: "DANA", description: "eWallet", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 4, name: "JENIUS", description: "eWallet", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 5, name: "SAKUKU", description: "eWallet", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 6, name: "ISAKU", description: "eWallet", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 7, name: "LINKAJA", description: "eWallet", imageUrl: "/assets/img/telkom-bg.png" },
    ],
  },
  {
    category: "mBanking",
    methods: [
      { id: 8, name: "BCA", description: "mBanking", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 9, name: "LIVING", description: "mBanking", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 10, name: "BSI", description: "mBanking", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 11, name: "BNI", description: "mBanking", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 12, name: "BRI", description: "mBanking", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 13, name: "DANAMON", description: "mBanking", imageUrl: "/assets/img/telkom-bg.png" },
      { id: 14, name: "OTO", description: "mBanking", imageUrl: "/assets/img/telkom-bg.png" },
    ],
  },
];


const initialNewPayment = () => ({
  tokenId: 0,
  customerId: 0,
  userId: 0,
  wa: "0878876464646",
  energyUsage: 300,
  amountPaid: 100,
  ppn: 100,
  ppj: 100,
  materai: 100,
  bankFee: 5,
  serviceFee: 5,
  total: 100,
  paymentMethod: "OVO",
  qris: "---11---1--111--11",
  paymentStatus: "PENDING",
  paymentPromo: "NONE",
  note: "---",
});



const TokenPurchaseFormAdvanceAI: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialNewPayment);
  //
  const { addPayment: createPayment, payments, fetchPayments } = usePaymentStore();
  const { user } = useUser();
  const { customers, fetchCustomers } = useCustomerStore()

  const handleFormUpdate = (key: string, value: any) => {
    console.log(`Updating ${key} to:`, value);
    setFormData((prev) => {
      const updatedFormData = { ...prev, [key]: value };
      console.log("Updated formData:", updatedFormData);
      return updatedFormData;
    });
  };

  const [nominalOptions, setNominalOptions] = useState([]);
  const { tokens, fetchTokens } = useTokenStore();
  useEffect(() => {
    fetchTokens();
    fetchCustomers();
    fetchPayments();
  }, [fetchTokens, fetchCustomers, fetchPayments]);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      // Map tokens to the nominalOptions structure
      const mappedOptions = tokens.map((token) => ({
        tokenId: token.id,
        amount: token.amount,
        discountPrice: token.amountEconomic || "---", // Fallback if discountPrice is not available
        originalPrice: token.amount || "---", // Fallback if originalPrice is not available
        savings: (token.amountEconomic - token.amount) || 0, // Fallback if savings is not available
        imageUrl: "/assets/img/telkom-bg.png"
      }));
      setNominalOptions(mappedOptions);
    }
  }, [tokens]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };


  // --- CopilotKit Integration ---
  // Share readable state with CopilotKit
  useCopilotReadable({
    description: "The current step of the Token Purchase process.",
    value: currentStep,
  });

  useCopilotReadable({
    description: "Customer data for filling step one dropdown",
    value: customers,
  });

  useCopilotReadable({
    description: "Token data for select nominal token",
    value: tokens,
  });

  useCopilotReadable({
    description: "Payment list of available transaction",
    value: payments,
  });

  useCopilotReadable({
    description: "User data for logged in to system, and include in every step process",
    value: user,
  });

  useCopilotReadable({
    description: "The form data for the Token Purchase process, including selected payment method, customer, and token.",
    value: formData,
  });

  // Define Copilot actions
  useCopilotAction({
    name: "navigateToStep",
    description: "Navigate to a specific step in the Token Purchase process.",
    parameters: [
      {
        name: "step",
        type: "number",
        description: "The step number to navigate to (0-4).",
        required: true,
      },
    ],
    handler: ({ step }) => {
      if (step >= 0 && step <= 4) {
        setCurrentStep(step);
      } else {
        console.error(`Invalid step: ${step}. Must be between 0 and 4.`);
      }
    },
  });

  useCopilotAction({
    name: "updateFormData",
    description: "Update a specific field in the Token Purchase form data.",
    parameters: [
      {
        name: "key",
        type: "string",
        description: "The key of the form field to update.",
        required: true,
      },
      {
        name: "value",
        type: "any",
        description: "The new value to assign to the specified key.",
        required: true,
      },
    ],
    handler: ({ key, value }) => {
      console.log(`Updating formData key '${key}' with value:`, value);
      handleFormUpdate(key, value);
    },
  });

  useCopilotAction({
    name: "confirmTokenPurchase",
    description: "Confirm the token purchase and navigate to the next step.",
    handler: async () => {
      try {
        console.log("Confirming token purchase...");
        await handleSubmitPayment(); // Execute the payment submission logic
      } catch (error) {
        console.error("Failed to confirm token purchase:", error);
      }
    },
  });

  useCopilotAction({
    name: "resetPurchaseForm",
    description: "Reset the entire Token Purchase form to its initial state.",
    handler: () => {
      console.log("Resetting Token Purchase form to initial state...");
      setCurrentStep(0);
      setFormData(initialNewPayment);
    },
  });

  useCopilotAction({
    name: "applyPromoCode",
    description: "Apply a promo code to the purchase.",
    parameters: [
      {
        name: "promoCode",
        type: "string",
        description: "The promo code to apply.",
        required: true,
      },
    ],
    handler: ({ promoCode }) => {
      console.log("Applying promo code:", promoCode);
      handleApplyPromo(promoCode);
    },
  });

  useCopilotAction({
    name: "viewAvailablePromos",
    description: "View available promo codes for the Token Purchase.",
    handler: () => {
      console.log("Viewing available promo codes...");
      handleViewAvailablePromos();
    },
  });

  // Define Copilot actions
  useCopilotAction({
    name: "recommendNextStep",
    description: "Provide a recommendation for moving forward or backward based on the current step.",
    handler: () => {
      let recommendation = "";

      switch (currentStep) {
        case 0:
          recommendation = "You are on the 'Input Account' step. Ensure that you've entered valid account information and click 'Next' to proceed.";
          break;
        case 1:
          recommendation = "You are on the 'Select Nominal' step. Choose the desired token amount and click 'Next' to proceed. If you want to change the account, click 'Back'.";
          break;
        case 2:
          recommendation = "You are on the 'Payment Method' step. Select a payment method and click 'Next' to proceed. If you want to change the token amount, click 'Back'.";
          break;
        case 3:
          recommendation = "You are on the 'Confirm Purchase' step. Review your details and click 'Purchase' to complete the transaction. If needed, click 'Back' to change the payment method.";
          break;
        case 4:
          recommendation = "You are on the 'Complete' step. If you're done, you can reset the form to start a new transaction.";
          break;
        default:
          recommendation = "Invalid step. Please restart the process.";
      }

      console.log("Chat Recommendation:", recommendation);
      alert(recommendation); // Display recommendation to the user
    },
  });

  useCopilotAction({
    name: "updateToken",
    description: "Update the tokenId and resolve the corresponding tokenCode.",
    parameters: [
      { name: "tokenId", type: "number", required: true, description: "The ID of the token to update." },
    ],
    handler: ({ tokenId }) => {
      const selectedToken = tokens.find((token) => token.id === tokenId);
      if (selectedToken) {
        handleFormUpdate("tokenId", tokenId);
        handleFormUpdate("tokenCode", selectedToken.tokenCode);
      } else {
        console.warn("Invalid tokenId provided:", tokenId);
      }
    },
  });

  useCopilotAction({
    name: "confirmPurchase",
    description: "Confirm the purchase in the Token Purchase process.",
    handler: () => {
      if (!formData.tokenId || !formData.tokenCode || !formData.amountPaid) {
        console.error("Incomplete data. Cannot confirm purchase.");
        console.log("Ensure all required fields are filled before confirming.");
        return;
      }
      handleSubmitPayment();
    },
  });



  useCopilotAction({
    name: "moveStep",
    description: "Move one step forward or backward in the Token Purchase process.",
    parameters: [
      {
        name: "direction",
        type: "string",
        description: "'forward' to move to the next step, 'backward' to go to the previous step.",
        required: true,
      },
    ],
    handler: ({ direction }) => {
      if (direction === "forward") {
        if (currentStep < 4) {
          handleNext();
          console.log("Moved forward to step:", currentStep + 1);
        } else {
          console.error("Cannot move forward. You are already at the last step.");
        }
      } else if (direction === "backward") {
        if (currentStep > 0) {
          handleBack();
          console.log("Moved backward to step:", currentStep - 1);
        } else {
          console.error("Cannot move backward. You are already at the first step.");
        }
      } else {
        console.error("Invalid direction. Use 'forward' or 'backward'.");
      }
    },
  });



  const handleSubmitPayment = async () => {
    try {
      // Prepare the form data with userId included
      const payload = {
        ...formData,
        paymentStatus: "SUCCESS",
        userId: user?.userId || 0, // Ensure userId is added, with a default fallback
      };

      console.log("Submitting payment:", payload);

      // Call the API to create payment
      await createPayment(payload);

      // Proceed to the next step
      handleNext();
    } catch (error) {
      // Log and handle errors
      console.error("Error submitting payment:", error);
    }
  };


  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  const handleApplyPromo = (paymentPromo: string) => {
    console.log("Applying promo:", paymentPromo);
    setFormData((prev) => ({ ...prev, paymentPromo }));
  };

  const handleViewAvailablePromos = () => {
    console.log("Viewing available promos");
    // Add your logic for showing available promos here
  };

  return (
    <Layout>
      <div className="flex flex-col">
        <div
          className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
          style={{
            backgroundImage: `url('https://example.com/image.jpg')`,
          }}
        >
          <div className="flex space-x-0 w-[100%] mx-auto">
            <div className="bg-white/90 shadow-md rounded-lg p-6 w-[100%] h-[100vh] flex flex-col">
              <Stepper
                steps={[
                  { title: "Input Account" },
                  { title: "Select Nominal" },
                  { title: "Payment Method" },
                  { title: "Confirm Purchase" },
                  { title: "Complete" },
                ]}
                activeStep={currentStep}
                activeColor={currentStep === 4 ? "#38A169" : "#E53E3E"}
                completeColor="#38A169"
                completeBarColor="#38A169"
                size={32}
                circleFontSize={14}
                lineMarginOffset={10}
              />
              <div className="mt-6">
                {currentStep === 0 && (
                  <AccountInformationForm
                    customerId={formData.customerId}
                    onNext={handleNext}
                    onUpdate={(key, value) => handleFormUpdate(key, value)}
                  />
                )}
                {currentStep === 1 && (
                  <NominalSelection
                    options={nominalOptions}
                    selectedNominal={formData.tokenId}
                    onSelect={(value) => handleFormUpdate("tokenId", value)}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 2 && (
                  <PaymentMethodSelection
                    categories={paymentCategories}
                    selectedMethodName={formData.paymentMethod ?? ""}
                    onSelect={(method) => handleFormUpdate("paymentMethod", method?.name)}
                    onNext={handleNext}
                    onBack={handleBack}
                    selectedMethod={null}
                  />
                )}
                {currentStep === 3 && (
                  <ConfirmationPurchase
                    paymentData={formData}
                    onPurchase={handleSubmitPayment}
                    onApplyPromo={handleApplyPromo}
                    onViewAvailablePromos={handleViewAvailablePromos}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 4 && (
                  <CompletionScreen
                    formData={formData}
                    onReset={() => {
                      setCurrentStep(0);
                      setFormData(initialNewPayment);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={
            {
              "--copilot-kit-primary-color": "#c71414",
            } as CopilotKitCSSProperties
          }
        >

          <CopilotPopup
            instructions={
              "Anda membantu pengguna pembeli token sebaik mungkin. Berikan jawaban terbaik berdasarkan data yang Anda miliki"
            }
            labels={{
              title: "Tokenpay Asisten",
              initial: "Im tokenpay asssistant from TU, can i help you?",
            }}
          />
        </div>
      </div>
    </Layout>

  );
};

export default TokenPurchaseFormAdvanceAI;
