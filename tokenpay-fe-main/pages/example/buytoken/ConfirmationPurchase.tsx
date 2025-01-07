"use client"

import { useUser } from "context/UserContext";
import { PaymentCreateDTO } from "hooks/payment/payment-schema";
import { useTokenStore } from "hooks/token/token-store";
import React, { useEffect, useState } from "react";
import { PaymentFormData } from ".";

interface ConfirmationPurchaseProps {
  formData: PaymentFormData;
  onPurchase: () => void;
  onBack: () => void;
  onApplyPromo: (promoCode: string) => void;
  onViewAvailablePromos: () => void;
}


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2, // Ensures two decimal places
    maximumFractionDigits: 2,
  }).format(value);
};

const ConfirmationPurchase: React.FC<ConfirmationPurchaseProps> = ({
  formData,
  onApplyPromo,
  onViewAvailablePromos,
  onPurchase,
  onBack,
}) => {

  const [localFormData, setLocalFormData] = useState(formData);
  const [localTokenValue, setLocalTokenValue] = useState<number>(0);
  const [localAmountPaid, setLocalAmountPaid] = useState<number>(0);

  const { tokenId } = formData; // Extract tokenId from paymentData
  const { tokens, fetchTokens } = useTokenStore(); // Assuming useTokenStore returns tokens
  const { user } = useUser();

  //const fee calculation
  const ppnRate: number = formData.ppn / 100; // in %
  const ppjRate: number = formData.ppj / 100; // in %
  const bankFee: number = formData.bankFee;
  const serviceFee: number = formData.serviceFee;
  const materai: number = formData.materai;

  useEffect(() => {
    fetchTokens();
  }, []
  )


  useEffect(() => {
    console.log("useEffect triggered with dependencies:", {
      tokens,
      tokenId,
      ppnRate,
      ppjRate,
      bankFee,
      serviceFee,
      materai,
    });

    if (tokens && tokens.length > 0 && tokenId) {
      console.log("Tokens available:", tokens);
      console.log("Token ID to match:", tokenId);

      const matchingToken = tokens.find((token) => token.id === tokenId);
      console.log("Matching token:", matchingToken);

      const tokenValue = matchingToken ? matchingToken.amount : 0;
      console.log("Token value:", tokenValue);
      setLocalTokenValue(tokenValue);

      const valPPN = tokenValue * ppnRate;
      const valPPJ = tokenValue * ppjRate;

      const TotalAmountPaid = tokenValue * (1 + formData.ppn / 100 + formData.ppj / 100) +
        formData.bankFee + formData.serviceFee + formData.materai;
      setLocalAmountPaid(TotalAmountPaid);

      // Update formData with the new amountPaid
      formData.amountPaid = tokenValue;
      formData.energyUsage = TotalAmountPaid * 0.9;
      formData.total = TotalAmountPaid;


      setLocalFormData((prev: any) => ({
        ...prev,
        amount: tokenValue,
      }));
    } else {
      if (!tokens || tokens.length === 0) {
        console.warn("No tokens available");
      }
      if (!tokenId) {
        console.warn("Token ID is not provided");
      }
    }
  }, [tokens, tokenId, bankFee, serviceFee, materai]);



  // Function to update specific fields in formData
  const handleFormUpdate = (key: string, value: any) => {
    setLocalFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="max-w-lg mx-auto mt-8 rounded-lg shadow-lg bg-white h-[80vh] overflow-auto">
      {/* Header */}
      <div className="bg-red-600 text-white text-lg font-bold p-4 rounded-t-lg">
        Konfirmasi Pembelian
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* WhatsApp Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nomor WhatsApp <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            value={formData.wa || ""}
            onChange={(e) =>
              handleFormUpdate("wa", e.target.value)
            }
          />
          <p className="text-sm text-gray-500 mt-1">
            Nomor ini akan dihubungi apabila ada kendala.
          </p>
        </div>

        {/* Selected Nominal Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nominal Token
          </label>
          <p className="mt-1 text-2xl font-bold text-gray-800">
            {localTokenValue}
          </p>
        </div>

        {/* Promo Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kode Promo
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={formData.paymentPromo}
              onChange={(e) => handleFormUpdate("paymentPromo", e.target.value)}
              placeholder="Masukkan kode promo"
            />
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              onClick={() => onApplyPromo(formData.paymentPromo)}
            >
              Gunakan
            </button>
          </div>
          <div
            className="mt-2 text-red-500 flex items-center space-x-2 cursor-pointer"
            onClick={onViewAvailablePromos}
          >
            {/* <span>🎉 Promo yang tersedia</span> */}
          </div>
        </div>

        {/* Fees and Taxes */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">PPN 10%</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.ppn / 100 * localTokenValue}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">PPJ 2%</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.ppj / 100 * localTokenValue}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Materai</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.materai}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Biaya Bank</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.bankFee}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Biaya Layanan</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.serviceFee}
          </span>
        </div>

        {/* Total Bill */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Pembayaran</span>
          <span className="text-gray-900 font-bold text-lg">
            Rp {localAmountPaid}
          </span>
        </div>

        {/* Payment Status */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Status Pembayaran</span>
          <span className="text-gray-500 font-medium">
            {formData.paymentStatus}
          </span>
        </div>

        {/* Notes */}
        {user?.roles.includes("ROLE_ADMIN") && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catatan
            </label>
            <textarea
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={formData.note || ""}
              onChange={(e) => handleFormUpdate("note", e.target.value)}
              placeholder="Tambahkan catatan..."
            ></textarea>
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-4 p-4">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          kembali
        </button>
        <button
          className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-md shadow-md hover:bg-red-600"
          onClick={onPurchase}
        >
          beli sekarang..
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPurchase;


