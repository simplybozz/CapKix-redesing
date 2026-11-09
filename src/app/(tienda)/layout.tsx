import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="h-[104px]" />}>
        <Header />
      </Suspense>
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
