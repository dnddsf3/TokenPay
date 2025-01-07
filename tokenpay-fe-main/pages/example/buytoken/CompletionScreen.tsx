"use client"

import { useUser } from "context/UserContext";
import { PaymentCreateDTO, PaymentRetrieveDTO } from "hooks/payment/payment-schema";
import { useTokenStore } from "hooks/token/token-store";
import { useUserStore } from "hooks/user/user-store";
import React, { useEffect, useState } from "react";

interface CompletionProps {
  formData: PaymentCreateDTO;
  onReset: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2, // Ensures two decimal places
    maximumFractionDigits: 2,
  }).format(value);
};



const CompletionScreen: React.FC<CompletionProps> = ({ formData, onReset }) => {

  //context
  const { user } = useUser();
  const userId = user?.userId || 0;
  const {
    tokenId,
  } = formData;


  //const
  const [customerInfo, setCustomerInfo] = useState<{
    customerNumber: string;
    customerName: string;
    tariff: string;
  } | null>(null);

  const [tokenNumber, setTokenNumber] = useState<string>("");
  const [tokenNominal, setTokenNominal] = useState<number>(0);
  const [localAmountPaid, setLocalAmountPaid] = useState<number>(0);


  //hook-token
  const { tokens, fetchTokens } = useTokenStore();
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  useEffect(() => {
    if (tokens && tokenId) {
      const matchingToken = tokens.find((token) => token.id === tokenId);
      setTokenNumber(matchingToken?.tokenCode || "N/A");
      setTokenNominal(matchingToken?.amount || 0);
    }
  }, [tokens, tokenId]);

  //hook-users
  const { users, fetchUserById } = useUserStore();

  //hook-customer
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

  //calculation
  const orderTime = new Date().toLocaleString();
  useEffect(() => {
    const TotalAmountPaid = tokenNominal * (1 + formData.ppn / 100 + formData.ppj / 100) +
      formData.bankFee + formData.serviceFee + formData.materai;
    setLocalAmountPaid(TotalAmountPaid);
  }, [tokenNominal, formData.ppn, formData.ppj, formData.bankFee, formData.serviceFee, formData.materai]);


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
              <p className="font-bold text-lg">Token PLN {tokenNominal}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700">Nomor Token</p>
            <div className="bg-red-100 text-red-600 font-bold text-lg p-2 rounded-md flex justify-center items-center">
              <span>{tokenNumber}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">No. Pelanggan</span>
            <span>{customerInfo?.customerNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Nama Pelanggan</span>
            <span>{customerInfo?.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Tarif Listrik</span>
            <span>{customerInfo?.tariff}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <span className="text-red-600 font-bold mr-2">💲</span>
            Informasi Pembayaran
          </p>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Token Nominal</span>
            <span>{formatCurrency(tokenNominal)}</span>

          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">PPN</span>
            <span>{formatCurrency(formData.ppn * tokenNominal / 100)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">PPJ</span>
            <span>{formatCurrency(formData.ppj * tokenNominal / 100)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Biaya Bank</span>
            <span>{formatCurrency(formData.bankFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Biaya Layanan</span>
            <span>{formatCurrency(formData.serviceFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Materai</span>
            <span>{formatCurrency(formData.materai)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Total Pembayaran</span>
            <span className="font-bold text-gray-900">
              <span>{formatCurrency(localAmountPaid)}</span>
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
            <span>{formData.paymentMethod}</span>
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


