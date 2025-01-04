"use client";

import React, { useEffect, useState } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useCustomerStore } from "hooks/customer/customer-store";
import { Button, Select } from "@roketid/windmill-react-ui";

interface AccountInformationFormProps {
  customerId?: number;
  onNext: (value: number) => void;
  onCancel?: () => void;
  onUpdate?: (key: string, value: any) => void; // Add onUpdate prop
}

const AccountInformationForm: React.FC<AccountInformationFormProps> = ({
  customerId,
  onNext,
  onCancel,
  onUpdate, // Receive onUpdate as a prop
}) => {
  const { customers, fetchCustomers } = useCustomerStore();
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(customerId || null);

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
      onUpdate?.("customerId", customerId); // Trigger onUpdate when value changes
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

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setSelectedCustomer(value);
    onUpdate?.("customerId", value); // Trigger onUpdate when value changes
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
            aria-label="No. Meter/ID Pel"
          >
            <option value="" disabled>
              Pilih pelanggan...
            </option>
            {customers.map((customer) => (
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
