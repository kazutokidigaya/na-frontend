"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";

interface Restaurant {
  name: string;
  description: string;
  contact: string;
  email: string;
  totalSeats: number;
  images: string[];
  workingHours: { [key: string]: string };
}

export default function EditRestaurant() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRestaurant(data);
        setPreviewImages(data.images || []);
      })
      .catch((error) => console.error("Error fetching restaurant:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!restaurant) return;
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewImages([...newImages, ...selectedFiles]);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);

    const updatedImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedImages);
  };

  const handleWorkingHoursChange = (day: string, value: string) => {
    if (!restaurant) return;
    setRestaurant({
      ...restaurant,
      workingHours: { ...restaurant.workingHours, [day]: value },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", restaurant!.name);
    formData.append("description", restaurant!.description);
    formData.append("contact", restaurant!.contact);
    formData.append("totalSeats", restaurant!.totalSeats.toString());
    formData.append("workingHours", JSON.stringify(restaurant!.workingHours));

    newImages.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      setMessage("Restaurant updated successfully!");
      toast.success("Restaurant updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      setMessage("Error updating restaurant");
      toast.error("Error updating restaurant");
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant || loading) {
    return <Loading />;
  }

  return (
    <div className=" flex flex-col ">
      <p
        onClick={() => router.push("/dashboard")}
        className="my-4 mx-6 cursor-pointer hover:bg-gray-300 px-4 py-2 text-black bg-gray-100 rounded-md font-semibold shadow-md w-20 text-center "
      >
        Back
      </p>

      <div className="container mx-auto p-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Edit Restaurant</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
        >
          <label className="block">
            Name
            <input
              type="text"
              name="name"
              value={restaurant.name}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            Description
            <textarea
              name="description"
              value={restaurant.description}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded"
              rows={4}
              required
            ></textarea>
          </label>

          <label className="block">
            Contact
            <input
              type="text"
              name="contact"
              value={restaurant.contact}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            Total Seats
            <input
              type="number"
              name="totalSeats"
              value={restaurant.totalSeats}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded"
              required
            />
          </label>

          {/* Working Hours Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Working Hours</h3>
            {Object.entries(restaurant.workingHours).map(([day, value]) => (
              <label key={day} className="block mb-4">
                {day.charAt(0).toUpperCase() + day.slice(1)}
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleWorkingHoursChange(day, e.target.value)
                  }
                  className="w-full mt-2 p-2 border rounded"
                  required
                />
              </label>
            ))}
          </div>

          {/* Image Upload Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">
              Upload Images (Max 6)
            </h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-2 p-2"
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previewImages.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt="preview"
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
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Restaurant"}
          </button>

          {message && <p className="mt-4 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
