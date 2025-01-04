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
  Select,
  Input,
} from "@roketid/windmill-react-ui";
import Layout from "example/containers/Layout";
import { useCustomerStore } from "hooks/customer/customer-store";
import { CustomerCreateOrUpdateDTO, CustomerRetrieveDTO } from "hooks/customer/customer-schema";
import ValidatedInput from "./shared/components/ValidatedInput";
import CrudModal from "./shared/components/CrudModal";
import { EditIcon, TrashIcon } from "icons";

function CustomerTable() {
  const { customers, fetchCustomers, updateCustomer, addCustomer, deleteCustomer } =
    useCustomerStore();

  const resultsPerPage = 10;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCustomer, setNewCustomer] = useState<CustomerCreateOrUpdateDTO>(initialCustomer());
  const [editingCustomer, setEditingCustomer] = useState<CustomerCreateOrUpdateDTO | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerRetrieveDTO | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  function initialCustomer(): CustomerCreateOrUpdateDTO {
    return {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      meterNumber: "",
      tariffType: "PREPAID",
      gencoId: 0,
      customerType: "RESIDENTIAL",
      customerStatus: "ACTIVE",
      avatar: "",
      note: "",
      userId: 0,
    };
  }

  function validateFields(customer: CustomerCreateOrUpdateDTO): Record<string, string> {
    const validationErrors: Record<string, string> = {};
    if (!customer.name) validationErrors.name = "Name is required";
    if (!customer.email) validationErrors.email = "Email is required";
    if (!customer.phoneNumber) validationErrors.phoneNumber = "Phone number is required";
    return validationErrors;
  }

  function resetState() {
    setErrors({});
    setNewCustomer(initialCustomer());
    setEditingCustomer(null);
    setCustomerToDelete(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  }

  async function handleCreateCustomer() {
    // Validate all fields and collect errors
    const requiredFields = [
      { field: "name", message: "Name is required" },
      { field: "email", message: "Email is required" },
      { field: "phoneNumber", message: "Phone number is required" },
      { field: "address", message: "Address is required" },
      { field: "meterNumber", message: "Meter number is required" },
      { field: "tariffType", message: "Tariff type is required" },
      { field: "customerType", message: "Customer type is required" },
      { field: "customerStatus", message: "Customer status is required" },
      { field: "avatar", message: "Avatar URL is required" },
      { field: "note", message: "Note is required" },
    ];

    const validationErrors: Record<string, string> = requiredFields.reduce(
      (errors, { field, message }) => {
        if (!newCustomer[field as keyof typeof newCustomer]) {
          errors[field] = message;
        }
        return errors;
      },
      {}
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Attempt to create the customer
    try {
      await addCustomer(newCustomer);
      resetState();
      fetchCustomers();
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  }

  async function handleUpdateCustomer() {
    if (!editingCustomer) return;

    console.log("editingCustomer", editingCustomer)

    // Validate all fields and collect errors
    const requiredFields = [
      { field: "name", message: "Name is required" },
      { field: "email", message: "Email is required" },
      { field: "phoneNumber", message: "Phone number is required" },
      { field: "address", message: "Address is required" },
      { field: "meterNumber", message: "Meter number is required" },
      { field: "tariffType", message: "Tariff type is required" },
      { field: "customerType", message: "Customer type is required" },
      { field: "customerStatus", message: "Customer status is required" },
      { field: "avatar", message: "Avatar URL is required" },
      { field: "note", message: "Note is required" },
    ];

    const validationErrors: Record<string, string> = requiredFields.reduce(
      (errors, { field, message }) => {
        if (!editingCustomer[field as keyof typeof editingCustomer]) {
          errors[field] = message;
        }
        return errors;
      },
      {}
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Attempt to update the customer
    try {
      await updateCustomer(editingCustomer.id, editingCustomer);
      resetState();
      fetchCustomers();
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  }


  async function handleDeleteCustomer() {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete.id);
      resetState();
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>Customer List</PageTitle>
        <div className="flex items-center space-x-2">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Name"
          />
          <Button onClick={() => setIsCreateModalOpen(true)} className="w-full bg-red-500">+ Create Customer</Button>
        </div>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Meter Number</TableCell>
              <TableCell>Tariff</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.meterNumber}</TableCell>
                <TableCell>
                  <Badge>{customer.tariffType}</Badge>
                </TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  <Badge type={customer.customerStatus === "ACTIVE" ? "success" : "danger"}>
                    {customer.customerStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      layout="link"
                      size="small"
                      onClick={() =>
                        setEditingCustomer({
                          ...customer,
                          id: customer.id,
                        }) || setIsEditModalOpen(true)
                      }
                    >
                      <EditIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      layout="link"
                      size="small"
                      onClick={() => setCustomerToDelete(customer) || setIsDeleteModalOpen(true)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={filteredCustomers.length}
            resultsPerPage={resultsPerPage}
            onChange={setPage}
          />
        </TableFooter>
      </TableContainer>

      {/* Create Modal */}
      <CrudModal
        isOpen={isCreateModalOpen}
        title="Create Customer"
        onClose={resetState}
        onSave={handleCreateCustomer}
      >
        <ValidatedInput
          label="Name"
          value={newCustomer.name}
          onChange={(value) => setNewCustomer({ ...newCustomer, name: value })}
          error={errors.name}
        />
        <ValidatedInput
          label="Email"
          value={newCustomer.email}
          onChange={(value) => setNewCustomer({ ...newCustomer, email: value })}
          error={errors.email}
        />
        <ValidatedInput
          label="Phone Number"
          value={newCustomer.phoneNumber}
          onChange={(value) => setNewCustomer({ ...newCustomer, phoneNumber: value })}
          error={errors.phoneNumber}
        />
        <ValidatedInput
          label="Address"
          value={newCustomer.address}
          onChange={(value) => setNewCustomer({ ...newCustomer, address: value })}
          error={errors.address}
        />
        <ValidatedInput
          label="Meter Number"
          value={newCustomer.meterNumber}
          onChange={(value) => setNewCustomer({ ...newCustomer, meterNumber: value })}
          error={errors.meterNumber}
        />
        <ValidatedInput
          label="Tariff Type"
          value={newCustomer.tariffType}
          onChange={(value) => setNewCustomer({ ...newCustomer, tariffType: value })}
          type="select"
          options={[
            { value: "PREPAID", label: "Prepaid" },
            { value: "POSTPAID", label: "Postpaid" },
          ]}
        />
        <ValidatedInput
          label="Customer Type"
          value={newCustomer.customerType}
          onChange={(value) => setNewCustomer({ ...newCustomer, customerType: value })}
          type="select"
          options={[
            { value: "RESIDENTIAL", label: "Residential" },
            { value: "COMMERCIAL", label: "Commercial" },
            { value: "INDUSTRIAL", label: "Industrial" },
          ]}
        />
        <ValidatedInput
          label="Customer Status"
          value={newCustomer.customerStatus}
          onChange={(value) => setNewCustomer({ ...newCustomer, customerStatus: value })}
          type="select"
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" },
          ]}
        />
        <ValidatedInput
          label="Avatar URL"
          value={newCustomer.avatar}
          onChange={(value) => setNewCustomer({ ...newCustomer, avatar: value })}
          error={errors.avatar}
        />
        <ValidatedInput
          label="Note"
          value={newCustomer.note}
          onChange={(value) => setNewCustomer({ ...newCustomer, note: value })}
          error={errors.note}
        />
      </CrudModal>

      {/* Edit Modal */}
      <CrudModal
        isOpen={isEditModalOpen}
        title="Edit Customer"
        onClose={resetState}
        onSave={handleUpdateCustomer}
      >
        <ValidatedInput
          label="Name"
          value={editingCustomer?.name || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, name: value } : prev))
          }
          error={errors.name}
        />
        <ValidatedInput
          label="Email"
          value={editingCustomer?.email || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, email: value } : prev))
          }
          error={errors.email}
        />
        <ValidatedInput
          label="Phone Number"
          value={editingCustomer?.phoneNumber || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, phoneNumber: value } : prev))
          }
          error={errors.phoneNumber}
        />
        <ValidatedInput
          label="Address"
          value={editingCustomer?.address || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, address: value } : prev))
          }
          error={errors.address}
        />
        <ValidatedInput
          label="Meter Number"
          value={editingCustomer?.meterNumber || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, meterNumber: value } : prev))
          }
          error={errors.meterNumber}
        />
        <ValidatedInput
          label="Tariff Type"
          value={editingCustomer?.tariffType || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, tariffType: value } : prev))
          }
          type="select"
          options={[
            { value: "PREPAID", label: "Prepaid" },
            { value: "POSTPAID", label: "Postpaid" },
          ]}
        />
        <ValidatedInput
          label="Customer Type"
          value={editingCustomer?.customerType || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, customerType: value } : prev))
          }
          type="select"
          options={[
            { value: "RESIDENTIAL", label: "Residential" },
            { value: "COMMERCIAL", label: "Commercial" },
            { value: "INDUSTRIAL", label: "Industrial" },
          ]}
        />
        <ValidatedInput
          label="Customer Status"
          value={editingCustomer?.customerStatus || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, customerStatus: value } : prev))
          }
          type="select"
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" },
          ]}
        />
        <ValidatedInput
          label="Avatar URL"
          value={editingCustomer?.avatar || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, avatar: value } : prev))
          }
          error={errors.avatar}
        />
        <ValidatedInput
          label="Note"
          value={editingCustomer?.note || ""}
          onChange={(value) =>
            setEditingCustomer((prev) => (prev ? { ...prev, note: value } : prev))
          }
          error={errors.note}
        />
      </CrudModal>


      {/* Delete Modal */}
      {customerToDelete && (
        <CrudModal
          isOpen={isDeleteModalOpen}
          title="Delete Customer"
          onClose={resetState}
          onSave={handleDeleteCustomer}
        >
          Are you sure you want to delete the customer: {customerToDelete.name}?
        </CrudModal>
      )}
    </Layout>
  );
}

export default CustomerTable;
