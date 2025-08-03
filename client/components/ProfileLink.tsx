import { User } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProfileLink() {
  return (
    <Link href={"#"}>
      <button className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-600 active:bg-indigo-600 transition-colors">
        <User className="size-4 text-white shrink-0" />
      </button>
    </Link>
  );
}
