import { TokenCreateDTO, TokenRetrieveDTO } from "hooks/token/token-schema";
import React, { FC, useState } from "react";

interface NominalOption {
  tokenId: number;
  amount: number;
  discountPrice: number;
  originalPrice: number;
  savings: number;
  imageUrl: string;
}

interface NominalSelectionProps {
  tokens: TokenRetrieveDTO[];
  seletedToken: number | null;
  onSelect: (tokenId: number) => void;
  onNext: () => void;
  onBack: () => void;
  tokenId?: number;

}

const NominalSelection: FC<NominalSelectionProps> = ({
  tokens,
  seletedToken,
  onSelect,
  onNext,
  onBack,
}) => {

  const [localSelectedId, setLocalSelectedId] = useState<number | null>(
    seletedToken || null
  );

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
        {tokens.map((token) => (
          <div
            key={token.id}
            className={`bg-blue-50 border rounded-lg shadow hover:shadow-lg cursor-pointer p-4 transition ${localSelectedId === token.id
              ? "border-red-500 ring ring-red-500"
              : "border-gray-200"
              }`}
            onClick={() => handleSelect(token.id)}
            aria-label={`Select ${token.amount} Token PLN`}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleSelect(token.id)}
          >
            {/* Image */}
            <div className="flex flex-col justify-center mb-4 items-center">
              <img
                src={"/assets/img/telkom-bg.png"}
                alt={`${token.amount} Token PLN`}
                className="h-12 w-12"
              />
              <span className="text-xs font-bold mt-2">TELKOM ELECTRIC</span>
            </div>

            {/* Token Amount */}
            <h3 className="text-center text-lg font-bold text-gray-700 mb-1">
              {token.amount}
            </h3>

            {/* Discount Price */}
            <p className="text-center text-md text-red-600 font-bold">
              Hemat Rp {token.amountEconomic}
            </p>

            {/* Original Price */}
            <p className="text-center text-sm text-gray-400 line-through">
              Rp {token.amount}
            </p>

            {/* Savings */}
            <p className="text-center text-xs text-green-600 font-medium mt-2">
              Hemat {token.amountEconomic - token.amount}
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
