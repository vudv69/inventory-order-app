import type { AuthProvider } from "@refinedev/core";
import { disableAutoLogin, enableAutoLogin } from "./hooks";
import axiosInstance from "./utils/axiosInstance";

export const TOKEN_KEY = "refine-auth";
export const ACCOUNT_KEY = "refine-account";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    enableAutoLogin();

    const accountInfo = await axiosInstance
      .post("/login", {
        email,
        password,
      })
      .then((resp) => resp.data);

    localStorage.setItem(TOKEN_KEY, `${email}-${password}`);
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accountInfo));

    return {
      success: true,
      redirectTo: "/",
    };
  },
  // register: async ({ email, password }) => {
  //   try {
  //     await authProvider.login({ email, password });
  //     return {
  //       success: true,
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: {
  //         message: "Register failed",
  //         name: "Invalid email or password",
  //       },
  //     };
  //   }
  // },
  // updatePassword: async (params) => {
  //   return {
  //     success: true,
  //   };
  // },
  // forgotPassword: async () => {
  //   return {
  //     success: true,
  //   };
  // },
  logout: async () => {
    disableAutoLogin();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACCOUNT_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const accountAsStr = localStorage.getItem(ACCOUNT_KEY);
    if (!token || !accountAsStr) {
      return null;
    }

    const account = JSON.parse(accountAsStr);

    return {
      ...account,
      name: account.email,
      avatar: "https://i.pravatar.cc/150",
    };
  },
};
