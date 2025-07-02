export default function HomePage() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Welcome to the Hostel Management System</h2>
      <p className="mb-4">
        This is the homepage where you can find important information and quick links to manage hostels, rooms, and payments.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Manage Hostels</h3>
          <p>View and manage hostel blocks, rooms, and amenities.</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Room Allocation</h3>
          <p>Allocate rooms to students and track occupancy status.</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Payments</h3>
          <p>Manage payment processing and view payment history.</p>
        </div>
      </div>
    </section>
  );
}
