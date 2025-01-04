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
  Input,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";
import Layout from "example/containers/Layout";

import { useProviderStore } from "hooks/genco/genco-store";
import { ProviderCreateDTO, ProviderCreateSchema, ProviderUpdateDTO } from "hooks/genco/genco-schema";
import { usePagination } from "./shared/components/usePagination";
import CrudModal from "./shared/components/CrudModal";
import ValidatedInput from "./shared/components/ValidatedInput";
import { z } from "zod";

function ProviderTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const { providers, fetchProviders, updateProvider, addProvider, deleteProvider } = useProviderStore();

  const { page, setPage, paginatedData, setData } = usePagination(providers, 10);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newProvider, setNewProvider] = useState<ProviderCreateDTO>({
    name: "",
    address: "",
    contactNumber: "",
    email: "",
    isActive: true,
  });
  const [editingProvider, setEditingProvider] = useState<ProviderUpdateDTO | null>(null);
  const [providerToDelete, setProviderToDelete] = useState<ProviderUpdateDTO | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch providers on component mount
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Filter and paginate providers on search query change
  useEffect(() => {
    const filtered = providers.filter((provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setData(filtered);
  }, [providers, searchQuery, setData]);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const openCreateModal = () => {
    setNewProvider({ name: "", address: "", contactNumber: "", email: "", isActive: true });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const openEditModal = (provider: ProviderUpdateDTO) => {
    setEditingProvider(provider);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (provider: ProviderUpdateDTO) => {
    setProviderToDelete(provider);
    setIsDeleteModalOpen(true);
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleCreateProvider = async () => {
    try {
      // Validate the new provider data using the schema
      const validatedProvider = ProviderCreateSchema.parse(newProvider);

      // Proceed to create the provider
      await addProvider(validatedProvider);

      // Reset the form and close the modal
      setNewProvider({
        name: "",
        address: "",
        contactNumber: "",
        email: "",
        isActive: true,
      });
      setErrors({});
      closeCreateModal();
      fetchProviders();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod validation errors to the `errors` state
        const errorMessages = error.errors.reduce((acc: Record<string, string>, curr) => {
          acc[curr.path[0] as string] = curr.message;
          return acc;
        }, {});
        setErrors(errorMessages);
      } else {
        // Handle other types of errors
        console.error("Unexpected error during provider creation:", error);
      }
    }
  };


  const handleUpdateProvider = async () => {
    if (!editingProvider) return;

    try {
      // Define all required fields for validation
      const requiredFields = ["name", "address", "contactNumber", "email", "isActive"];
      const missingFields = requiredFields.filter((field) => {
        const value = editingProvider[field as keyof typeof editingProvider];
        return value === undefined || value === null || value === "" || (field === "isActive" && typeof value !== "boolean");
      });

      if (missingFields.length > 0) {
        const validationErrors = missingFields.reduce((acc, field) => {
          acc[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          return acc;
        }, {} as Record<string, string>);
        throw { errors: validationErrors };
      }

      // Call the update provider function
      await updateProvider(editingProvider.id, editingProvider);

      // Close modal and refresh providers
      closeEditModal();
      fetchProviders();
    } catch (error: any) {
      // Set errors for display in the form
      setErrors(error.errors || {});
    }
  };


  const handleDeleteProvider = async () => {
    if (!providerToDelete) return;
    await deleteProvider(providerToDelete.id);
    closeDeleteModal();
    fetchProviders();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>Provider List</PageTitle>
        <div className="flex items-center space-x-2">
          <Input
            className="mt-1 w-[300px]"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button onClick={openCreateModal} className="bg-red-500 hover:bg-red-600">
            + Create Provider
          </Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedData.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>{provider.id}</TableCell>
                <TableCell>{provider.name}</TableCell>
                <TableCell>{provider.address}</TableCell>
                <TableCell>{provider.contactNumber}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>
                  <Badge type={provider.isActive ? "success" : "danger"}>
                    {provider.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 justify-end">
                    <Button layout="link" size="small" onClick={() => openEditModal(provider)}>
                      <EditIcon className="w-5 h-5" />
                    </Button>
                    <Button layout="link" size="small" onClick={() => openDeleteModal(provider)}>
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination totalResults={providers.length} resultsPerPage={10} onChange={setPage} />
        </TableFooter>
      </TableContainer>

      {/* Create Modal */}
      <CrudModal
        isOpen={isCreateModalOpen}
        title="Create Provider"
        onClose={closeCreateModal}
        onSave={handleCreateProvider}
      >
        <ValidatedInput
          label="Name"
          value={newProvider.name}
          onChange={(value) => setNewProvider({ ...newProvider, name: value })}
          error={errors.name}
        />
        <ValidatedInput
          label="Address"
          value={newProvider.address}
          onChange={(value) => setNewProvider({ ...newProvider, address: value })}
          error={errors.address}
        />
        <ValidatedInput
          label="Contact Number"
          value={newProvider.contactNumber}
          onChange={(value) =>
            setNewProvider({ ...newProvider, contactNumber: value })
          }
          error={errors.contactNumber}
          type="text"
        />
        <ValidatedInput
          label="Email"
          value={newProvider.email}
          onChange={(value) => setNewProvider({ ...newProvider, email: value })}
          error={errors.email}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newProvider.isActive}
            onChange={(e) =>
              setNewProvider({ ...newProvider, isActive: e.target.checked })
            }
          />
          <span>Status</span>
        </div>
      </CrudModal>


      {/* Edit Modal */}
      <CrudModal
        isOpen={isEditModalOpen}
        title="Edit Provider"
        onClose={closeEditModal}
        onSave={handleUpdateProvider}
      >
        <ValidatedInput
          label="Name"
          value={editingProvider?.name || ""}
          onChange={(value) => {
            setEditingProvider((prev) => (prev ? { ...prev, name: value } : prev));
            if (errors.name) setErrors((prevErrors) => ({ ...prevErrors, name: "" })); // Clear error
          }}
          error={errors.name}
        />

        {/* Address Field */}
        <ValidatedInput
          label="Address"
          value={editingProvider?.address || ""}
          onChange={(value) => {
            setEditingProvider((prev) => (prev ? { ...prev, address: value } : prev));
            if (errors.address)
              setErrors((prevErrors) => ({ ...prevErrors, address: "" })); // Clear error
          }}
          error={errors.address}
        />

        {/* Contact Number Field */}
        <ValidatedInput
          label="Contact Number"
          value={editingProvider?.contactNumber || ""}
          onChange={(value) => {
            setEditingProvider((prev) => (prev ? { ...prev, contactNumber: value } : prev));
            if (errors.contactNumber)
              setErrors((prevErrors) => ({ ...prevErrors, contactNumber: "" })); // Clear error
          }}
          error={errors.contactNumber}
        />

        {/* Email Field */}
        <ValidatedInput
          label="Email"
          type="email"
          value={editingProvider?.email || ""}
          onChange={(value) => {
            setEditingProvider((prev) => (prev ? { ...prev, email: value } : prev));
            if (errors.email) setErrors((prevErrors) => ({ ...prevErrors, email: "" })); // Clear error
          }}
          error={errors.email}
        />

        {/* Status Field */}
        <ValidatedInput
          label="Status"
          type="checkbox"
          value={editingProvider?.isActive || false}
          onChange={(value) => {
            setEditingProvider((prev) => (prev ? { ...prev, isActive: value } : prev));
            if (errors.isActive)
              setErrors((prevErrors) => ({ ...prevErrors, isActive: "" })); // Clear error
          }}
          error={errors.isActive}
        />

        {/* Add more inputs for other fields */}
      </CrudModal>

      {/* Delete Modal */}
      <CrudModal
        isOpen={isDeleteModalOpen}
        title="Delete Provider"
        onClose={closeDeleteModal}
        onSave={handleDeleteProvider}
      >
        Are you sure you want to delete the provider: <b>{providerToDelete?.name}</b>?
      </CrudModal>
    </Layout>
  );
}

export default ProviderTable;
