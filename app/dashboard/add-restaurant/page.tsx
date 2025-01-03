"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";

export default function AddRestaurant() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [totalSeats, setTotalSeats] = useState(10);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Dynamic Working Hours State
  const [workingHours, setWorkingHours] = useState({
    monday: "9:00 AM - 9:00 PM",
    tuesday: "9:00 AM - 9:00 PM",
    wednesday: "9:00 AM - 9:00 PM",
    thursday: "9:00 AM - 9:00 PM",
    friday: "9:00 AM - 11:00 PM",
    saturday: "9:00 AM - 11:00 PM",
    sunday: "Closed",
  });

  const handleWorkingHoursChange = (day: string, value: string) => {
    setWorkingHours((prev) => ({ ...prev, [day]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (fileList.length + images.length > 6) {
        alert("You can upload up to 6 images only.");
      } else {
        setImages(fileList);
      }
    }
  };

  const validateForm = () => {
    if (!name || !description || !contact || !email || !totalSeats) {
      setMessage("All fields are required.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }

    if (!/^\d{10}$/.test(contact)) {
      setMessage("Contact number must be 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("contact", contact);
    formData.append("email", email);
    formData.append("totalSeats", totalSeats.toString());
    formData.append("workingHours", JSON.stringify(workingHours));

    images.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/register`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLoading(false);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      setMessage("Restaurant registered successfully!");
      toast.success("Restaurant registered successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      setLoading(false);
      setMessage(error.message || "Error registering restaurant.");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Add New Restaurant
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            Restaurant Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            Contact Number
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            Total Seats
            <input
              type="number"
              min="1"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </label>
        </div>

        <label className="block">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
            rows={4}
            required
          />
        </label>

        {/* Working Hours */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Working Hours</h3>
          {Object.entries(workingHours).map(([day, value]) => (
            <label key={day} className="block mb-4">
              {day.charAt(0).toUpperCase() + day.slice(1)}
              <input
                type="text"
                value={value}
                onChange={(e) => handleWorkingHoursChange(day, e.target.value)}
                className="w-full mt-2 p-2 border rounded"
                required
              />
            </label>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Upload Images (Max 6)</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mt-2 p-2"
          />

          {/* Image Preview */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previewImages.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded-full"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Restaurant"}
        </button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
}
