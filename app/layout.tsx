import type {Metadata} from 'next';
import { Albert_Sans } from 'next/font/google';
import Script from "next/script";
import './globals.css'; // Global styles
import { Agentation } from "agentation";

const albertSans = Albert_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '600', '700', '800'] });

export const metadata: Metadata = {
  title: "Navid's Portfolio",
  description: 'Portfolio of Navid, Photographer & Cinematographer based in Atlanta, US.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={albertSans.variable}>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
