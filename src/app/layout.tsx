import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "../styles.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Levan - Software Engineer & Full-Stack Developer",
  description:
    "Portfolio of Levan - full-stack software engineer building fast, reliable web apps with .NET, React, Next.js and PostgreSQL.",
  authors: [{ name: "Levan" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Levan - Software Engineer & Full-Stack Developer",
    description:
      "Full-stack engineer specialising in .NET, React and modern web platforms. See selected projects, experience and get in touch.",
    type: "website",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/31e6d2be-347f-4c8e-b3b6-e7b6ec56a018/id-preview-d67b0ad8--98e05207-f7a1-422a-a9e6-509e6ae22c14.lovable.app-1783024052002.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Levan - Software Engineer & Full-Stack Developer",
    description:
      "Portfolio Brilliance creates a modern, premium personal website to showcase a full-stack developer's skills and projects to recruiters.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/31e6d2be-347f-4c8e-b3b6-e7b6ec56a018/id-preview-d67b0ad8--98e05207-f7a1-422a-a9e6-509e6ae22c14.lovable.app-1783024052002.png",
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
