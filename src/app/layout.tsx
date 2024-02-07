'use client'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query'

import { Montserrat } from "next/font/google";
import "./globals.css";


const inter = Montserrat({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={inter.className}>{children}</body>
      </QueryClientProvider>

    </html>
  );
}
