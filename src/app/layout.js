import '../app/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';
import UserProvider from '../components/Auth/UserProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Hostel Management System</title>
        <meta name="description" content="Hostel Management System for Kenyan educational institutions" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <UserProvider>
          <Header />
          <Toaster position='top-center'/>
          <main className="p-4">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
