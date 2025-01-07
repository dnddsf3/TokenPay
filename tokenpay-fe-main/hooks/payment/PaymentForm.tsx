import React from "react";
import ValidatedInput from "pages/example/shared/components/ValidatedInput";
import { PaymentUpdateDTO } from "./payment-schema";


const PaymentForm = ({
  editingPayment,
  customers,
  tokens,
  onChange,
  errors,
}: {
  editingPayment: PaymentUpdateDTO;
  customers: { id: number; name: string }[];
  tokens: { id: number; tokenCode: string }[];
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}) => {
  return (
    <div className="p-0 space-y-4">
      {/* Section: Customer Details */}
      <Section title="Customer Details">
        {/* Customer */}
        {/* Customer */}
        <ValidatedInput
          label="Customer"
          value={editingPayment?.customerId || 0} // Ensure customerId is numeric
          onChange={(value) => onChange("customerId", parseInt(String(value)))}// Parse value to integer
          error={errors.customerId}
          type="select"
          options={[
            { value: 0, label: "Select a Customer..." }, // Default option with value 0
            ...customers.map((customer) => ({
              value: customer.id,
              label: customer.name,
            })),
          ]}
        />

        {/* Token */}
        <ValidatedInput
          label="Token"
          value={editingPayment?.tokenId || 0} // Ensure tokenId is numeric
          onChange={(value) => onChange("tokenId", parseInt(String(value)))} // Parse value to integer
          error={errors.tokenId}
          type="select"
          options={[
            { value: 0, label: "Select a Token..." }, // Default option with value 0
            ...tokens.map((token) => ({
              value: token.id,
              label: token.tokenCode,
            })),
          ]}
        />


      </Section>

      {/* Section: Payment Details */}
      <Section title="Payment Details">
        {/* Payment Method */}
        <ValidatedInput
          label="Payment Method"
          value={editingPayment?.paymentMethod || ""}
          onChange={(value) => onChange("paymentMethod", value)}
          error={errors.paymentMethod}
          type="select"
          options={[
            { value: "", label: "Select a Payment Method" },
            { value: "GOPAY", label: "GOPAY" },
            { value: "OVO", label: "OVO" },
            { value: "DANA", label: "DANA" },
            { value: "JENIUS", label: "QRIS" },
            { value: "SAKUKU", label: "SAKUKU" },
            { value: "ISAKU", label: "ISAKU" },
            { value: "LINKAJA", label: "LINKAJA" },
            { value: "BCA", label: "BCA" },
            { value: "LIVING", label: "LIVING" },
            { value: "BSI", label: "BSI" },
            { value: "BNI", label: "BNI" },
            { value: "BRI", label: "BRI" },
            { value: "DANAMON", label: "DANAMON" },
            { value: "OCTO", label: "OCTO" },
          ]}
        />

        {/* Payment Status */}
        <ValidatedInput
          label="Payment Status"
          value={editingPayment?.paymentStatus || ""}
          onChange={(value) => onChange("paymentStatus", value)}
          error={errors.paymentStatus}
          type="select"
          options={[
            { value: "", label: "Select a Payment Status" },
            { value: "SUCCESS", label: "Success" },
            { value: "PENDING", label: "Pending" },
            { value: "FAILED", label: "Failed" },
          ]}
        />

        {/* Amount Paid */}
        <ValidatedInput
          label="Amount Paid"
          value={editingPayment?.amountPaid || ""}
          onChange={(value) => onChange("amountPaid", parseFloat(String(value)))}
          error={errors.amountPaid}
          type="number"
        />

        {/* Energy Usage */}
        <ValidatedInput
          label="Energy Usage"
          value={editingPayment?.energyUsage || ""}
          onChange={(value) => onChange("energyUsage", parseFloat(String(value)))}
          error={errors.energyUsage}
          type="number"
        />

        {/* Total */}
        <ValidatedInput
          label="Total"
          value={editingPayment?.total || ""}
          onChange={(value) => onChange("total", parseFloat(String(value)))}
          error={errors.total}
          type="number"
        />

        {/* Bank Fee */}
        <ValidatedInput
          label="Bank Fee"
          value={editingPayment?.bankFee || ""}
          onChange={(value) => onChange("bankFee", parseFloat(String(value)))}
          error={errors.bankFee}
          type="number"
        />

        {/* Materai */}
        <ValidatedInput
          label="Materai"
          value={editingPayment?.materai || ""}
          onChange={(value) => onChange("materai", parseFloat(String(value)))}
          error={errors.materai}
          type="number"
        />

        {/* Payment Promo */}
        <ValidatedInput
          label="Payment Promo"
          value={editingPayment?.paymentPromo || ""}
          onChange={(value) => onChange("paymentPromo", (value))}
          error={errors.paymentPromo}
          type="text"
        />

        {/* PPJ */}
        <ValidatedInput
          label="PPJ"
          value={editingPayment?.ppj || ""}
          onChange={(value) => onChange("ppj", parseFloat(String(value)))}
          error={errors.ppj}
          type="number"
        />

        {/* PPN */}
        <ValidatedInput
          label="PPN"
          value={editingPayment?.ppn || ""}
          onChange={(value) => onChange("ppn", parseFloat(String(value)))}
          error={errors.ppn}
          type="number"
        />

        {/* QRIS */}
        {/* <ValidatedInput
          label="QRIS"
          value={editingPayment?.qris || ""}
          onChange={(value) => onChange("qris", value)}
          error={errors.qris}
        /> */}

        {/* Service Fee */}
        <ValidatedInput
          label="Service Fee"
          value={editingPayment?.serviceFee || ""}
          onChange={(value) => onChange("serviceFee", parseFloat(String(value)))}
          error={errors.serviceFee}
          type="number"
        />
      </Section>

      {/* Section: Additional Information */}
      <Section title="Additional Information">
        <ValidatedInput
          label="Whatsapp"
          value={editingPayment?.wa || ""}
          onChange={(value) => onChange("wa", value)}
          error={errors.wa}
          type="text"
        />
        <ValidatedInput
          label="Note"
          value={editingPayment?.note || ""}
          onChange={(value) => onChange("note", value)}
          error={errors.note}
          type="textarea"
        />
      </Section>
    </div>
  );
};

export default PaymentForm;

/* Helper Components */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-4 border-2 p-2 space-y-2 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <hr />
    <div className="grid grid-cols-1 gap-2">{children}</div>
  </div>
);



