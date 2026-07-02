import { Sora, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "JobMatch — CV Analysis & Job Matching",
  description:
    "Upload your CV, get it analyzed, and find matching jobs with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${inter.variable} ${plexMono.variable} antialiased bg-[var(--bg)] text-[var(--ink)]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
