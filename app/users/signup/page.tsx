// app/users/signup/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setMessage(
        "Signup successful! Please check your email for verification."
      );
      toast.success("Signup successful! Please verify email.");
      router.push("/users/login");
    } else {
      setMessage(data.message || "Signup failed.");
      toast.error("Signup failed.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p
        className="mt-6 mb-4 text-gray-500 text-sm cursor-pointer hover:text-gray-800"
        onClick={() => router.push("/users/login")}
      >
        {" "}
        Already A User? Please Login
      </p>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
