import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Fraunces, Manrope, Cairo } from "next/font/google";
import "@/app/globals.css";
import { FloatingWhatsApp, MobileActionBar } from "@/components/shared/Actions";
import Link from "next/link";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "ar" | "en")) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${manrope.variable} ${cairo.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col relative pb-12 md:pb-0">
            <header className="border-b border-sand bg-ivory p-4">
              <div className="container mx-auto flex items-center justify-between">
                <div className="font-fraunces text-2xl font-bold text-brand">
                  Domicile
                </div>
                <nav className="flex gap-4">
                  <Link
                    href={`/${locale}`}
                    className="text-charcoal hover:text-brand"
                  >
                    Home
                  </Link>
                  <Link
                    href={`/${locale}/collections`}
                    className="text-charcoal hover:text-brand"
                  >
                    Collections
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="text-charcoal hover:text-brand"
                  >
                    Contact
                  </Link>
                </nav>
                <div className="flex gap-2">
                  <Link href="/fr" className="text-sm">
                    FR
                  </Link>
                  <Link href="/en" className="text-sm">
                    EN
                  </Link>
                  <Link href="/ar" className="text-sm">
                    عربي
                  </Link>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="bg-charcoal p-4 text-ivory">
              <div className="container mx-auto text-center">
                &copy; {new Date().getFullYear()} Domicile. All rights reserved.
              </div>
            </footer>
            <FloatingWhatsApp />
            <MobileActionBar />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
