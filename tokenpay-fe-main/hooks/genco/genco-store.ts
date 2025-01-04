import { create } from 'zustand';
import Cookies from 'js-cookie';
import { ProviderCreateDTO, ProviderRetrieveDTO, ProviderUpdateDTO } from './genco-schema';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7771";

type ProviderStore = {
  providers: ProviderRetrieveDTO[];
  selectedProvider: ProviderRetrieveDTO | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProviders: () => Promise<void>;
  addProvider: (newProvider: ProviderCreateDTO) => Promise<void>;
  updateProvider: (id: number, updatedProvider: ProviderUpdateDTO) => Promise<void>;
  deleteProvider: (id: number) => Promise<void>;
  selectProvider: (id: number) => void;
};

export const useProviderStore = create<ProviderStore>((set, get) => ({
  providers: [],
  selectedProvider: null,
  isLoading: false,
  error: null,

  // Fetch all providers
  fetchProviders: async () => {
    const authToken = Cookies.get("authToken"); // Retrieve token from cookies
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/gencos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
      });

      console.log("genco.response", response)

      if (!response.ok) throw new Error("Failed to fetch providers");

      const data: ProviderRetrieveDTO[] = await response.json();
      set({ providers: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch providers", isLoading: false });
    }
  },

  // Add a new provider
  addProvider: async (newProvider) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/gencos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
        body: JSON.stringify(newProvider),
      });

      if (!response.ok) throw new Error("Failed to add provider");

      const createdProvider: ProviderRetrieveDTO = await response.json();
      set((state) => ({
        providers: [...state.providers, createdProvider],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to add provider", isLoading: false });
    }
  },

  // Update a provider
  updateProvider: async (id, updatedProvider) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/gencos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
        body: JSON.stringify(updatedProvider),
      });

      if (!response.ok) throw new Error("Failed to update provider");

      const updatedData: ProviderRetrieveDTO = await response.json();
      set((state) => ({
        providers: state.providers.map((provider) =>
          provider.id === id ? updatedData : provider
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update provider", isLoading: false });
    }
  },

  // Delete a provider
  deleteProvider: async (id) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      set({ error: "No credentials available. Please log in." });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/gencos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete provider");

      set((state) => ({
        providers: state.providers.filter((provider) => provider.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete provider", isLoading: false });
    }
  },

  // Select a provider
  selectProvider: (id) => {
    const provider = get().providers.find((provider) => provider.id === id) || null;
    set({ selectedProvider: provider });
  },
}));
