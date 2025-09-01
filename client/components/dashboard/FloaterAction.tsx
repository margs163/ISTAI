import React, { MouseEvent, ReactNode } from "react";
import MainButton from "../MainButton";
import dynamic from "next/dynamic";
import { TestTipsGeneral } from "./TestTipsGeneral";

const Floater = dynamic(() => import("react-floater"), { ssr: false });

function FloaterContent({
  title,
  desc,
  closeFn,
  startCallback,
}: {
  title: string;
  desc: string;
  closeFn: (event: MouseEvent<HTMLButtonElement>) => void;
  startCallback: (() => void) | React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col font-geist gap-6 items-start justify-start bg-white rounded-md p-5">
      <div className="space-y-1">
        <h1 className="text-sm font-medium text-gray-800">{title}</h1>
        <p className="text-xs font-normal text-gray-600">{desc}</p>
      </div>
      <footer className="flex flex-row gap-1 ml-auto">
        <MainButton
          variant="secondary"
          onClick={closeFn}
          className="text-xs ml-0"
        >
          Close
        </MainButton>
        <MainButton
          onClick={(e) => {
            startCallback((prev) => !prev);
            closeFn(e);
          }}
          className="text-xs ml-0 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600 text-white"
        >
          Start
        </MainButton>
      </footer>
    </div>
  );
}

function TipsContent({
  closeFn,
}: {
  closeFn: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div className="flex flex-col font-geist gap-6 items-start justify-start bg-white rounded-md p-5">
      <div className="space-y-1">
        <TestTipsGeneral />
      </div>
      <footer className="flex flex-row gap-1 ml-auto">
        <MainButton
          variant="secondary"
          onClick={closeFn}
          className="text-xs ml-0"
        >
          Close
        </MainButton>
      </footer>
    </div>
  );
}

export function FloaterAction({
  children,
  title,
  desc,
  startCallback,
}: {
  children: ReactNode;
  title: string;
  desc: string;
  startCallback: (() => void) | React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Floater
      placement="top"
      component={({ closeFn }) => (
        <FloaterContent
          startCallback={startCallback}
          closeFn={closeFn}
          title={title}
          desc={desc}
        />
      )}
    >
      {children}
    </Floater>
  );
}

export function TipsFloaterAction({ children }: { children: ReactNode }) {
  return (
    <Floater
      placement="top"
      component={({ closeFn }) => <TipsContent closeFn={closeFn} />}
    >
      {children}
    </Floater>
  );
}
