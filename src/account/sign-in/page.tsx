import type { Metadata } from "next";

import SignInClient from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign In or Create Account | Vi2",
  description:
    "Access your Vi2 account, rewards and order history.",
};

export default function SignInPage() {
  return <SignInClient />;
}
