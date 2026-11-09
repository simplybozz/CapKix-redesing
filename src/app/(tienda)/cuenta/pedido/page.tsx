import { Suspense } from "react";
import { Guard } from "@/components/ui";
import { CustomerOrder } from "./customer-order";

export const metadata = { title: "Mi pedido" };

export default function Page() {
  return (
    <Guard>
      <Suspense>
        <CustomerOrder />
      </Suspense>
    </Guard>
  );
}
