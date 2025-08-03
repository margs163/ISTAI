import {
  Bot,
  CircleCheck,
  Clock,
  SquareChartGantt,
  Target,
  TimerReset,
  UserCircle,
} from "lucide-react";

export default function TestSession() {
  return (
    <section className="p-6 py-0 max-w-[420px] min-w-[370px] mx-auto lg:mx-0">
      <div className="p-6 rounded-xl border border-gray-200 space-y-6 bg-white">
        <div className="flex flex-row items-center gap-2">
          <Target className="size-6 text-indigo-600" />
          <h3 className="font-semibold text-gray-800 text-xl">Test Session</h3>
        </div>
        <div className="flex flex-col gap-3 items-start justify-start">
          <div className="flex flex-row justify-start w-full items-stretch gap-3">
            <div className="flex flex-col items-start justify-start gap-2 w-1/2 p-3 px-4 rounded-lg bg-green-50 py-3">
              <div className="flex flex-row items-center justify-start gap-1.5">
                <CircleCheck className="text-green-600 size-5" />
                <p className="text-sm font-medium text-gray-600">Status</p>
              </div>
              <h3 className="text-green-600 px-2 py-0.5 rounded-md font-medium text-sm bg-green-100">
                Active
              </h3>
            </div>
            <div className="flex flex-col items-start justify-start gap-1 w-1/2 p-3 px-4 rounded-lg bg-gray-50 py-3">
              <div className="flex flex-row items-center justify-start gap-1.5">
                <SquareChartGantt className="text-blue-600 size-5" />
                <p className="text-sm font-medium text-gray-600">Part</p>
              </div>
              <h3 className="text-gray-800 text-base font-medium rounded-md">
                1 of 3
              </h3>
            </div>
          </div>
          <div className="flex flex-row justify-start w-full items-stretch gap-3">
            <div className="flex flex-col items-start justify-start gap-1 w-1/2 p-3 px-4 rounded-lg bg-gray-50 py-3">
              <div className="flex flex-row items-center justify-start gap-1.5">
                <Clock className="text-gray-600 size-4.5" />
                <p className="text-sm font-medium text-gray-600">Started</p>
              </div>
              <h3 className="text-gray-800 text-base font-medium rounded-md tracking-wider">
                17:58
              </h3>
            </div>
            <div className="flex flex-col items-start justify-start gap-1 w-1/2 p-3 px-4 rounded-lg bg-gray-50 py-3">
              <div className="flex flex-row items-center justify-start gap-1.5">
                <TimerReset className="text-blue-600 size-5" />
                <p className="text-sm font-medium text-gray-600">Duration</p>
              </div>
              <h3 className="text-gray-800 text-base font-medium rounded-md">
                11-14 min
              </h3>
            </div>
          </div>
          <div className="flex flex-row justify-start w-full items-stretch gap-3">
            <div className="flex flex-col items-start justify-start gap-1 w-1/2 p-3 px-4 rounded-lg bg-gray-50 py-3">
              <div className="flex flex-row items-center justify-start gap-1.5">
                <Bot className="text-gray-600 size-5" />
                <p className="text-sm font-medium text-gray-600">Assistant</p>
              </div>
              <h3 className="text-gray-800 text-base font-medium rounded-md tracking-wider">
                Ron
              </h3>
            </div>
            <div className="flex flex-col items-start justify-start gap-1 w-1/2 p-3 px-4 rounded-lg bg-gray-50 py-3">
              <div className="flex flex-row items-center justify-start gap-1.5">
                <UserCircle className="text-blue-600 size-5" />
                <p className="text-sm font-medium text-gray-600">User</p>
              </div>
              <h3 className="text-gray-800 text-base font-medium rounded-md">
                John
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
