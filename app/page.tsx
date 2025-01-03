"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  images: string[];
  totalSeats: number;
}

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`
        );
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        const data = await res.json();
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        setError("Error loading restaurants");
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Available Restaurants
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant._id}
            href={`/restaurants/${restaurant._id}`}
            className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition"
          >
            <img
              src={restaurant.images[0]}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <p className="text-gray-600 mt-2">{restaurant.description}</p>
              <p className="text-sm mt-3 font-medium">
                Total Seats: {restaurant.totalSeats}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
