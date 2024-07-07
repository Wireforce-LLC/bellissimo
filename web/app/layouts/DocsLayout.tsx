import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly title?: string;
}

export default function DocsLayout({
  children,
  title
}: Props) {
  return (
    <main className="w-full h-full bg-white flex flex-col overflow-hidden">
      <h1 className="font-semibold text-3xl">{title}</h1>
      <div className="w-full transition-all h-full bg-white overflow-y-auto">
        {children}
      </div>
    </main>
  );
}
