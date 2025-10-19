import { Mic, Volume2, X } from "lucide-react";

export const Msg = ({
  closeToast,
  data,
}: {
  closeToast: () => void;
  data: { title: string; text: string };
}) => {
  return (
    <div className="flex flex-row items-center gap-2 font-geist w-full">
      <Volume2 className="text-indigo-500 size-6 mx-0.5" />
      <div className="flex flex-col items-start ml-1">
        <p className="text-sm leading-[1.38] font-medium text-gray-700">
          {data.title}
        </p>
        <p className="text-[13px] font-medium text-gray-500">{data.text}</p>
      </div>
      <X
        className="size-4 p-0.5 box-content hover:text-gray-600 cursor-pointer active:text-gray-600 transition-colors text-gray-500 ml-auto"
        onClick={closeToast}
      />
    </div>
  );
};
