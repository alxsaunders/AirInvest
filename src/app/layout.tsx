import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AirInvst - Watch Your Investments Soar',
  description: 'Investment platform for real estate analysis using Airbnb and Zillow data',

};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1E1E1E]`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
