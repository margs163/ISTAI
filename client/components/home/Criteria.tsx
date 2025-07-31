import clsx from "clsx";
import { LucideProps, Speaker } from "lucide-react";
import React from "react";

export default function Criteria({
  criterion,
  description,
  icon: Icon,
  color,
}: {
  criterion: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  color: string;
}) {
  return (
    <div className="flex flex-row items-center gap-4 justify-start p-4 px-5 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 min-w-full">
      <Icon
        className={clsx(
          `size-6 bg-indigo-100 p-3 box-content rounded-xl shrink-0 text-indigo-600`
        )}
      />
      <div>
        <h3 className="text-base font-medium text-gray-700">{criterion}</h3>
      </div>
    </div>
  );
}
