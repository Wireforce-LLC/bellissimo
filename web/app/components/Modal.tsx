import classNames from "classnames";
import { ReactNode, useEffect } from "react";
import { motion } from "framer-motion"

interface Props {
  readonly children: ReactNode;
  readonly title?: String;
  readonly isBigModal?: boolean;
  readonly isNoPadding?: boolean;
  readonly onClose: () => void | any;
}

export default function Modal({
  title,
  isBigModal,
  children,
  onClose,
  isNoPadding = false,
}: Props) {
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
    <motion.div 
      transition={{ duration: 0.1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}  
      className="w-full h-full bg-black bg-opacity-55 fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <motion.div
        transition={{ duration: 0.1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}  
        className={classNames(
          "bg-white border max-h-[80%] overflow-y-hidden block border-black",
          {
            "w-[80%] h-[80%]": isBigModal,
            "md:max-w-[70%] min-w-[100px] md:min-w-[300px] lg:min-w-[40%]":
              !isBigModal,
          }
        )}
      >
        <div
            className={classNames(
              "w-full p-2 pb-2 h-[32px] bg-[#f8f9fa] flex flex-row justify-between items-center border-b border-b-[#dee2e6]"
            )}
          >
            <span className="text-xs font-medium">{title}</span>
            <button className="w-4 h-4 hover:bg-gray-100" onClick={onClose}>
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

        <div className="w-full h-[calc(100%-32px)] overflow-y-auto">
          

          <div
            className={classNames({
              "p-2 h-full w-full": !isNoPadding,
              "h-[calc(100%-32px)] w-full": isNoPadding,
            })}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
