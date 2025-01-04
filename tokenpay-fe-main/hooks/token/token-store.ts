import { create } from 'zustand';
import Cookies from "js-cookie";
import { z } from "zod";
import { TokenCreateOrUpdateSchema, TokenRetrieveSchema } from './token-schema';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7771";

// Types inferred from the schema
export type TokenRetrieveDTO = z.infer<typeof TokenRetrieveSchema>;
export type TokenCreateOrUpdateDTO = z.infer<typeof TokenCreateOrUpdateSchema>;

type TokenStore = {
  tokens: TokenRetrieveDTO[];
  selectedToken: TokenRetrieveDTO | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTokens: () => Promise<void>;
  addToken: (newToken: TokenCreateOrUpdateDTO) => Promise<void>;
  updateToken: (id: number, updatedToken: TokenCreateOrUpdateDTO) => Promise<void>;
  deleteToken: (id: number) => Promise<void>;
  selectToken: (id: number) => void;
};

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: [],
  selectedToken: null,
  isLoading: false,
  error: null,

  // Fetch all tokens
  fetchTokens: async () => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/tokens`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Include token in Authorization header
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tokens");

      const data: TokenRetrieveDTO[] = await response.json();
      set({ tokens: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch tokens', isLoading: false });
    }
  },

  // Add a new token
  addToken: async (newToken) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/tokens`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Include token in Authorization header
        },
        body: JSON.stringify(newToken),
      });

      if (!response.ok) throw new Error("Failed to add token");

      const createdToken: TokenRetrieveDTO = await response.json();
      set((state) => ({
        tokens: [...state.tokens, createdToken],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to add token', isLoading: false });
    }
  },

  // Update a token
  updateToken: async (id, updatedToken) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/tokens/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`, // Include token in Authorization header
        },
        body: JSON.stringify(updatedToken),
      });

      if (!response.ok) throw new Error("Failed to update token");

      const updatedData: TokenRetrieveDTO = await response.json();
      set((state) => ({
        tokens: state.tokens.map((token) =>
          token.id === id ? updatedData : token
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update token', isLoading: false });
    }
  },

  // Delete a token
  deleteToken: async (id) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await fetch(`${API_BASE_URL}/tokens/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${authToken}`, // Include token in Authorization header
        },
      });

      set((state) => ({
        tokens: state.tokens.filter((token) => token.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete token', isLoading: false });
    }
  },

  // Select a token
  selectToken: (id) => {
    const token = get().tokens.find((token) => token.id === id) || null;
    set({ selectedToken: token });
  },
}));
