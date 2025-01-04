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
  Avatar,
  Button,
  Pagination,
  Input,
} from "@roketid/windmill-react-ui";
import Layout from "example/containers/Layout";
import { useUserStore } from "hooks/user/user-store";
import { UserCreateDTO, UserUpdateDTO } from "hooks/user/user-schema";
import { useRoleStore } from "hooks/role/role-store";
import ValidatedInput from "./shared/components/ValidatedInput";
import CrudModal from "./shared/components/CrudModal";
import { EditIcon, TrashIcon } from "icons";
import { useCustomerStore } from "hooks/customer/customer-store";

function UserTable() {
  const { users, fetchUsers, updateUser, createUser, deleteUser } = useUserStore();
  const { roles, fetchRoles } = useRoleStore();

  const initialNewUser = (): UserCreateDTO => ({
    username: "",
    email: "",
    password: "",
    roleIds: [],
    customerId: 0,
    status: "ACTIVE",
    createdById: 1,
  });

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newUser, setNewUser] = useState<UserCreateDTO>(initialNewUser());
  const [editingUser, setEditingUser] = useState<UserUpdateDTO | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserUpdateDTO | null>(null);
  const { customers, fetchCustomers } = useCustomerStore()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const resultsPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchCustomers();
  }, [fetchUsers, fetchRoles, fetchCustomers]);

  const filteredUsers = users.filter((user) =>
    [user.username, user.email]
      .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  const validateFields = (user: UserCreateDTO | UserUpdateDTO) => {
    const errors: Record<string, string> = {};
    if (!user.username) errors.username = "Username is required";
    if (!user.email) errors.email = "Email is required";
    if (!user.password || user.password.trim().length < 6) {
      errors.password = "Password is required and must be at least 6 characters long";
    }
    return errors;
  };


  const resetState = () => {
    setErrors({});
    setNewUser(initialNewUser());
    setEditingUser(null);
    setUserToDelete(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleCreateUser = async () => {
    const validationErrors = validateFields(newUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("newUser", newUser)

    const payload = {
      ...newUser,
      roleIds: Array.isArray(newUser.roleIds) ? newUser.roleIds : [parseInt(newUser.roleIds)], // Ensure roleIds is an array
    };

    try {
      await createUser(payload);
      resetState();
      fetchUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const validationErrors = validateFields(editingUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("editingUser", editingUser)

    const payload = {
      ...editingUser,
      status: editingUser.status,
      updatedById: 1,
      roleIds: Array.isArray(editingUser.roleIds) ? editingUser.roleIds : [parseInt(editingUser.roleIds)], // Ensure roleIds is an array
    };

    console.log("payload", payload)

    try {
      await updateUser(payload.id, payload);
      resetState();
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      resetState();
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleEditChange = (field: string, value: any) => {
    setEditingUser({ ...editingUser, [field]: value });
  };


  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>User List</PageTitle>
        <div className="flex items-center space-x-2">
          <Input
            className="w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Ensure `e.target.value` is used to get the input value
            placeholder="Search by Username or Email"
          />
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-red-500 hover:bg-red-600 text-white">
            + Create User
          </Button>
        </div>
      </div>


      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <span className="text-sm">{user.id}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={user.avatar || "https://github.com/shadcn.png"}
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.roles?.length > 0 ? user.roles[0].name : "No Role Assigned"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 justify-end">
                    <Button layout="link" size="small" onClick={() => {
                      const userUpdateDTO = {
                        id: user.id,
                        username: user.username ?? "",
                        email: user.email ?? "",
                        status: user.status, // Ensure this is passed correctly
                        updatedById: 1,
                        roleIds: user.roles?.map((role) => role.id) ?? [], // Extract role IDs from UserRetrieveDTO
                        password: user.password ?? "", // Add password handling if needed
                      };
                      setEditingUser(userUpdateDTO);
                      setIsEditModalOpen(true)
                    }}>
                      <EditIcon className="w-5 h-5" />
                    </Button>
                    <Button layout="link" size="small" onClick={() => setUserToDelete(user) || setIsDeleteModalOpen(true)}>
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
            totalResults={filteredUsers.length}
            resultsPerPage={resultsPerPage}
            onChange={setPage}
          />
        </TableFooter>
      </TableContainer>



      {/* Create  */}
      <CrudModal
        isOpen={isCreateModalOpen}
        title="Create User"
        onClose={resetState}
        onSave={handleCreateUser}
      >
        <ValidatedInput
          label="Username"
          value={newUser.username}
          onChange={(value) => setNewUser({ ...newUser, username: value })}
          error={errors.username}
        />
        <ValidatedInput
          label="Email"
          value={newUser.email}
          onChange={(value) => setNewUser({ ...newUser, email: value })}
          error={errors.email}
        />
        <ValidatedInput
          label="Role"
          value={newUser.roleIds || ""}
          onChange={(value) => setNewUser({ ...newUser, roleIds: value })}
          error={errors.roleIds}
          type="select"
          options={[
            { value: "", label: "Select a Role..." },
            ...roles.map((role) => ({
              value: role.id,
              label: role.name,
            })),
          ]}
        />
        <ValidatedInput
          label="Link to Customer"
          value={newUser.customerId || ""}
          onChange={(value) => setNewUser({ ...newUser, customerId: value })}
          error={errors.customerId}
          type="select"
          options={[
            { value: "", label: "Select a Customer..." },
            ...customers.map((customer) => ({
              value: customer.id, // Ensure correct mapping to customer ID
              label: customer.name, // Use customer name for display
            })),
          ]}
        />

        <ValidatedInput
          label="Password"
          value={newUser.password}
          onChange={(value) => setNewUser({ ...newUser, password: value })}
          error={errors.password}
        />
        <ValidatedInput
          label="Status"
          value={editingUser?.status || ""}
          onChange={(value) => onChange("status", value)}
          error={errors.status}
          type="select"
          options={[
            { value: "", label: "Select a User Status" },
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" },
          ]}
        />
      </CrudModal>


      {/* Update  */}
      {editingUser && (
        <CrudModal
          isOpen={isEditModalOpen}
          title="Edit User"
          onClose={resetState}
          onSave={handleUpdateUser}
        >
          <ValidatedInput
            label="Username"
            value={editingUser.username}
            onChange={(value) =>
              setEditingUser((prev) => (prev ? { ...prev, username: value } : prev))
            }
            error={errors.username}
          />
          <ValidatedInput
            label="Email"
            value={editingUser.email}
            onChange={(value) =>
              setEditingUser((prev) => (prev ? { ...prev, email: value } : prev))
            }
            error={errors.email}
          />

          <ValidatedInput
            label="Role"
            value={editingUser?.roleIds?.[0] || ""} // Assuming roleIds is an array
            onChange={(value) =>
              setEditingUser((prev) => ({
                ...prev,
                roleIds: [value], // Update roleIds as an array
              }))
            }
            error={errors.roleIds}
            type="select"
            options={[
              { value: "", label: "Select a Role..." },
              ...roles.map((role) => ({
                value: role.id,
                label: role.name,
              })),
            ]}
          />

          <ValidatedInput
            label="Link to Customer"
            value={editingUser.customerId || ""}
            onChange={(value) =>
              setEditingUser((prev) => ({
                ...prev,
                customerId: value,
              }))
            }
            error={errors.customerId}
            type="select"
            options={[
              { value: "", label: "Select a Customer..." },
              ...customers.map((customer) => ({
                value: customer.id, // Ensure correct mapping to customer ID
                label: customer.name, // Use customer name for display
              })),
            ]}
          />


          <ValidatedInput
            label="Status"
            value={editingUser?.status || "ACTIVE"} // Ensure value is correctly passed
            onChange={(value) => {
              console.log("Previous Status:", editingUser?.status); // Debug old value
              setEditingUser((prev) => {
                console.log("Updated State:", { ...prev, status: value }); // Debug new value
                return { ...prev, status: value }; // Update the state
              });
            }}
            error={errors.status}
            type="select"
            options={[
              { value: "", label: "Select a User Status" },
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
          />
        </CrudModal>

      )}

      {userToDelete && (
        <CrudModal
          isOpen={isDeleteModalOpen}
          title="Delete User"
          onClose={resetState}
          onSave={handleDeleteUser}
        >
          Are you sure you want to delete the user: {userToDelete.username}?
        </CrudModal>
      )}
    </Layout>
  );
}

export default UserTable;
