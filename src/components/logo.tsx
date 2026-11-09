import { asset, cx } from "@/lib/utils";

/** Logo original de CapKix (convertido a máscara para pintarlo en cualquier color). */
export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <span
      role="img"
      aria-label="CapKix"
      className={cx("logo-mask inline-block", mark ? "aspect-[1200/460]" : "aspect-[1200/565]", className)}
      style={{ ["--logo" as string]: `url(${asset(mark ? "/brand/mark-mask.png" : "/brand/logo-mask.png")})` }}
    />
  );
}
