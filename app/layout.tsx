import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CookieBanner from "@/components/cookies/cookie-banner"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
title: "Product Beers",
description: "Plataforma de eventos para la comunidad de producto",
keywords: [
  "product management",
  "tech",
  "valencia",
  "networking",
  "eventos",
  "comunidad",
  "tecnología",
  "startups",
],
authors: [{ name: "Product Beers Valencia" }],
creator: "Product Beers Valencia",
publisher: "Product Beers Valencia",
formatDetection: {
  email: false,
  address: false,
  telephone: false,
},
metadataBase: new URL("https://productbeers.com"),
alternates: {
  canonical: "/",
},
openGraph: {
  type: "website",
  locale: "es_ES",
  url: "https://productbeers.com",
  title: "Product Beers Valencia - Comunidad Tech",
  description:
    "La comunidad de profesionales tech más activa de Valencia. Eventos, networking y conocimiento en un ambiente relajado con las mejores cervezas.",
  siteName: "Product Beers Valencia",
  images: [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Product Beers Valencia - Comunidad Tech",
    },
  ],
},
twitter: {
  card: "summary_large_image",
  title: "Product Beers Valencia - Comunidad Tech",
  description:
    "La comunidad de profesionales tech más activa de Valencia. Eventos, networking y conocimiento en un ambiente relajado con las mejores cervezas.",
  images: ["/og-image.jpg"],
  creator: "@productbeers",
},
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
},
verification: {
  google: "your-google-verification-code",
},
    generator: 'v0.dev'
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
  <html lang="es">
    <head>
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#FF6B35" />
      <meta name="msapplication-TileColor" content="#FF6B35" />
    </head>
    <body className={inter.className}>
      <AuthProvider>
        <Header />
        <main className="min-h-[calc(100vh-64px)] bg-background">{children}</main>
        <Footer />
      </AuthProvider>
      <CookieBanner />
      <Toaster />
    </body>
  </html>
)
}
