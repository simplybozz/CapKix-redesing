import { Suspense } from "react";
import { StaffOrder } from "./staff-order";

export default function Page() {
  return (
    <Suspense>
      <StaffOrder />
    </Suspense>
  );
}
