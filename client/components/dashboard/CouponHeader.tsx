import { X } from "lucide-react";

export default function CouponHeader({ closeFn }: { closeFn: () => void }) {
  return (
    <header className="flex flex-row px-4 lg:px-6 py-2.5 bg-indigo-400 w-full items-center justify-between">
      <h2 className="text-sm font-normal text-white">
        Use code <span className="font-medium">NOVEMBER2025</span> to get 20%
        off
      </h2>
      <button
        className="flex items-center justify-center p-0.5"
        onClick={closeFn}
      >
        <X className=" shrink-0 text-gray-50 size-5" />
      </button>
    </header>
  );
}
