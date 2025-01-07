"use client"

import React, { useState, useEffect } from "react";
import PageTitle from "example/components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@roketid/windmill-react-ui";


import Layout from "example/containers/Layout";
import { usePaymentStore } from "hooks/payment/payment-store";
import { PaymentCreateDTO, PaymentCreateSchema, PaymentUpdateDTO, PaymentUpdateSchema } from "hooks/payment/payment-schema";
import { useCustomerStore } from "hooks/customer/customer-store";
import { useTokenStore } from "hooks/token/token-store";
import PaymentForm from "hooks/payment/PaymentForm";
import { EditIcon, TrashIcon } from "icons";
import { useUser } from "context/UserContext";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2, // Ensures two decimal places
    maximumFractionDigits: 2,
  }).format(value);
};

function PaymentTable() {


  const { user } = useUser();

  const isAdmin = user?.roles.includes('ROLE_ADMIN');


  const { payments, fetchPayments, addPayment, updatePayment, deletePayment, fetchPaymentByUserId } = usePaymentStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const { tokens, fetchTokens } = useTokenStore();

  const [page, setPage] = useState(1);
  const resultsPerPage = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});




  const [newPayment, setNewPayment] = useState<PaymentCreateDTO>({
    userId: 1,
    wa: "958587575775",
    tokenId: 0,
    customerId: 0,
    energyUsage: 0,
    amountPaid: 0,
    ppn: 0,
    ppj: 0,
    materai: 0,
    bankFee: 0,
    serviceFee: 0,
    total: 0,
    paymentMethod: "QRIS",
    qris: "---11---1--111--11",
    paymentStatus: "PENDING",
    paymentPromo: "NONE",
    note: "---",
  });

  const [editingPayment, setEditingPayment] = useState<PaymentUpdateDTO | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<any | null>(null);


  const filteredPayments = payments.filter((payment) =>
    payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.tokenCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPayments = filteredPayments.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );


  useEffect(() => {

    if (isAdmin) {
      fetchPayments();

    } else {
      fetchPaymentByUserId(user?.userId);
    }
    fetchCustomers();
    fetchTokens();
  }, [fetchPayments, fetchCustomers, fetchTokens, fetchPaymentByUserId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCreateChange = (field: string, value: any) => {
    setNewPayment({ ...newPayment, [field]: value });
  };

  const handleEditChange = (field: string, value: any) => {
    if (editingPayment) {
      setEditingPayment({ ...editingPayment, [field]: value });
    }
  };

  // Initial new payment values
  const initialNewPayment = () => ({
    tokenId: 0,
    userId: 1,
    wa: "95858757577",
    customerId: 0,
    energyUsage: 0,
    amountPaid: 0,
    ppn: 0,
    ppj: 0,
    materai: 0,
    bankFee: 0,
    serviceFee: 0,
    total: 0,
    paymentMethod: "QRIS",
    qris: "---11---1--111--11",
    paymentStatus: "PENDING",
    paymentPromo: "NONE",
    note: "---",
  });

  const handleCreatePayment = async () => {
    try {
      // Validate the newPayment object
      const validationResult = PaymentCreateSchema.safeParse(newPayment);

      if (!validationResult.success) {
        // Extract and format errors
        const fieldErrors = validationResult.error.errors.reduce(
          (acc, error) => ({
            ...acc,
            [error.path[0]]: error.message,
          }),
          {}
        );
        setErrors(fieldErrors);
        return;
      }

      console.log("newPayment", newPayment)

      // Proceed with creating the payment if validation passes
      await addPayment(newPayment);
      setErrors({}); // Clear errors
      setNewPayment(initialNewPayment()); // Reset the form
      setIsCreateModalOpen(false); // Close the modal
      fetchPayments(); // Refresh the list
    } catch (error) {
      console.error("Failed to create payment:", error);
    }
  };


  const handleUpdatePayment = async () => {
    if (!editingPayment) return;



    const payload = {
      id: editingPayment.id,
      tokenId: editingPayment.tokenId || 0, // Extract token ID from token object
      customerId: editingPayment.customerId || 0, // Extract customer ID from customer object
      energyUsage: editingPayment.energyUsage,
      amountPaid: editingPayment.amountPaid,
      ppn: editingPayment.ppn,
      ppj: editingPayment.ppj,
      materai: editingPayment.materai,
      bankFee: editingPayment.bankFee,
      serviceFee: editingPayment.serviceFee,
      total: editingPayment.total,
      paymentMethod: editingPayment.paymentMethod,
      qris: editingPayment.qris || "", // Default to empty string if null
      paymentStatus: editingPayment.paymentStatus,
      paymentPromo: editingPayment.paymentPromo,
      wa: editingPayment.wa,
      userId: user?.userId,
      note: editingPayment.note,
    };


    console.log("payload", payload)

    try {
      // Validate the editingPayment object using zod schema
      const validationResult = PaymentUpdateSchema.safeParse(payload);

      if (!validationResult.success) {
        // Extract and format errors
        const fieldErrors = validationResult.error.errors.reduce(
          (acc, error) => ({
            ...acc,
            [error.path[0]]: error.message,
          }),
          {}
        );
        setErrors(fieldErrors); // Set the validation errors
        return;
      }

      console.log("payload", payload)

      // Proceed with updating the payment if validation passes
      await updatePayment(payload.id ?? 1, payload);
      setErrors({}); // Clear previous errors
      setIsEditModalOpen(false); // Close the modal
      fetchPayments(); // Refresh the payment list
    } catch (error: any) {
      console.error("Failed to update payment:", error);

      // Handle server-side errors (e.g., API response)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors); // Set server-side validation errors
      } else {
        setErrors({ global: "An unexpected error occurred. Please try again." });
      }
    }
  };


  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    try {
      await deletePayment(paymentToDelete.id);
      setIsDeleteModalOpen(false);
      fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const openCreateModal = () => {
    setErrors({}); // Clear any existing errors
    setNewPayment(initialNewPayment()); // Reset the form fields
    setIsCreateModalOpen(true);
  };

  const openUpdateModal = (payment: PaymentUpdateDTO) => {
    setEditingPayment(payment); // Set the payment to edit
    setIsEditModalOpen(true); // Open the Edit Modal
  };


  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>Payment List</PageTitle>
        <div className="flex items-center space-x-2">
          <Input
            className="input mt-1 w-[300px]"
            placeholder="Search by Token Code, Payment ID"
            value={searchQuery}
            onChange={handleSearch}
          />
          {isAdmin && <Button onClick={() => openCreateModal()} className="bg-red-500 hover:bg-red-600">
            + Create Payment
          </Button>}
        </div>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Payment ID</TableCell>
              <TableCell>Token Code</TableCell>
              <TableCell>UserId</TableCell>
              <TableCell>Total Paid</TableCell>
              <TableCell>Nominal Token</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              {isAdmin && <TableCell className="text-right">Action</TableCell>}
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.paymentId}</TableCell>
                <TableCell>{payment.tokenCode}</TableCell>
                <TableCell>{payment.userId}</TableCell>
                <TableCell>{formatCurrency(payment.total)}</TableCell>
                <TableCell>{formatCurrency(payment.token?.amount)}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Badge>{payment.paymentStatus}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {isAdmin && <Button layout="link" size="small" onClick={() => {
                    setErrors({});
                    const paymentUpdateDTO = {
                      id: payment.id,
                      tokenId: payment?.token?.id ?? 0, // Use token ID from PaymentRetrievalDTO
                      customerId: payment?.customer?.id ?? 0, // Use customer ID from PaymentRetrievalDTO
                      energyUsage: payment.energyUsage ?? 0,
                      amountPaid: payment.amountPaid ?? 0,
                      ppn: payment.ppn ?? 0,
                      ppj: payment.ppj ?? 0,
                      materai: payment.materai ?? 0,
                      bankFee: payment.bankFee ?? 0,
                      serviceFee: payment.serviceFee ?? 0,
                      total: payment.total ?? 0,
                      paymentMethod: payment.paymentMethod ?? "",
                      qris: payment.qris ?? "",
                      paymentStatus: payment.paymentStatus ?? "",
                      paymentPromo: payment.paymentPromo ?? "",
                      note: payment.note ?? "",
                    };
                    openUpdateModal(paymentUpdateDTO)
                  }
                  }>
                    <EditIcon className="w-5 h-5" />
                  </Button>}


                  {isAdmin && <Button layout="link" size="small" onClick={() => { setPaymentToDelete(payment); setIsDeleteModalOpen(true) }}>
                    <TrashIcon className="w-5 h-5" />
                  </Button>}


                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination totalResults={filteredPayments.length} resultsPerPage={resultsPerPage} onChange={setPage} />
        </TableFooter>
      </TableContainer>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="h-[90vh] w-1/3 p-4 overflow-auto bg-white">
        <ModalHeader>Create Payment</ModalHeader>
        <ModalBody>
          <PaymentForm
            editingPayment={newPayment}
            customers={customers}
            tokens={tokens}
            onChange={(field, value) => setNewPayment({ ...newPayment, [field]: value })}
            errors={errors}
          />

        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePayment}>Save</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="h-[90vh] w-1/3 p-4 overflow-auto bg-white">
        <ModalHeader>Edit Payment</ModalHeader>
        <ModalBody>
          <PaymentForm
            editingPayment={editingPayment}
            customers={customers}
            tokens={tokens}
            onChange={handleEditChange}
            errors={errors} />
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdatePayment}>Save</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalHeader>Delete Payment</ModalHeader>
        <ModalBody>Are you sure you want to delete the payment?</ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeletePayment}>Delete</Button>
        </ModalFooter>
      </Modal>
    </Layout>
  );
}

export default PaymentTable;

