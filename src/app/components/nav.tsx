import React from "react";
import Link from "next/link";

interface itemNavInf {
  link: string;
  name: string;
}
const itemNav: itemNavInf[] = [
  {
    link: "/",
    name: "home",
  },
  {
    link: "/",
    name: "about",
  },
];

function Nav() {
  return (
    <nav className="flex items-center justify-between bg-gray-800">
      {itemNav.map((item: itemNavInf) => {
        return (
          <div className="mx-3" key={0}>
            <button className="">
              <Link href={item.link}>{item.name}</Link>
            </button>
          </div>
        );
      })}
    </nav>
  );
}

export default Nav;
