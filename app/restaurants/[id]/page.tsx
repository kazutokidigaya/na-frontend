"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BookingModal from "@/components/BookingModal";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  images: string[];
  totalSeats: number;
  workingHours: Record<string, string>;
}

interface BookingDetails {
  userName: string;
  userEmail: string;
  reservationTime: string;
  guests: number;
  duration: string;
  restaurantName: string;
}

export default function RestaurantDetails() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  const [guests, setGuests] = useState(1);
  const [reservationTime, setReservationTime] = useState("");
  const [duration, setDuration] = useState("1h");
  const [message, setMessage] = useState("");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  useEffect(() => {
    async function fetchRestaurant() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${id}`
        );

        if (!res.ok) throw new Error("Failed to fetch restaurant");
        const data = await res.json();
        setRestaurant(data);
      } catch (error) {
        setError("Error loading restaurant details");
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurant();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const bookingData = {
      restaurantId: id,
      guests,
      reservationTime,
      duration,
      userEmail,
      userName,
    };
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );
      toast.success("Booking Confirmed please check email for more.");
      setLoading(false);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Booking failed. Please try again.");
        toast.error(data.message);
      } else {
        setBookingDetails({
          userName,
          userEmail,
          reservationTime,
          guests,
          duration,
          restaurantName: restaurant?.name || "",
        });
        setShowModal(true);
        localStorage.setItem("userEmail", userEmail);
        setUserName("");
        setUserEmail("");
        setGuests(1);
        setReservationTime("");
        setDuration("1h");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error during booking. Please try again.");
      setMessage("Error during booking. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
          <p className="text-gray-600 mb-6">{restaurant.description}</p>

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {restaurant.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${restaurant.name} image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Working Hours</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(restaurant.workingHours).map(([day, hours]) => (
                <li
                  key={day}
                  className="p-4 border rounded-lg shadow-md flex justify-between"
                >
                  <span className="font-medium">{day}</span>
                  <span>{hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="md:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Book a Table</h2>

            <form onSubmit={handleBooking}>
              <label className="block mb-4">
                Your Name
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full mt-2 p-2 border rounded"
                  required
                />
              </label>

              <label className="block mb-4">
                Email
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full mt-2 p-2 border rounded"
                  required
                />
              </label>

              <label className="block mb-4">
                Guests
                <input
                  type="number"
                  min="1"
                  max={restaurant.totalSeats}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full mt-2 p-2 border rounded"
                  required
                />
              </label>

              <label className="block mb-4">
                Reservation Time
                <input
                  type="datetime-local"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className="w-full mt-2 p-2 border rounded"
                  required
                />
              </label>

              {/* Duration Selection */}
              <div className="mb-6">
                <p className="mb-2">Select Duration</p>
                <div className="flex space-x-4">
                  {["15min", "30min", "45min", "1h"].map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setDuration(time)}
                      className={`px-4 py-2 border rounded ${
                        duration === time
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-green-500 w-full text-white py-3 rounded-lg hover:bg-green-600"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
      {message && (
        <div className="mt-5 text-center">
          <p className="font-bold text-red-400 text-xl">{message}</p>
        </div>
      )}
      {/* Modal */}
      {showModal && bookingDetails && (
        <BookingModal
          bookingDetails={bookingDetails}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
