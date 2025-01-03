// app/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleAddRestaurant = () => {
    router.push("/users/signup");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-3xl font-bold text-blue-500">
          TableBooking
        </Link>

        <div>
          <button
            onClick={handleAddRestaurant}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Add a Restaurant
          </button>
        </div>
      </div>
    </nav>
  );
}
