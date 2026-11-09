import { Suspense } from "react";
import { Shop } from "./shop";

export const metadata = { title: "Tienda" };

export default function Page() {
  return (
    <Suspense>
      <Shop />
    </Suspense>
  );
}
