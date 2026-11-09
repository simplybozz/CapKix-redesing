import { Suspense } from "react";
import { ProductView } from "./product-view";

export const metadata = { title: "Producto" };

export default function Page() {
  return (
    <Suspense>
      <ProductView />
    </Suspense>
  );
}
