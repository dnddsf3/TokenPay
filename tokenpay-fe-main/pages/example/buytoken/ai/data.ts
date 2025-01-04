export const NOMINAL_OPTIONS = [
  { id: 1, amount: 20000, discountPrice: "21.200", originalPrice: "24.300" },
  { id: 2, amount: 50000, discountPrice: "52.700", originalPrice: "55.800" },
  { id: 3, amount: 100000, discountPrice: "105.200", originalPrice: "108.300" },
  { id: 4, amount: 200000, discountPrice: "210.200", originalPrice: "213.300" },
];

export const PAYMENT_CATEGORIES = [
  {
    category: "eWallet",
    methods: [
      { id: 1, name: "Gopay", description: "eWallet" },
      { id: 2, name: "OVO", description: "eWallet" },
    ],
  },
  {
    category: "mBanking",
    methods: [
      { id: 3, name: "BCA Mobile", description: "mBanking" },
      { id: 4, name: "Livin'", description: "mBanking" },
    ],
  },
];

export const PERMISSIONS = {
  TOKEN_PURCHASE: ["admin", "user"], // Roles allowed to access token purchase actions
};
