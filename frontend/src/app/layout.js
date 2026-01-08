import "./globals.css";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Rumah Seho Nusantara",
  description: "Aplikasi Penjualan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
