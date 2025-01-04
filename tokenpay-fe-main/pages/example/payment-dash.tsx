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
  Label,
  Select,
  Textarea,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";

import Layout from "example/containers/Layout";
import { usePaymentStore } from "hooks/payment/payment-store";
import { PaymentCreateDTO, PaymentUpdateDTO } from "hooks/payment/payment-schema";

function PaymentDashTable() {
  const [page, setPage] = useState(1);
  const { payments, fetchPayments, addPayment: createPayment, updatePayment, deletePayment } =
    usePaymentStore();

  const resultsPerPage = 10;
  const totalResults = payments.length;
  const [paginatedPayments, setPaginatedPayments] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentUpdateDTO | null>(null);
  const [newPayment, setNewPayment] = useState<PaymentCreateDTO>({
    energyUsage: 0,
    amountPaid: 0,
    ppn: 0,
    ppj: 0,
    materai: 0,
    bankFee: 0,
    serviceFee: 0,
    total: 0,
    paymentMethod: "",
    qris: null,
    paymentStatus: "",
    paymentPromo: null,
    note: null,
  });

  const onPageChange = (p: number) => setPage(p);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = page * resultsPerPage;
    setPaginatedPayments(payments.slice(startIndex, endIndex));
  }, [payments, page]);

  const openEditModal = (payment: any) => {
    setEditingPayment({
      energyUsage: payment.energyUsage,
      amountPaid: payment.amountPaid,
      ppn: payment.ppn,
      ppj: payment.ppj,
      materai: payment.materai,
      bankFee: payment.bankFee,
      serviceFee: payment.serviceFee,
      total: payment.total,
      paymentMethod: payment.paymentMethod,
      qris: payment.qris,
      paymentStatus: payment.paymentStatus,
      paymentPromo: payment.paymentPromo,
      note: payment.note,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingPayment(null);
    setIsEditModalOpen(false);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);

  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleCreatePayment = async () => {
    try {
      await createPayment(newPayment);
      closeCreateModal();
      fetchPayments();
    } catch (error) {
      console.error("Failed to create payment:", error);
    }
  };

  const handleUpdatePayment = async () => {
    if (!editingPayment) return;
    try {
      await updatePayment(editingPayment.id ?? 1, editingPayment);
      closeEditModal();
      fetchPayments();
    } catch (error) {
      console.error("Failed to update payment:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageTitle><span className="font-normal text-lg">Payment List</span></PageTitle>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Amount Paid (IDR)</TableCell>
              <TableCell>Energy Usage (KWh)</TableCell>
              <TableCell>Total (IDR)</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Promo</TableCell>
              <TableCell>Note</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedPayments.sort((a: any, b: any) => a.id - b.id).map((payment: any) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.amountPaid}</TableCell>
                <TableCell>{payment.energyUsage}</TableCell>
                <TableCell>{payment.total}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Badge>{payment.paymentStatus}</Badge>
                </TableCell>
                <TableCell>{payment.paymentPromo}</TableCell>
                <TableCell>{payment.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalHeader>Create Payment</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(newPayment).map((key) => {
              if (key === "paymentMethod") {
                return (
                  <Label className="mt-4" key={key}>
                    <span>Payment Method</span>
                    <Select
                      className="mt-1"
                      value={newPayment.paymentMethod || ""}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a Payment Method</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="QRIS">QRIS</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </Label>
                );
              }

              if (key === "paymentStatus") {
                return (
                  <Label className="mt-4" key={key}>
                    <span>Payment Status</span>
                    <Select
                      className="mt-1"
                      value={newPayment.paymentStatus || ""}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          paymentStatus: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a Payment Status</option>
                      <option value="SUCCESS">Success</option>
                      <option value="PENDING">Pending</option>
                      <option value="FAILED">Failed</option>
                    </Select>
                  </Label>
                );
              }

              if (key === "note") {
                return (
                  <Label className="mt-4 col-span-2" key={key}>
                    <span>Note</span>
                    <Textarea
                      className="mt-1"
                      value={newPayment.note || ""}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          note: e.target.value,
                        })
                      }
                    />
                  </Label>
                );
              }

              return (
                <Label className="mt-4" key={key}>
                  <span className="capitalize">{key}</span>
                  <Input
                    className="mt-1"
                    type={
                      key === "amountPaid" ||
                        key === "energyUsage" ||
                        key === "total" ||
                        key === "ppn" ||
                        key === "ppj" ||
                        key === "materai" ||
                        key === "bankFee" ||
                        key === "serviceFee"
                        ? "number"
                        : "text"
                    }
                    value={(newPayment as any)[key] || ""}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        [key]: e.target.value,
                      })
                    }
                  />
                </Label>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button onClick={handleCreatePayment}>Save</Button>
        </ModalFooter>
      </Modal>




      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Payment</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(editingPayment || {}).map((key) => {
              if (key === "paymentMethod") {
                return (
                  <Label className="mt-4" key={key}>
                    <span>Payment Method</span>
                    <Select
                      className="mt-1"
                      value={editingPayment?.paymentMethod || ""}
                      onChange={(e) =>
                        setEditingPayment({
                          ...editingPayment,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a Payment Method</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="QRIS">QRIS</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </Label>
                );
              }

              if (key === "paymentStatus") {
                return (
                  <Label className="mt-4" key={key}>
                    <span>Payment Status</span>
                    <Select
                      className="mt-1"
                      value={editingPayment?.paymentStatus || ""}
                      onChange={(e) =>
                        setEditingPayment({
                          ...editingPayment,
                          paymentStatus: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a Payment Status</option>
                      <option value="SUCCESS">Success</option>
                      <option value="PENDING">Pending</option>
                      <option value="FAILED">Failed</option>
                    </Select>
                  </Label>
                );
              }

              if (key === "note") {
                return (
                  <Label className="mt-4 col-span-2" key={key}>
                    <span>Note</span>
                    <Textarea
                      className="mt-1"
                      value={editingPayment?.note || ""}
                      onChange={(e) =>
                        setEditingPayment({
                          ...editingPayment,
                          note: e.target.value,
                        })
                      }
                    />
                  </Label>
                );
              }

              return (
                <Label className="mt-4" key={key}>
                  <span className="capitalize">{key}</span>
                  <Input
                    className="mt-1"
                    type={
                      key === "amountPaid" ||
                        key === "energyUsage" ||
                        key === "total" ||
                        key === "ppn" ||
                        key === "ppj" ||
                        key === "materai" ||
                        key === "bankFee" ||
                        key === "serviceFee"
                        ? "number"
                        : "text"
                    }
                    value={(editingPayment as any)?.[key] || ""}
                    onChange={(e) =>
                      setEditingPayment({
                        ...editingPayment,
                        [key]: e.target.value,
                      })
                    }
                  />
                </Label>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button onClick={handleUpdatePayment}>Save</Button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default PaymentDashTable;
