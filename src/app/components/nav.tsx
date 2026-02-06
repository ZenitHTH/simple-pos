"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

interface ItemNavInf {
  id: number;
  link: string;
  name: string;
}

const itemNav: ItemNavInf[] = [
  { id: 0, link: "/", name: "Home" },
  { id: 1, link: "/table", name: "Table" },
  { id: 2, link: "/manage", name: "Manage" },
  { id: 3, link: "/setting", name: "Setting" },
  { id: 4, link: "/about", name: "About" },
];

const itemNavLogin: ItemNavInf[] = [
  { id: 0, link: "/login", name: "Login" },
  { id: 1, link: "/register", name: "Register" },
];

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-card-bg border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-[1320px] px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="text-xl font-bold text-primary">
            <Link href="/">SimplePOS</Link>
          </div>

          {/* Desktop Menu */}


          {/* Menu Button */}
          <div>
            <button
              onClick={toggleMenu}
              className="p-2 text-muted hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Dropdown */}
        {isOpen && (
          <div className="pb-4 pt-2 border-t border-border animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              {itemNav.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(item.link)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-border my-2"></div>
              {itemNavLogin.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
