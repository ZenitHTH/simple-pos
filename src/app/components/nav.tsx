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
    link: "/",
    name: "about",
  },
  {
    id: 2,
    link: "/",
    name: "setting",
  },
  {
    id: 3,
    link: "/",
    name: "manage",
  },
  {
    id: 4,
    link: "/",
    name: "table",
  },
];

function Nav() {
  return (
    <nav className="flex items-center justify-between flex-warp bg-gray-800 p-4">
      {itemNav.map((item: itemNavInf) => {
        return (
          <div className="block lg:hidden" key={item.id}>
            <button className="flex items-center px-4 py-2 border rounded text-teal-200 bg-blue-800 hover:border-white">
              <Link href={item.link} className="">
                {item.name}
              </Link>
            </button>
          </div>
        );
      })}
    </nav>
  );
}

export default Nav;
