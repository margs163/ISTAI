import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProfileLink({ avatarUrl }: { avatarUrl?: string }) {
  return (
    <Link href={"/dashboard/profile"}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          width={200}
          height={200}
          alt="avatar"
          className="object-cover shrink-0 h-8 w-8 rounded-full border border-gray-300"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-600 active:bg-indigo-600 transition-colors">
          <User className="size-4 text-white shrink-0" />
        </div>
      )}
    </Link>
  );
}
