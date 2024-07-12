interface Props {
  readonly children: string;
}

/**
 * Secondary button component.
 *
 * This component renders a secondary button that can be used for cancel
 * actions, or for actions that are less prominent than the primary button.
 *
 * @param children - The text to be displayed in the button.
 */
export default function ButtonSecondary({ children }: Props) {
  return (
    // Render a button with the secondary button style
    <button
      // The button will fill the width of the parent container
      className="w-full focus:outline focus:outline-gray-200 focus:outline-offset-2 rounded-lg px-2.5 py-1 font-medium text-sm  border border-gray-200 text-black bg-white hover:bg-gray-50 focus:bg-gray-100"
    >
      {children}
    </button>
  );
}
