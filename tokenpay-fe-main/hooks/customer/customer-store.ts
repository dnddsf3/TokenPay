import { create } from 'zustand';
import Cookies from 'js-cookie';
import { CustomerCreateOrUpdateDTO, CustomerRetrieveDTO } from './customer-schema';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7771";

type CustomerStore = {
  customers: CustomerRetrieveDTO[];
  selectedCustomer: CustomerRetrieveDTO | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCustomers: () => Promise<void>;
  addCustomer: (newCustomer: CustomerCreateOrUpdateDTO) => Promise<void>;
  updateCustomer: (id: number, updatedCustomer: CustomerCreateOrUpdateDTO) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  selectCustomer: (id: number) => void;
};

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,

  // Fetch all customers
  fetchCustomers: async () => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Include token in Authorization header
        },
      });

      if (!response.ok) throw new Error("Failed to fetch customers");

      const data: CustomerRetrieveDTO[] = await response.json();
      set({ customers: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch customers', isLoading: false });
    }
  },

  // Add a new customer
  addCustomer: async (newCustomer) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Include token in Authorization header
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) throw new Error("Failed to add customer");

      const createdCustomer: CustomerRetrieveDTO = await response.json();
      set((state) => ({
        customers: [...state.customers, createdCustomer],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to add customer', isLoading: false });
    }
  },

  // Update a customer
  updateCustomer: async (id, updatedCustomer) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Include token in Authorization header
        },
        body: JSON.stringify(updatedCustomer),
      });

      if (!response.ok) throw new Error("Failed to update customer");

      const updatedData: CustomerRetrieveDTO = await response.json();
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === id ? updatedData : customer
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update customer', isLoading: false });
    }
  },

  // Delete a customer
  deleteCustomer: async (id) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${authToken}`, // Include token in Authorization header
        },
      });

      if (!response.ok) throw new Error("Failed to delete customer");

      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete customer', isLoading: false });
    }
  },

  // Select a customer
  selectCustomer: (id) => {
    const customer = get().customers.find((customer) => customer.id === id) || null;
    set({ selectedCustomer: customer });
  },
}));
