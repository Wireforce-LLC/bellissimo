import classNames from "classnames";
import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface Props {
  readonly children: ReactNode;
  readonly title?: String;
  readonly isBigModal?: boolean;
  readonly isNoPadding?: boolean;
  readonly onClose: () => void | any;
  readonly zIndex?: number
}

/**
 * Modal component.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content of the modal.
 * @param {string} [props.title] - The title of the modal.
 * @param {boolean} [props.isBigModal=false] - Indicates if the modal is big.
 * @param {boolean} [props.isNoPadding=false] - Indicates if the modal has no padding.
 * @param {Function} props.onClose - The function called when the modal is closed.
 * @returns {JSX.Element} The modal component.
 */
export default function Modal({
  title,
  isBigModal,
  children,
  onClose,
  isNoPadding = false,
  zIndex = 1
}: Props) {
  // Add event listener for escape key press to close the modal
  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    // Main modal container
    <motion.div
      transition={{ duration: 0.1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{zIndex: zIndex * 100}}
      className="w-full h-full overflow-hidden select-none bg-black bg-opacity-55 fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center"
    >
      {/* Modal content container */}
      <motion.div
        transition={{ duration: 0.1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={classNames(
          "bg-white border max-h-[80%] overflow-y-hidden block border-black",
          {
            "w-[80%] h-[80%]": isBigModal,
            "md:max-w-[90%] md:min-w-[60%] min-w-[80%] lg:min-w-[40%]":
              !isBigModal,
          }
        )}
      >
        {/* Modal header */}
        <div
          className={classNames(
            "w-full p-2 pb-2 h-[32px] bg-[#f8f9fa] flex flex-row justify-between items-center border-b border-b-[#dee2e6]"
          )}
        >
          <span className="text-xs font-medium">{title}</span>
          <button className="w-4 h-4 hover:bg-gray-100" onClick={onClose}>
            {/* Close button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Modal content */}
        <div className="w-full h-[calc(100%-34px)] overflow-y-auto">
          <div
            className={classNames({
              "p-2 h-full w-full": !isNoPadding,
              "h-full w-full": isNoPadding,
            })}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
