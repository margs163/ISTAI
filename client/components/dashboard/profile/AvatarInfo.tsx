import { User } from "lucide-react";
import React from "react";

export default function AvatarInfo() {
  return (
    <section className="px-6 flex flex-col items-start gap-6 justify-start w-full">
      <div className="flex flex-row gap-4 items-center">
        <div className="h-18 w-18 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-600 active:bg-indigo-600 transition-colors">
          <User className="size-8 text-white shrink-0" />
        </div>
        <div className="flex flex-col gap-1 items-start">
          <h1 className="text-lg font-medium text-gray-800">Profile Picture</h1>
          <p className="text-sm font-normal text-gray-600">
            PNG, JPEG under 5MB
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-stretch justify-start">
        <button className="rounded-md border border-gray-200 bg-white shadow-sm px-4 py-2 text-sm font-medium">
          Upload new picture
        </button>
        <button className="rounded-md bg-gray-100 px-4 py-2 shadow-sm text-sm font-medium">
          Delete
        </button>
      </div>
    </section>
  );
}
