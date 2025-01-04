import { create } from "zustand";
import Cookies from "js-cookie";
import { z, ZodError } from "zod";
import { PaymentCreateDTO, PaymentRetrieveDTO, PaymentRetrieveSchema, PaymentUpdateDTO } from "./payment-schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7771";

type PaymentStore = {
  payments: PaymentRetrieveDTO[];
  selectedPayment: PaymentRetrieveDTO | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPayments: () => Promise<void>;
  fetchPaymentById: (id: number) => Promise<void>;
  fetchPaymentByUserId: (userId: number) => Promise<void>;
  addPayment: (newPayment: PaymentCreateDTO) => Promise<void>;
  updatePayment: (id: number, updatedPayment: PaymentUpdateDTO) => Promise<void>;
  deletePayment: (id: number) => Promise<void>;
  selectPayment: (id: number) => void;
};

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  selectedPayment: null,
  isLoading: false,
  error: null,

  // Fetch all payments
fetchPayments: async () => {
  set({ isLoading: true, error: null });

  // Retrieve the authorization token (e.g., from cookies or localStorage)
  const authToken = Cookies.get("authToken"); // Replace with your token retrieval method
  if (!authToken) {
    console.error("No credentials available. Please log in.");
    set({ error: "No credentials available. Please log in.", isLoading: false });
    return;
  }

  console.log()
  try {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`, // Attach the token to the Authorization header
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }
    const data = await response.json();
    try {
      const parsedData = PaymentRetrieveSchema.array().parse(data);
      set({ payments: parsedData, isLoading: false });
    } catch (zodError) {
      if (zodError instanceof ZodError) {
        console.error("Validation errors:", zodError.errors);
        set({
          error: zodError.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", "),
          isLoading: false,
        });
      } else {
        console.error("Unexpected validation error:", zodError);
        set({
          error: "An unexpected validation error occurred.",
          isLoading: false,
        });
      }
    }
  } catch (error: any) {
    set({ error: error.message || "Failed to fetch payments", isLoading: false });
  }
},




  // Fetch a single payment by ID
  fetchPaymentById: async (id) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch payment by ID");

      const data = await response.json();
      const parsedPayment = PaymentRetrieveSchema.parse(data);
      set({ selectedPayment: parsedPayment, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch payment by ID", isLoading: false });
    }
  },

  fetchPaymentByUserId: async (userId) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/payments/userid/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch payment by ID");

      const data = await response.json();
      const parsedPayment = PaymentRetrieveSchema.array().parse(data);
      set({ payments: parsedPayment, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch payment by ID", isLoading: false });
    }
  },


  // Add a new payment
  addPayment: async (newPayment) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
        body: JSON.stringify(newPayment),
      });

      if (!response.ok) throw new Error("Failed to add payment");

      const createdPayment = await response.json();
      const parsedPayment = PaymentRetrieveSchema.parse(createdPayment);
      set((state) => ({
        payments: [...state.payments, parsedPayment],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to add payment", isLoading: false });
    }
  },

  // Update a payment
  updatePayment: async (id, updatedPayment) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
        body: JSON.stringify(updatedPayment),
      });

      if (!response.ok) throw new Error("Failed to update payment");

      const updatedData = await response.json();
      const parsedPayment = PaymentRetrieveSchema.parse(updatedData);
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === id ? parsedPayment : payment
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update payment", isLoading: false });
    }
  },

  // Delete a payment
  deletePayment: async (id) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete payment");

      set((state) => ({
        payments: state.payments.filter((payment) => payment.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete payment", isLoading: false });
    }
  },

  // Select a payment
  selectPayment: (id) => {
    const payment = get().payments.find((payment) => payment.id === id) || null;
    set({ selectedPayment: payment });
  },
}));
