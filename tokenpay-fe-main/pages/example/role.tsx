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
  Button,
  Pagination,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";

import Layout from "example/containers/Layout";
import { RoleCreateDTO, RoleUpdateDTO } from "hooks/role/role-schema";
import { useRoleStore } from "hooks/role/role-store";
import CrudModal from "./shared/components/CrudModal";
import ValidatedInput from "./shared/components/ValidatedInput";
import { usePagination } from "./shared/components/usePagination";

function RoleTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const { roles, fetchRoles, updateRole, createRole, deleteRole } = useRoleStore();

  // Pagination
  const { page, setPage, paginatedData, setData } = usePagination(roles, 10);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [newRole, setNewRole] = useState<RoleCreateDTO>({
    name: "",
    description: "",
    createdById: 1,
  });
  const [editingRole, setEditingRole] = useState<RoleUpdateDTO | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleUpdateDTO | null>(null);

  // Error State
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRoles(); // Fetch roles on component mount
  }, [fetchRoles]);

  // Filter roles based on search query
  useEffect(() => {
    const filtered = roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setData(filtered); // Update filtered data for pagination
  }, [roles, searchQuery, setData]);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const openCreateModal = () => {
    setNewRole({ name: "", description: "", createdById: 1 });
    setErrors({}); // Clear any existing error messages
    setIsCreateModalOpen(true); // Open the modal
  };

  const handleCreateRole = async () => {
    try {
      if (!newRole.name || !newRole.description) {
        throw { errors: { name: "Name is required", description: "Description is required" } };
      }
      await createRole(newRole);
      setErrors({}); // Clear error messages after successful submission
      setIsCreateModalOpen(false);
      fetchRoles(); // Refresh the roles list
    } catch (error: any) {
      setErrors(error.errors || {}); // Set error messages if validation fails
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      // Validate all fields are non-empty
      if (!editingRole.name || !editingRole.description) {
        const errorFields: Record<string, string> = {};
        if (!editingRole.name) errorFields.name = "Name is required";
        if (!editingRole.description) errorFields.description = "Description is required";
        throw { errors: errorFields };
      }

      await updateRole(editingRole.id, editingRole);
      setIsEditModalOpen(false);
      fetchRoles();
    } catch (error: any) {
      setErrors(error.errors || {});
    }
  };


  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete.id);
      setIsDeleteModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>Role List</PageTitle>
        <div className="flex items-center space-x-2">
          <input
            className="mt-1 w-[300px] p-2 border rounded"
            placeholder="Search by Name or Description"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-red-500 hover:bg-red-600">
            + Create Role
          </Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedData.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <Button
                      layout="link"
                      size="small"
                      onClick={() => {
                        setEditingRole(role);
                        setErrors({});
                        setIsEditModalOpen(true);
                      }}
                    >
                      <EditIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      layout="link"
                      size="small"
                      onClick={() => {
                        setRoleToDelete(role);
                        setIsDeleteModalOpen(true);
                      }}
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
            totalResults={roles.length}
            resultsPerPage={10}
            onChange={setPage}
          />
        </TableFooter>
      </TableContainer>

      {/* Create Modal */}
      <CrudModal
        isOpen={isCreateModalOpen}
        title="Create Role"
        onClose={() => {
          setIsCreateModalOpen(false);
          setErrors({}); // Clear error messages when modal is closed
        }}
        onSave={handleCreateRole}
      >
        <ValidatedInput
          label="Role Name"
          value={newRole.name}
          onChange={(value) => {
            setNewRole({ ...newRole, name: value });
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" })); // Clear field-specific error
          }}
          error={errors.name}
        />
        <ValidatedInput
          label="Description"
          value={newRole.description}
          onChange={(value) => {
            setNewRole({ ...newRole, description: value });
            if (errors.description) setErrors((prev) => ({ ...prev, description: "" })); // Clear field-specific error
          }}
          error={errors.description}
        />
      </CrudModal>


      {/* Edit Modal */}
      <CrudModal
        isOpen={isEditModalOpen}
        title={`Edit Role - ${editingRole?.name}`}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateRole}
      >
        <ValidatedInput
          label="Role Name"
          value={editingRole?.name || ""}
          onChange={(value) =>
            setEditingRole((prev) => (prev ? { ...prev, name: value } : prev))
          }
          error={errors.name}
        />
        <ValidatedInput
          label="Description"
          value={editingRole?.description || ""}
          onChange={(value) =>
            setEditingRole((prev) => (prev ? { ...prev, description: value } : prev))
          }
          error={errors.description}
        />
      </CrudModal>

      {/* Delete Modal */}
      <CrudModal
        isOpen={isDeleteModalOpen}
        title="Delete Role"
        onClose={() => setIsDeleteModalOpen(false)}
        onSave={handleDeleteRole}
      >
        Are you sure you want to delete the role: <b>{roleToDelete?.name}</b>?
      </CrudModal>
    </Layout>
  );
}

export default RoleTable;
