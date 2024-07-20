import stylesheet from "~/tailwind.css?url";
import type { LinksFunction } from "@remix-run/node";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

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
                padding: "8px 16px",
                color: "black",
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