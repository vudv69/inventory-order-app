"use client";

import type { AuthProvider } from "@refinedev/core";
import Cookies from "js-cookie";

const mockUsers = [
  {
    name: "John Doe",
    email: "johndoe@mail.com",
    roles: ["admin"],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Jane Doe",
    email: "janedoe@mail.com",
    roles: ["editor"],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
];

export const authProviderClient: AuthProvider = {
  login: async ({ email, username, password, remember }) => {
    const res = await fetch("http://localhost:3001/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ username: username || email }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        error: {
          name: "LoginError",
          message: err.message || "Invalid username",
        },
      };
    }

    // Suppose we actually send a request to the back end here.
    // const user = mockUsers[0];
    const user = await res.json().then(({ data }) => data);

    if (user) {
      Cookies.set("auth", JSON.stringify(user), {
        expires: 30, // 30 days
        path: "/",
      });
      return {
        success: true,
        redirectTo: "/products",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    try {
      await fetch("http://localhost:3001/v1/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API failed", err);
    }
    Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
