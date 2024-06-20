import React, { ReactNode } from "react";

interface Props {
  readonly title?: string;
  readonly text?: string;
  readonly icon?: ReactNode;
  readonly isVisible?: boolean;
}

export default function FirstRecordPlease({
  isVisible,
  title,
  text,
  icon,
}: Props) {
  return (
    isVisible && (
      <div className="text-center flex flex-col items-center py-8 bg-white border-b border-gray-200">
        <div className="mx-auto mb-4 select-none">{icon}</div>

        <h1 className="text-lg font-bold w-96">{title}</h1>
        <p className="text-xs text-gray-500 w-[36 0px]">{text}</p>
      </div>
    )
  );
}
