"use client";

import { usePathname } from "next/navigation";
import { trackResourceDownload } from "../lib/analytics";

type TrackedResourceDownloadProps = {
  className: string;
  href: string;
  resourceTitle: string;
  children: React.ReactNode;
};

export default function TrackedResourceDownload({
  className,
  href,
  resourceTitle,
  children,
}: TrackedResourceDownloadProps) {
  const pathname = usePathname();

  return (
    <a
      className={className}
      download
      href={href}
      onClick={() => trackResourceDownload(resourceTitle, pathname)}
    >
      {children}
    </a>
  );
}
