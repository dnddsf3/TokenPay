import React, { FC, useEffect, useState } from "react";

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface PaymentCategory {
  category: string;
  methods: PaymentMethod[];
}

interface PaymentMethodSelectionProps {
  categories: PaymentCategory[];
  selectedMethod: PaymentMethod | null;
  selectedMethodName: string | null;
  onSelect: (method: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentMethodSelection: FC<PaymentMethodSelectionProps> = ({
  categories,
  selectedMethod,
  selectedMethodName,
  onSelect,
  onNext,
  onBack,
}) => {
  const [localSelectedMethod, setLocalSelectedMethod] = useState<PaymentMethod | null>(
    selectedMethod
  );

  const [localSelectedMethodName, setLocalSelectedMethodName] = useState<string | null>(
    selectedMethodName
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.category || ""
  );


  const handleSelectMethod = (method: PaymentMethod) => {
    setLocalSelectedMethod(method);
    setLocalSelectedMethodName(method?.name);
    onSelect(method);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="bg-red-600 text-white text-lg font-bold p-4 rounded-t-lg">
        Pilih Metode Pembayaran
      </div>

      {/* Category Tabs */}
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="flex space-x-4 p-4">
          {categories.map((category) => (
            <button
              key={category.category}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition ${selectedCategory === category.category
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              onClick={() => setSelectedCategory(category.category)}
            >
              {category.category}
            </button>
          ))}
        </div>
      </div>

      {/* Methods Grid */}
      {categories.map((category) =>
        selectedCategory === category.category ? (
          <div
            key={category.category}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6"
          >
            {category.methods.map((method) => (
              <div
                key={method.id}
                className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition ${localSelectedMethod?.id === method.id
                  ? "border-red-500 ring ring-red-500"
                  : "border-gray-300 hover:shadow-lg"
                  }`}
                onClick={() => handleSelectMethod(method)}
              >
                <img
                  src={method.imageUrl}
                  alt={method.name}
                  className="w-10 h-10 mb-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  {method.name}
                </span>
              </div>
            ))}
          </div>
        ) : null
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4 p-4">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          kembali
        </button>
        <button
          onClick={onNext}
          className={`${localSelectedMethod
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-300 cursor-not-allowed"
            } text-white font-bold py-2 px-4 rounded`}
          disabled={!localSelectedMethod}
        >
          lanjutkan
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
