import './globals.css'
import { Nunito } from "next/font/google"
import Script from 'next/script'
import { Suspense } from 'react'
import Link from 'next/link'
import { ThemeProvider } from 'next-themes'
import MobileNav from './components/MobileNav'
import Navigation from './components/Navigation'
import TopNav from "./components/TopNav"
import Footer from './components/Footer'
import Logo from './components/Logo'
import VersionsPreloader from './components/VersionsPreloader'
import AppTooltipProvider from './components/AppTooltipProvider'

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata = {
  title: 'ModrinthProxy',
  description: 'Удобный поиск и скачивание модов, плагинов, шейдеров для Minecraft на русском языке',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ModrinthProxy'
  },
  verification: {
    yandex: '63b445e8cd86247b'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1bd96a'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`scroll-smooth ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon.png?v=2" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105182235', 'ym');
          ym(105182235, 'init', {ssr:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`}
        </Script>
      </head>
      <body className={`${nunito.className} min-h-screen m-0`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
          storageKey="modrinth-theme"
        >
          <AppTooltipProvider>
          <noscript dangerouslySetInnerHTML={{ __html: '<div><img src="https://mc.yandex.ru/watch/105182235" style="position:absolute; left:-9999px;" alt="" /></div>' }} />
          <VersionsPreloader />
          <TopNav />
          <nav className="bg-modrinth-darker shadow-lg hidden lg:block">
            <div className="container mx-auto px-4 py-3 md:py-4">
              <div className="flex items-center gap-4 md:gap-6">
                <Suspense fallback={<div className="w-9 h-9 flex-shrink-0"></div>}>
                  <Logo />
                </Suspense>
                <Navigation />
              </div>
            </div>
          </nav>
          <div className="bg-modrinth-darker flex justify-center pt-2 pb-2 -mt-1 rounded-b-2xl">
            <div className="disclaimer-badge">
              <svg className="w-3 h-3 flex-shrink-0 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10">Unofficial site, not affiliated with modrinth.com.</span>
              <Link href="/bmadnco" className="relative z-10 underline hover:text-purple-300 transition-colors font-semibold">What is this?</Link>
            </div>
          </div>
          <main className="container">
            {children}
          </main>
          <MobileNav />
          <Footer />
          </AppTooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
