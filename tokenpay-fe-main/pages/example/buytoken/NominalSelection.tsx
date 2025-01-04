import React, { FC, useState } from "react";

interface NominalOption {
  tokenId: number;
  amount: number;
  discountPrice: string;
  originalPrice: string;
  savings: string;
  imageUrl: string;
}

interface NominalSelectionProps {
  options: NominalOption[];
  selectedNominal: number | null;
  onSelect: (tokenId: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const NominalSelection: FC<NominalSelectionProps> = ({
  options,
  selectedNominal,
  onSelect,
  onNext,
  onBack,
}) => {
  const [localSelectedId, setLocalSelectedId] = useState<number | null>(selectedNominal);

  const handleSelect = (tokenId: number) => {
    setLocalSelectedId(tokenId);
    onSelect(tokenId);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="bg-red-600 text-white text-lg font-bold p-4 rounded-t-lg">
        Pilih Nominal
      </div>

      {/* Info Text */}
      <div className="bg-gray-100 text-sm text-center text-gray-600 py-2 px-4">
        Harga tertera sudah termasuk biaya admin dan biaya tambahan lainnya
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {options.map((option) => (
          <div
            key={option.tokenId}
            className={`bg-blue-50 border rounded-lg shadow hover:shadow-lg cursor-pointer p-4 transition ${localSelectedId === option.tokenId
              ? "border-red-500 ring ring-red-500"
              : "border-gray-200"
              }`}
            onClick={() => handleSelect(option.tokenId)}
            aria-label={`Select ${option.amount} Token PLN`}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleSelect(option.tokenId)}
          >
            {/* Image */}
            <div className="flex justify-center mb-4">
              <img
                src={option.imageUrl}
                alt={`${option.amount} Token PLN`}
                className="h-12 w-12"
              />
            </div>

            {/* Token Amount */}
            <h3 className="text-center text-lg font-bold text-gray-700 mb-1">
              {option.amount.toLocaleString("id-ID")} TOKEN PLN
            </h3>

            {/* Discount Price */}
            <p className="text-center text-md text-red-600 font-bold">
              Harga Hemat Rp {option.discountPrice.toLocaleString("id-ID")}
            </p>

            {/* Original Price */}
            <p className="text-center text-sm text-gray-400 line-through">
              Rp {option.originalPrice.toLocaleString("id-ID")}
            </p>

            {/* Savings */}
            <p className="text-center text-xs text-green-600 font-medium mt-2">
              Hemat {option.savings.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>

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
          className={`${localSelectedId ? "bg-red-600 hover:bg-red-700" : "bg-gray-300 cursor-not-allowed"
            } text-white font-bold py-2 px-4 rounded`}
          disabled={!localSelectedId}
        >
          lanjutkan
        </button>
      </div>
    </div>
  );
};

export default NominalSelection;
