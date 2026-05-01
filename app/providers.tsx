"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "./i18n/LanguageContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    // <PayPalScriptProvider
    //   options={{
    //     clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    //     currency: "USD",
    //     "disable-funding": "sepa,card",
    //   }}
    // >
    <LanguageProvider>{children}</LanguageProvider>
    // </PayPalScriptProvider>
  );
}
