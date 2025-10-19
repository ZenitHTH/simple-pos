import React from "react";
import Link from "next/link";

interface itemNavInf {
  id: number;
  link: string;
  name: string;
}
const itemNav: itemNavInf[] = [
  {
    id: 0,
    link: "/",
    name: "home",
  },
  {
    id: 1,
    link: "/about",
    name: "about",
  },
  {
    id: 2,
    link: "/setting",
    name: "setting",
  },
  {
    id: 3,
    link: "/manage",
    name: "manage",
  },
  {
    id: 4,
    link: "/table",
    name: "table",
  },
];

function Nav() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-4">
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-glow">
          {itemNav.map((item: itemNavInf) => {
            return (
              <button
                key={item.id}
                className="flex items-center px-4 py-2 border rounded text-teal-200 bg-blue-800 hover:border-white"
              >
                <Link href={item.link} className="">
                  {item.name}
                </Link>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
