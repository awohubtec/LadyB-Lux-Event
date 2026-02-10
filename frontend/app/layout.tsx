import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'LadyB Lux Events - Plan Your Event',
  description: 'Book vendors for your perfect event',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2026 LadyB Lux Events. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
