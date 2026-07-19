import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Thittam AI — Find your government schemes",
  description:
    "AI assistant that helps citizens in Tamil Nadu discover central and state welfare schemes they qualify for — in Tamil and English.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ta">
      <body>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
