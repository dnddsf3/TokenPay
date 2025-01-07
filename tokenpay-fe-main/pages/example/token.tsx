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
  Label,
  Input,
  Select,
  ModalFooter,
} from "@roketid/windmill-react-ui";
import Layout from "example/containers/Layout";
import ValidatedInput from "./shared/components/ValidatedInput";
import CrudModal from "./shared/components/CrudModal";
import { EditIcon, TrashIcon } from "icons";
import { useTokenStore } from "hooks/token/token-store";
import { TokenCreateDTO, TokenRetrieveDTO, TokenUpdateDTO } from "hooks/token/token-schema";
import { useProviderStore } from "hooks/genco/genco-store";

function TokenTable() {
  const { tokens, fetchTokens, addToken, updateToken, deleteToken } = useTokenStore();
  const { providers, fetchProviders } = useProviderStore();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newToken, setNewToken] = useState<TokenCreateDTO>(initialNewToken());
  const [editingToken, setEditingToken] = useState<TokenUpdateDTO | null>(null);
  const [tokenToDelete, setTokenToDelete] = useState<TokenRetrieveDTO | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const resultsPerPage = 10;

  useEffect(() => {
    fetchProviders(); // Fetch the provider list on component mount
  }, [fetchProviders]);


  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const filteredTokens = tokens.filter((token) => {
    const tokenCode = token.tokenCode || "";
    return tokenCode.toLowerCase().includes(searchQuery.toLowerCase());
  });


  const paginatedTokens = filteredTokens.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  function initialNewToken(): TokenCreateDTO {
    return {
      amount: 0,
      amountEconomic: 0,
      tokenCode: "000-000-000",
      unitsPurchased: 0,
      gencoId: 1,
      expiresAt: new Date().toISOString().slice(0, -1),
      tokenStatus: "ACTIVE",
      tokenType: "PUBLIC",
    };
  }

  function validateFields(token: TokenCreateDTO | TokenUpdateDTO): Record<string, string> {
    const validationErrors: Record<string, string> = {};
    if (!token.amount) validationErrors.amount = "Amount is required";
    if (!token.unitsPurchased) validationErrors.unitsPurchased = "Units Purchased is required";
    if (!token.expiresAt) validationErrors.expiresAt = "Expiration date is required";
    return validationErrors;
  }

  function resetState() {
    setErrors({});
    setNewToken(initialNewToken());
    setEditingToken(null);
    setTokenToDelete(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  }

  async function handleCreateToken() {
    // Define required fields with validation messages
    const requiredFields = [
      { field: "tokenCode", message: "Token code is required" },
      { field: "amount", message: "Amount is required" },
      { field: "amountEconomic", message: "Amount Economic is required" },
      { field: "unitsPurchased", message: "Units purchased is required" },
      { field: "gencoId", message: "Genco ID is required" },
      { field: "expiresAt", message: "Expiration date is required" },
      { field: "tokenStatus", message: "Token status is required" },
      { field: "tokenType", message: "Token type is required" },
    ];

    // Validate fields and collect errors
    const validationErrors: Record<string, string> = requiredFields.reduce(
      (errors, { field, message }) => {
        if (!newToken[field as keyof typeof newToken]) {
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

    // Ensure the payload matches the server's expectations
    const payload = {
      tokenCode: newToken.tokenCode,
      amount: newToken.amount,
      amountEconomic: newToken.amountEconomic,
      unitsPurchased: newToken.unitsPurchased,
      gencoId: newToken.gencoId,
      expiresAt: newToken.expiresAt,
      tokenStatus: newToken.tokenStatus,
      tokenType: newToken.tokenType,
    };

    console.log("Payload for addToken:", payload);

    try {
      // Attempt to create the token
      await addToken(payload);
      setErrors({}); // Clear any previous errors
      resetState(); // Reset form and modal state
      fetchTokens(); // Refresh token list
    } catch (error: any) {
      if (error.response?.data?.errors) {
        // If server returns validation errors
        setErrors(error.response.data.errors);
      } else {
        console.error("Failed to create token:", error);
        setErrors({ global: "An unexpected error occurred. Please try again." });
      }
    }
  }


  const openEditModal = (token: TokenRetrieveDTO) => {
    setEditingToken({
      id: token.id,
      tokenCode: token.tokenCode,
      amount: token.amount,
      amountEconomic: token.amountEconomic,
      unitsPurchased: token.unitsPurchased,
      gencoId: token.genco.id,
      expiresAt: token.expiresAt,
      tokenStatus: token.tokenStatus,
      tokenType: token.tokenType,
    });
    setIsEditModalOpen(true);
  };



  async function handleUpdateToken() {
    if (!editingToken) {
      console.error("Editing token is null or undefined.");
      return;
    }

    console.log("Editing Token:", editingToken);

    // Define required fields with validation messages
    const requiredFields = [
      { field: "tokenCode", message: "Token code is required" },
      { field: "amount", message: "Amount is required" },
      { field: "amountEconomic", message: "amountEconomic is required" },
      { field: "unitsPurchased", message: "Units purchased is required" },
      { field: "gencoId", message: "Genco ID is required" },
      { field: "expiresAt", message: "Expiration date is required" },
      { field: "tokenStatus", message: "Token status is required" },
      { field: "tokenType", message: "Token type is required" },
    ];

    // Validate fields and collect errors
    const validationErrors: Record<string, string> = requiredFields.reduce(
      (errors, { field, message }) => {
        if (!editingToken[field as keyof TokenUpdateDTO]) {
          errors[field] = message;
        }
        return errors;
      },
      {}
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.warn("Validation errors:", validationErrors);
      return;
    }

    // Prepare payload
    const payload: TokenUpdateDTO = {
      id: editingToken.id,
      tokenCode: editingToken.tokenCode,
      amount: editingToken.amount,
      amountEconomic: editingToken.amountEconomic,
      unitsPurchased: editingToken.unitsPurchased,
      gencoId: editingToken.gencoId,
      expiresAt: editingToken.expiresAt,
      tokenStatus: editingToken.tokenStatus,
      tokenType: editingToken.tokenType,
    };

    console.log("Payload to update:", payload);

    try {
      await updateToken(payload.id, payload);
      console.log("Token updated successfully.");
      resetState(); // Reset state and close modal
      fetchTokens(); // Refresh token list
    } catch (error) {
      console.error("Failed to update token:", error);

      if (error.response?.data?.errors) {
        // If server returns validation errors
        setErrors(error.response.data.errors);
      } else {
        setErrors({ global: "An unexpected error occurred. Please try again." });
      }
    }
  }


  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingToken(null);
  };


  async function handleDeleteToken() {
    if (!tokenToDelete) return;
    try {
      await deleteToken(tokenToDelete.id);
      resetState();
      fetchTokens();
    } catch (error) {
      console.error("Failed to delete token:", error);
    }
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <PageTitle>Token List</PageTitle>
        <div className="flex items-center space-x-2">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Token Code"
          />
          <Button className="w-full bg-red-500" onClick={() => setIsCreateModalOpen(true)}>+ Create Token</Button>
        </div>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Token Code</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Economic Amount</TableCell>
              <TableCell>Units Purchased</TableCell>
              <TableCell>Genco</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedTokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell>{token.id}</TableCell>
                <TableCell>{token.tokenCode}</TableCell>
                <TableCell>{token.amount}</TableCell>
                <TableCell>{token.amountEconomic}</TableCell>
                <TableCell>{token.unitsPurchased}</TableCell>
                <TableCell>{token?.genco?.name}</TableCell>
                <TableCell>{new Date(token.expiresAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge>{token.tokenStatus}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{token.tokenType}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 justify-end">
                    <Button
                      layout="link"
                      size="small"
                      onClick={() => {
                        setErrors({});
                        setEditingToken({ ...token });
                        openEditModal(token);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <EditIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      layout="link"
                      size="small"
                      onClick={() => {
                        setTokenToDelete(token);
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
            totalResults={filteredTokens.length}
            resultsPerPage={resultsPerPage}
            onChange={setPage}
          />
        </TableFooter>
      </TableContainer>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalHeader>Create Token</ModalHeader>
        <ModalBody className="flex flex-col space-y-4">
          <ValidatedInput
            label="Amount"
            value={newToken.amount.toString()}
            onChange={(value) => setNewToken({ ...newToken, amount: parseFloat(value) })}
            error={errors.amount}
            type="number"
          />
          <ValidatedInput
            label="Economic Amount"
            value={newToken.amountEconomic.toString()}
            onChange={(value) => setNewToken({ ...newToken, amountEconomic: parseFloat(value) })}
            error={errors.amountEconomic}
            type="number"
          />
          <ValidatedInput
            label="Units Purchased"
            value={newToken.unitsPurchased.toString()}
            onChange={(value) => setNewToken({ ...newToken, unitsPurchased: parseFloat(value) })}
            error={errors.unitsPurchased}
            type="number"
          />
          <ValidatedInput
            label="Genco ID"
            value={newToken.gencoId.toString()}
            onChange={(value) => setNewToken({ ...newToken, gencoId: parseInt(value) })}
            error={errors.gencoId}
            type="select"
            options={providers.map((provider) => ({
              value: provider.id.toString(),
              label: provider.name, // Adjust this based on your API response
            }))}
          />
          <ValidatedInput
            label="Token Code"
            value={newToken.tokenCode || ""}
            onChange={(value) => setNewToken({ ...newToken, tokenCode: value })}
            error={errors.tokenCode}
          />
          <ValidatedInput
            label="Expires At"
            value={newToken.expiresAt}
            onChange={(value) => setNewToken({ ...newToken, expiresAt: value })}
            error={errors.expiresAt}
            type="datetime-local"
          />
          <ValidatedInput
            label="Status"
            value={newToken.tokenStatus}
            onChange={(value) => setNewToken({ ...newToken, tokenStatus: value })}
            error={errors.tokenStatus}
            type="select"
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
              { value: "EXPIRED", label: "Expired" },
            ]}
          />
          <ValidatedInput
            label="Type"
            value={newToken.tokenType}
            onChange={(value) => setNewToken({ ...newToken, tokenType: value })}
            error={errors.tokenType}
            type="select"
            options={[
              { value: "PRIVATE", label: "Private" },
              { value: "PUBLIC", label: "Public" },
              { value: "RESTRICTED", label: "Restricted" },
            ]}
          />
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button onClick={handleCreateToken}>Save</Button>
        </ModalFooter>
      </Modal>


      {/* Edit Modal */}
      {editingToken && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <ModalHeader>Edit Token</ModalHeader>
          <ModalBody className="flex flex-col space-y-2">
            <ValidatedInput
              label="Token Code"
              value={editingToken?.tokenCode || ""}
              onChange={(value) =>
                setEditingToken((prev) => (prev ? { ...prev, tokenCode: value } : prev))
              }
              error={errors.tokenCode}
            />
            <ValidatedInput
              label="Amount"
              value={editingToken?.amount?.toString() || ""}
              onChange={(value) =>
                setEditingToken((prev) =>
                  prev ? { ...prev, amount: parseFloat(value) || 0 } : prev
                )
              }
              error={errors.amount}
              type="number"
            />
            <ValidatedInput
              label="Economic Amount"
              value={editingToken?.amountEconomic?.toString() || ""}
              onChange={(value) =>
                setEditingToken((prev) =>
                  prev ? { ...prev, amountEconomic: parseFloat(value) || 0 } : prev
                )
              }
              error={errors.amountEconomic}
              type="number"
            />
            <ValidatedInput
              label="Units Purchased"
              value={editingToken?.unitsPurchased?.toString() || ""}
              onChange={(value) =>
                setEditingToken((prev) =>
                  prev ? { ...prev, unitsPurchased: parseFloat(value) || 0 } : prev
                )
              }
              error={errors.unitsPurchased}
              type="number"
            />
            <ValidatedInput
              label="Genco ID"
              value={editingToken?.gencoId?.toString() || ""}
              onChange={(value) =>
                setEditingToken((prev) => (prev ? { ...prev, gencoId: parseInt(value) } : prev))
              }
              error={errors.gencoId}
              type="select"
              options={providers.map((provider) => ({
                value: provider.id,
                label: provider.name, // Adjust this based on your API response
              }))}
            />

            <ValidatedInput
              label="Expires At"
              value={editingToken?.expiresAt || ""}
              onChange={(value) =>
                setEditingToken((prev) =>
                  prev ? { ...prev, expiresAt: value } : prev
                )
              }
              error={errors.expiresAt}
              type="datetime-local"
            />
            <ValidatedInput
              label="Status"
              value={editingToken?.tokenStatus || ""}
              onChange={(value) =>
                setEditingToken((prev) =>
                  prev ? { ...prev, tokenStatus: value } : prev
                )
              }
              error={errors.tokenStatus}
              type="select"
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
                { value: "EXPIRED", label: "Expired" },
              ]}
            />
            <ValidatedInput
              label="Type"
              value={editingToken?.tokenType || ""}
              onChange={(value) =>
                setEditingToken((prev) =>
                  prev ? { ...prev, tokenType: value } : prev
                )
              }
              error={errors.tokenType}
              type="select"
              options={[
                { value: "PRIVATE", label: "Private" },
                { value: "PUBLIC", label: "Public" },
                { value: "RESTRICTED", label: "Restricted" },
              ]}
            />
          </ModalBody>
          <ModalFooter>
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateToken}>Save</Button>
          </ModalFooter>
        </Modal>
      )}

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalHeader>Delete Token</ModalHeader>
        <ModalBody>Are you sure you want to delete the token?</ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteToken}>Delete</Button>
        </ModalFooter>
      </Modal>


    </Layout>
  );
}

export default TokenTable;
