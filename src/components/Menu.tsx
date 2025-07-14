"use client";

import { useCart } from "@/context/CartContext";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const { cartItems } = useCart();


  return (
    <div className="">
      <MenuIcon 
        className={`cursor-pointer transition-transform duration-300 ${open ? 'rotate-90' : 'rotate-0'}`} 
        onClick={() => setOpen((prev) => !prev)} 
      />
      <div 
        className={`absolute bg-red-600 text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10 transition-all duration-300 ease-in-out ${
          open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
        }`}
      >
        <Link href="/" onClick={() => {
            setOpen(false);
          }} className="font-sans font-semibold  hover:text-black">Home</Link>
        <Link
        href="/#categories" 
          className="font-sans font-semibold hover:text-black"
          onClick={() => setOpen((prev) => !prev)}
        >
          Categories
        </Link>

        <Link href="/" className="font-sans font-semibold  hover:text-black">About</Link>
        <Link href="/" className="font-sans font-semibold  hover:text-black">Contact</Link>
        <Link href="/" className="font-sans font-semibold  hover:text-black">Logout</Link>
        <Link href="/cart" onClick={() => setOpen((prev) => !prev)} className="font-sans font-semibold  hover:text-black">Cart({cartItems.length})</Link>
      </div>
    </div>
  );
};

export default Menu;