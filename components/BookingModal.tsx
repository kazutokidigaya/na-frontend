interface BookingDetails {
  userName: string;
  userEmail: string;
  reservationTime: string;
  guests: number;
  duration: string;
  restaurantName: string;
}

interface ModalProps {
  bookingDetails: BookingDetails;
  onClose: () => void;
}

export default function BookingModal({ bookingDetails, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Booking Confirmed 🎉
        </h2>
        <div className="space-y-4">
          <p>
            <strong>Restaurant:</strong> {bookingDetails.restaurantName}
          </p>
          <p>
            <strong>Name:</strong> {bookingDetails.userName}
          </p>
          <p>
            <strong>Email:</strong> {bookingDetails.userEmail}
          </p>
          <p>
            <strong>Reservation Time:</strong>{" "}
            {new Date(bookingDetails.reservationTime).toLocaleString()}
          </p>
          <p>
            <strong>Guests:</strong> {bookingDetails.guests}
          </p>
          <p>
            <strong>Duration:</strong> {bookingDetails.duration}
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
