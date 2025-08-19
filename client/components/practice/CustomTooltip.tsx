import { TooltipRenderProps } from "react-joyride";

export default function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      className="bg-white p-6 py-5 rounded-lg shadow-md max-w-[320px] transition-opacity duration-300 ease-in-out animate-fade-in flex flex-col gap-2 justify-start items-start font-geist"
    >
      <h3 className="text-base font-semibold text-gray-800">{step.title}</h3>
      <p className="text-sm text-gray-600">{step.content}</p>
      <div className="mt-4 flex justify-end self-end gap-2">
        {index > 0 && (
          <button
            {...backProps}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm text-xs font-medium hover:bg-gray-300 active:bg-gray-300 transition-colors"
          >
            Back
          </button>
        )}
        {continuous && (
          <button
            {...primaryProps}
            className="px-4 py-2 bg-indigo-500 text-white rounded-sm text-xs font-medium hover:bg-indigo-600 active:bg-gray-300 transition-colors"
          >
            Next
          </button>
        )}
        {!continuous && (
          <button
            {...closeProps}
            className="px-4 py-2 bg-green-500 text-white rounded-sm font-medium hover:bg-green-600"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
