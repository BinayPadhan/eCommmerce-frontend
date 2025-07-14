"use client";
import Link from "next/link";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";
import CategoriesDropdown from "./CategoriesDropdown";
import { useState } from "react";
import { fetchCategories } from "../../utils/api";
import useSWR from "swr";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const { data: categories = [], isLoading } = useSWR("categories", fetchCategories);

  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 fixed top-0 left-0 right-0 bg-white z-50 shadow-md">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between lg:hidden">
        <div className="flex w-1/3 items-center gap-4">
          <Menu />
          <Link href="/">
            <div className="text-2xl tracking-wide">StayDrippy</div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <NavIcons />
        </div>
      </div>

      {/* BIGGER SCREENS */}
      <div className="hidden lg:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-semibold tracking-wide">StayDrippy</div>
          </Link>
          <div className="hidden lg:flex gap-4 text-lg">
            <Link href="/" className="font-sans relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
              Home
            </Link>
            <div className="relative group">
              <button
                onClick={() => setShowCategories((prev) => !prev)}
                className="flex font-sans relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                aria-expanded={showCategories}
                aria-controls="categories-dropdown"
              >
                Categories <ChevronDown className={`my-auto transition-transform duration-300 ${showCategories ? 'rotate-180' : ''} group-hover:rotate-180`} />
              </button>
              <div
                id="categories-dropdown"
                className={`${
                  showCategories ? "block" : "hidden group-hover:block"
                }`}
              >
                {isLoading ? (
                  <div className="absolute top-full left-0 bg-white shadow-lg p-4 min-w-[200px]">
                    <div className="animate-pulse flex flex-col gap-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ) : (
                  <CategoriesDropdown data={categories} />
                )}
              </div>
            </div>
            <Link href="/" className="font-sans relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
              About
            </Link>
            <Link href="/" className="font-sans relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
              Contact
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-1/3 xl:w-1/2 flex items-center justify-end gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;