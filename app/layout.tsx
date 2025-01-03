import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col">
        <ToastContainer />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
