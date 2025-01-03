// app/users/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      localStorage.setItem("token", data.accessToken);
      toast.success(`Welcome ${email}`);
      router.push("/dashboard");
    } else {
      setMessage(data.message || "Login failed.");
      toast.error("Please check Password and Email");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit}>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p
        className="mt-6 mb-4 text-gray-500 text-sm cursor-pointer hover:text-gray-800"
        onClick={() => router.push("/users/signup")}
      >
        {" "}
        New User? Please SignUp!!
      </p>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
