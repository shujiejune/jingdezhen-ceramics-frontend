import { clientOnly } from "@solidjs/start";
import type { Component } from "solid-js";

// 1. We call `clientOnly` with a dynamic import to our new component file.
// This creates a new component, which we name `ClientOnlyNavbar`.
const ClientOnlyNavbar = clientOnly(() => import("./VerticalNavbarContent"));

// 2. The main export is now much simpler. It just renders the
// client-only component with a fallback for the server.
export const VerticalNavbar: Component = () => {
  return (
    <ClientOnlyNavbar
      fallback={
        <nav class="relative z-20 flex flex-col items-center w-24 h-full bg-white shadow-lg"></nav>
      }
    />
  );
};
