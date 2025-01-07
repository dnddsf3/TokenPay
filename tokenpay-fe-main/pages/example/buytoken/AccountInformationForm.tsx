"use client";

import React, { useEffect, useState } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useCustomerStore } from "hooks/customer/customer-store";
import { Button, Select } from "@roketid/windmill-react-ui";
import { useUser } from "context/UserContext";

interface AccountInformationFormProps {
  seletedCustomer: number;
  customers: any;
  onNext: (value: number) => void;
  onCancel?: () => void;
  onSelect?: (value: any) => void; // Add onUpdate prop
}

const AccountInformationForm: React.FC<AccountInformationFormProps> = ({
  seletedCustomer,
  customers,
  onNext,
  onCancel,
  onSelect, // Receive onUpdate as a prop
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(seletedCustomer || null);

  //context
  const { user } = useUser();

  // Provide readable data for Copilot to understand the state of the form
  useCopilotReadable({
    description: "The current state of the account input form.",
    value: { customerId: selectedCustomer || "empty" },
  });

  // Register an action to fill the account number
  useCopilotAction({
    name: "fillAccountNumber",
    description: "Fill in the account number (No. Meter/ID Pel).",
    parameters: [
      {
        name: "customerId",
        type: "number",
        description: "The account number to fill in the form.",
        required: true,
      },
    ],
    handler: ({ customerId }) => {
      setSelectedCustomer(customerId);
      onSelect?.("customerId"); // Trigger onUpdate when value changes
    },
  });

  // Register an action to move to the next step
  useCopilotAction({
    name: "nextStep",
    description: "Navigate to the next step after filling in the account number.",
    parameters: [],
    handler: () => {
      if (selectedCustomer) {
        onNext(selectedCustomer);
      }
    },
  });



  const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setSelectedCustomer(value);
    onSelect?.(value); // Trigger onUpdate when value changes
    FormData.userId
  };

  return (
    <div className="max-w-md mx-auto mt-8 rounded-lg shadow-lg bg-white">
      <div className="bg-red-600 text-white text-lg font-bold p-4 rounded-t-lg">
        Masukkan Informasi Akun
      </div>
      <div className="bg-white p-6 rounded-b-lg">
        <label className="block">
          <span className="text-gray-800 font-medium">
            No. Meter/ID Pel <span className="text-red-500">*</span>
          </span>
          <Select
            className="mt-2"
            value={selectedCustomer || ""}
            onChange={handleCustomerChange}
            aria-label="Nomor Pelanggan"
            placeholder="Pilih pelanggan..."
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <option value="" disabled>
              Pilih pelanggan...
            </option>
            {customers.map((customer: any) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.meterNumber}
              </option>
            ))}
          </Select>
        </label>
        <div className="mt-6 flex justify-between">
          <Button
            className="bg-red-600 text-white hover:bg-red-700 w-full"
            onClick={() => selectedCustomer && onNext(selectedCustomer)}
            disabled={!selectedCustomer}
          >
            Lanjutkan...
          </Button>
          {onCancel && (
            <Button
              className="ml-2 text-gray-700 border border-gray-300 w-full"
              onClick={onCancel}
            >
              Batal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInformationForm;
