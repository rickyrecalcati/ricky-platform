"use client";

import { usePathname } from "next/navigation";
import { trackAmazonBookClick } from "../lib/analytics";

type TrackedAmazonLinkProps = {
  bookTitle: string;
  className: string;
  href: string;
  children: React.ReactNode;
};

export default function TrackedAmazonLink({
  bookTitle,
  className,
  href,
  children,
}: TrackedAmazonLinkProps) {
  const pathname = usePathname();

  return (
    <a
      className={className}
      href={href}
      onClick={() => trackAmazonBookClick(bookTitle, pathname)}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
