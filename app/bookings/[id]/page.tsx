"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";

export default function ModifyBooking() {
  const [booking, setBooking] = useState<any>(null);
  const [guests, setGuests] = useState(1);
  const [reservationTime, setReservationTime] = useState("");
  const [duration, setDuration] = useState("30min");
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { id } = useParams() as { id: string };

  // Fetch booking details
  useEffect(() => {
    setLoading(true);
    async function fetchBooking() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`
        );
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
          setBooking(data);
          setGuests(data.guests);
          setDuration(data.duration);

          // Format the reservationTime correctly for datetime-local input
          const formattedTime = data.reservationTime.slice(0, 16);
          setReservationTime(formattedTime);

          // Call seat availability immediately after booking fetch
          checkAvailableSeats(formattedTime, data.restaurantId);
        } else {
          setMessage(data.message || "Failed to fetch booking details");
        }
      } catch (error) {
        setLoading(false);
        setMessage("Failed to fetch booking details");
      }
    }
    fetchBooking();
  }, [id]);

  // Check seat availability
  const checkAvailableSeats = async (time: string, restaurantId: string) => {
    setLoading(true);
    try {
      const isoTime = new Date(time).toISOString(); // Ensure full ISO string
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/seats/${restaurantId}?reservationTime=${isoTime}&excludeBookingId=${id}`
      );
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setAvailableSeats(data.availableSeats);
      } else {
        setAvailableSeats(null);
        setMessage(data.message || "Failed to check seat availability.");
      }
    } catch (error) {
      setLoading(false);
      setAvailableSeats(null);
      setMessage("Error checking seat availability.");
    }
  };

  // Handle Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (availableSeats !== null && guests > booking?.data?.totalSeats) {
      setMessage("Not enough seats available for the selected time.");
      setLoading(false);
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationTime, guests, duration }),
      }
    );
    setLoading(false);

    if (res.ok) {
      router.push("/");
      toast.success(
        "Booking Updated scucessfully, Please Check email for more details."
      );
    } else {
      const data = await res.json();
      setMessage(data.message || "Failed to update booking.");
      toast.error(data.message);
    }
    setLoading(false);
  };

  // Handle Cancellation
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    setLoading(true);
    setMessage(null);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
      {
        method: "DELETE",
      }
    );
    setLoading(false);
    if (res.ok) {
      toast.success("Booking Cancelled successfully");
      router.push("/");
    } else {
      setMessage("Failed to cancel booking. Please try again.");
    }
    setLoading(false);
  };

  if (!booking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-6">Modify or Cancel Booking</h1>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Time Slot</label>
          <input
            type="datetime-local"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          {availableSeats !== null && (
            <p className="text-green-500 mt-2">
              {availableSeats} seats available
            </p>
          )}
        </div>
        <div className="mb-4">
          <label>Guests</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min="1"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label>Select Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="15min">15 Minutes</option>
            <option value="30min">30 Minutes</option>
            <option value="45min">45 Minutes</option>
            <option value="1h">1 Hour</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Update Booking
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="w-full mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Cancel Booking
        </button>
      </form>
    </div>
  );
}
