import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading"; // Import the Loading component

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  images: string[];
  totalSeats: number;
}

// Fetch restaurant data from API
async function getRestaurants(): Promise<Restaurant[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch restaurants");
  }
  return res.json();
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center mb-10">
          Discover Available Restaurants
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <Link href={`/restaurants/${restaurant._id}`} key={restaurant._id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer">
                <img
                  src={restaurant.images[0] || "/placeholder.png"}
                  alt={restaurant.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-2xl font-semibold">{restaurant.name}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <p className="text-blue-500 mt-4">
                    Available Seats: {restaurant.totalSeats}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
