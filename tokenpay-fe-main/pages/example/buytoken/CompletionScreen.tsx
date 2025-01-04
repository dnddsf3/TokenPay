"use client"

import { useUser } from "context/UserContext";
import { PaymentCreateDTO } from "hooks/payment/payment-schema";
import { useTokenStore } from "hooks/token/token-store";
import { useUserStore } from "hooks/user/user-store";
import React, { useEffect, useState } from "react";

interface CompletionProps {
  formData: PaymentCreateDTO;
  onReset: () => void;
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2, // Ensures two decimal places
    maximumFractionDigits: 2,
  }).format(value);
};

const CompletionScreen: React.FC<CompletionProps> = ({ formData, onReset }) => {

  const {
    tokenId,
    amountPaid,
    bankFee = 5000,
    serviceFee = 2500,
    materai = 10000,
    customerId,
    paymentMethod,
  } = formData;

  const { users, fetchUserById } = useUserStore();
  const { tokens, fetchTokens } = useTokenStore();
  const { user } = useUser();
  const [customerInfo, setCustomerInfo] = useState<{
    customerNumber: string;
    customerName: string;
    tariff: string;
  } | null>(null);
  const [tokenNumber, setTokenNumber] = useState<string>("");

  const userId = user?.userId || 0;
  const ppnRate = 0.1; // 10%
  const ppjRate = 0.02; // 2%

  useEffect(() => {
    const fetchCustomerData = async () => {
      const _user = await fetchUserById(userId);
      if (_user?.customer) {
        setCustomerInfo({
          customerNumber: _user.customer.meterNumber,
          customerName: _user.customer.name,
          tariff: `${_user.customer.tariffType}/${_user.customer.customerType}`,
        });
      }
    };

    fetchCustomerData();
  }, [userId, fetchUserById]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  useEffect(() => {
    if (tokens && tokenId) {
      const matchingToken = tokens.find((token) => token.id === tokenId);
      setTokenNumber(matchingToken?.tokenCode || "N/A");
    }
  }, [tokens, tokenId]);

  // Corrected Calculations
  const price = amountPaid / (1 + ppnRate + ppjRate); // Calculate base token price
  const ppn = price * ppnRate;
  const ppj = price * ppjRate;
  const totalPayment = price + ppn + ppj + bankFee + serviceFee + materai;

  // Fallbacks
  const customerNumber = customerInfo?.customerNumber || "123456789";
  const customerName = customerInfo?.customerName || "John Doe";
  const tariff = customerInfo?.tariff || "R1/900VA";
  const orderTime = new Date().toLocaleString();

  //
  const nominal = amountPaid || 0;

  console.log("Debug Values:");
  console.log("Bank Fee:", bankFee); // Should log 5000
  console.log("Service Fee:", serviceFee); // Should log 5000
  console.log("Materai:", materai); // Should log 10000
  console.log("Total Payment:", totalPayment); // Should be correctly calculated

  useEffect(() => {
    console.log("Debugging Fees and Total Payment:");

    const debugBankFee = bankFee;
    const debugServiceFee = serviceFee;
    const debugMaterai = materai;
    const debugTotalPayment = totalPayment;

    console.log("Bank Fee (Raw):", debugBankFee);
    console.log("Service Fee (Raw):", debugServiceFee);
    console.log("Materai (Raw):", debugMaterai);
    console.log("Total Payment (Raw):", debugTotalPayment);

    console.log("Bank Fee (Formatted):", formatCurrency(debugBankFee));
    console.log("Service Fee (Formatted):", formatCurrency(debugServiceFee));
    console.log("Materai (Formatted):", formatCurrency(debugMaterai));
    console.log("Total Payment (Formatted):", formatCurrency(debugTotalPayment));
  }, [bankFee, serviceFee, materai, totalPayment]);

  return (
    <div className="max-w-lg mx-auto rounded-lg shadow-lg bg-white h-[80vh] overflow-auto">
      {/* Header */}
      <div className="bg-red-600 text-white text-lg font-bold p-4 rounded-t-lg">
        <p>Selesai</p>
        <p className="text-sm font-light">Transaksi sukses!</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Token Info */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <img
              src="/assets/img/telkom-bg.png"
              alt="PLN Logo"
              className="w-10 h-10"
            />
            <div>
              <p className="font-medium">Token PLN {nominal}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Nomor Token</p>
            <div className="bg-red-100 text-red-600 font-bold text-lg p-2 rounded-md flex justify-center items-center">
              <span>{tokenNumber}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">No. Pelanggan</span>
            <span>{customerNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Nama Pelanggan</span>
            <span>{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Tarif Listrik</span>
            <span>{tariff}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Nominal</span>
            <span>{nominal}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <span className="text-red-600 font-bold mr-2">💲</span>
            Informasi Pembayaran
          </p>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Harga Token</span>
            <span>{formatCurrency(price)}</span>

          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">PPN</span>
            <span>{formatCurrency(ppn)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">PPJ</span>
            <span>{formatCurrency(ppj)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Biaya Bank</span>
            <span>{formatCurrency(bankFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Biaya Layanan</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Materai</span>
            <span>{formatCurrency(materai)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Total Pembayaran</span>
            <span className="font-bold text-gray-900">
              <span>{formatCurrency(totalPayment)}</span>
            </span>
          </div>
        </div>

        {/* Order Info */}
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Waktu Pemesanan</span>
            <span>{orderTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Metode Pembayaran</span>
            <span>{paymentMethod}</span>
          </div>
        </div>

        {/* Done Button */}
        <button
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 font-bold"
          onClick={onReset}
        >
          selesai
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;


