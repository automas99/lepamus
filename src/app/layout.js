import '../app/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Hostel Management System</title>
        <meta name="description" content="Hostel Management System for Kenyan educational institutions" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <main className="p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
