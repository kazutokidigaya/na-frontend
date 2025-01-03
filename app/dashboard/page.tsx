"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

interface Restaurant {
  _id: string;
  name: string;
  totalSeats: number;
}

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/my-restaurants`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error("Error fetching restaurants:", error))
      .finally(() => setLoading(false));
  }, []);

  // Delete Restaurant
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLoading(false);
      if (res.ok) {
        setRestaurants(restaurants.filter((rest) => rest._id !== id));
      } else {
        alert("Failed to delete the restaurant");
      }
    } catch (error) {
      setLoading(false);
      alert("Error deleting the restaurant");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Restaurants</h1>

      <button
        className="bg-green-500 text-white px-6 py-3 rounded mb-6"
        onClick={() => router.push("/dashboard/add-restaurant")}
      >
        + Add New Restaurant
      </button>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="p-4 border rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                  <p>Total Seats: {restaurant.totalSeats}</p>
                </div>
                <div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() =>
                      router.push(
                        `/dashboard/edit-restaurant/${restaurant._id}`
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleDelete(restaurant._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No restaurants found. Start by adding one!</p>
          )}
        </div>
      )}
    </div>
  );
}
