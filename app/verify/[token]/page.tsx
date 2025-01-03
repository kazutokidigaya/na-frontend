"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react"; // Import the 'use' hook

export default function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [message, setMessage] = useState("Verifying...");
  const router = useRouter();

  // Unwrap params using React.use()
  const unwrappedParams = use(params);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/verify/${unwrappedParams.token}`
        );

        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
          setTimeout(() => {
            router.push("/users/login");
          }, 3000); // Redirect to login after 3 seconds
        } else {
          setMessage(data.message || "Verification failed. Try again.");
        }
      } catch (error) {
        setMessage("Error verifying account. Please try again later.");
      }
    };

    verifyUser();
  }, [unwrappedParams.token, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold">{message}</h1>
    </div>
  );
}
