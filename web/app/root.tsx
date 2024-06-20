import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import _ from "lodash";
import { ReactNode } from "react";
import Navbar, { PageIdEnum } from "~/components/Navbar";
import stylesheet from "~/tailwind.css?url";
import { Toaster } from "react-hot-toast";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark-off">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Meta />
        <Links />
      </head>
      <body>
        <main>{children}</main>
        <div>
          <Toaster
            toastOptions={{
              className: "",
              style: {
                fontSize: 12,
                border: "1px solid #e6e6e6",
                padding: "4px 16px",
                color: "white",
                borderRadius: 0,
              },
            }}
            position="bottom-right"
            reverseOrder={false}
          />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// export function ErrorBoundary() {
//   const error = useRouteError();
//   console.error(error);
//   return (
//     <html lang="en-US">
//       <head>
//         <title>Oh no!</title>
//         <Meta />
//         <Links />
//       </head>
//       <body className="h-screen">
//         <Navbar currentActivePageId={PageIdEnum.DASHBOARD} />

//         <main className="flex flex-col items-center justify-center py-12">
//           <div className="flex flex-col items-center justify-center bg-rose-50 w-fit py-6 px-12 rounded">
//             <div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//                 className="w-8 h-8 fill-amber-400"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-amber-700">
//               {_.get(error, "statusText")}
//             </h3>
//             <p className="text-sm font-light text-gray-600">
//               {_.get(error, "data")}
//             </p>
//           </div>
//         </main>
//         <Scripts />
//       </body>
//     </html>
//   );
// }
