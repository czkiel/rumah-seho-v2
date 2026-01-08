// src/app/dashboard/layout.js
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-orange-50">
      {/* Sidebar (Fixed di kiri desktop, hidden di mobile) */}
      <div className="w-0 lg:w-80">
        <Sidebar />
      </div>

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        {/* Tombol menu untuk mobile (Hamburger) */}
        <label
          htmlFor="my-drawer-2"
          className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none drawer-button lg:hidden mb-4 rounded-xl shadow-lg">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          Menu
        </label>

        {children}
      </main>
    </div>
  );
}
