interface Props {
  readonly children: string;
}

export default function ButtonSecondary({ children }: Props) {
  return (
    <button className="w-full focus:outline focus:outline-gray-200 focus:outline-offset-2 rounded-lg px-2.5 py-1 font-medium text-sm  border border-gray-200 text-black bg-white hover:bg-gray-50 focus:bg-gray-100">
      {children}
    </button>
  );
}
