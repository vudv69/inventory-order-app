"use client";

import { SignInForm } from "@components/refine-ui/form/sign-in-form";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function IndexPage() {
  useEffect(() => {
    const auth = Cookies.get("auth");
    if (auth) redirect("/products");
  }, []);
  return <SignInForm />;
}
