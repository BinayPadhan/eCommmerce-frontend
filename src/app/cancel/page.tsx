import { CircleX } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <CircleX size={78} className="text-red-600 mb-4 animate-pulse"/>
      <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-red-800 mb-6">Your payment was not completed. You can try again or review your cart.</p>
      <Link href="/cart" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Back to Cart</Link>
    </div>
  );
} 