import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hostel Management System</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
          </li>
          <li>
            <Link href="/facilities" className="hover:text-blue-600">
              Facilities
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
