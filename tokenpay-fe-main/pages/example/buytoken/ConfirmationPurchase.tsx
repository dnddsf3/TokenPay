"use client"

import { useUser } from "context/UserContext";
import { PaymentCreateDTO } from "hooks/payment/payment-schema";
import { useTokenStore } from "hooks/token/token-store";
import React, { useEffect, useState } from "react";

interface ConfirmationPurchaseProps {
  paymentData: PaymentCreateDTO;
  onPurchase: () => void;
  onBack: () => void;
  onApplyPromo: (promoCode: string) => void;
  onViewAvailablePromos: () => void;
}

const ConfirmationPurchase: React.FC<ConfirmationPurchaseProps> = ({
  paymentData,
  onApplyPromo,
  onViewAvailablePromos,
  onPurchase,
  onBack,
}) => {
  const { tokenId } = paymentData; // Extract tokenId from paymentData
  const [formData, setFormData] = useState(paymentData);
  const { tokens, fetchTokens } = useTokenStore(); // Assuming useTokenStore returns tokens
  const ppnRate: number = 0.1; // 10%
  const ppjRate: number = 0.02; // 2%
  const bankFee: number = 1000.00;
  const serviceFee: number = 2500.00;
  const materai: number = 10000.00;

  const { user } = useUser();


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

      const newPpn = tokenValue * ppnRate;
      const newPpj = tokenValue * ppjRate;
      const newAmountPaid =
        tokenValue + newPpn + newPpj + bankFee + serviceFee + materai;

      console.log("Calculated PPN:", newPpn);
      console.log("Calculated PPJ:", newPpj);
      console.log("Calculated total amount paid:", newAmountPaid);

      setFormData((prev) => ({
        ...prev,
        tokenValue,
        ppn: newPpn,
        ppj: newPpj,
        amountPaid: newAmountPaid,
      }));
    } else {
      if (!tokens || tokens.length === 0) {
        console.warn("No tokens available");
      }
      if (!tokenId) {
        console.warn("Token ID is not provided");
      }
    }
  }, [tokens, tokenId, ppnRate, ppjRate, bankFee, serviceFee, materai]);



  // Function to update specific fields in formData
  const handleFormUpdate = (key: string, value: any) => {
    setFormData((prev) => ({
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
          <p className="mt-1 text-lg font-bold text-gray-800">
            {formData.tokenValue} TOKEN PLN
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
              onClick={() => onApplyPromo(formData.paymentPromo)}
            >
              Gunakan
            </button>
          </div>
          <div
            className="mt-2 text-blue-500 flex items-center space-x-2 cursor-pointer"
            onClick={onViewAvailablePromos}
          >
            <span>🎉 Promo yang tersedia</span>
          </div>
        </div>

        {/* Fees and Taxes */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">PPN</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.ppn.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">PPJ</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.ppj.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Materai</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.materai.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Biaya Bank</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.bankFee.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Biaya Layanan</span>
          <span className="text-blue-500 font-medium">
            Rp {formData.serviceFee.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Total Bill */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Pembayaran</span>
          <span className="text-gray-900 font-bold text-lg">
            Rp {formData.amountPaid.toLocaleString("id-ID")}
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


