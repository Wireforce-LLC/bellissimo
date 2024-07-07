import DocsLayout from "~/layouts/DocsLayout";
import { Link, useLoaderData, useLocation, useParams } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import fs from "node:fs";
import path from "node:path";
import * as runtime from "react/jsx-runtime";
import Markdown from "markdown-to-jsx";
import { Highlight, themes } from "prism-react-renderer"
import { useEffect } from "react";
import Prism from "prismjs";

export async function loader({ request }: LoaderFunctionArgs) {
  // parse the search params for `?q=`
  const url = new URL(request.url);
  const postId = url.searchParams.get("id");
  const uri = path.resolve(".") + "/app/routes/docs/" + postId + ".md";

  if (!fs.existsSync(uri)) {
    throw new Response("Not found", { status: 404 });
  }

  const content = fs.readFileSync(uri).toString("utf-8");

  return json({ markdown: content });
}

export default function Docs() {
  const loaderData = useLoaderData<typeof loader>();

  useEffect(() => {
    (typeof global !== "undefined" ? global : window).Prism = Prism
    
  }, [])

  return (
    <DocsLayout>
      <Markdown
        options={{
          overrides: {
            h1: {
              component: ({ children, ...props }) => (
                <h1 {...props}>{children}</h1>
              ),
              props: {
                className: "text-xl font-medium",
              },
            },
            h2: {
                component: ({ children, ...props }) => (
                  <h2 {...props}>{children}</h2>
                ),
                props: {
                  className: "text-md font-medium",
                },
              },
            p: {
              component: ({ children, ...props }) => (
                <p {...props}>{children}</p>
              ),
              props: {
                className: "text-[11px] leading-[13px] text-zinc-500 mb-2",
              },
            },
            a: {
                component: ({ children, ...props }) => (
                  <Link className="text-[#3078b4] hover:underline" to={props.href} prefetch="intent">{children}</Link>
                ),
                props: {
                  className: "underline text-blue-500",
                },
            },
            ul: {
                component: ({ children, ...props }) => (
                  <ul {...props}>{children}</ul>
                ),
                props: {
                  className: "text-[11px]",
                },
            },
            code: {
                component: ({ children, ...props }) => (
                    <Highlight
                    theme={themes.oneLight}
                    code={String(children)}
                    language="js"
                  >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre >
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })} className="w-full flex flex-row space-x-2 bg-transparent">
            <div className="w-[24px] flex-shrink-0 border-r border-r-gray-200">{i + 1}</div>
            <span className="w-full whitespace-pre-line">
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
            </span>
          </div>
        ))}
      </pre>
    )}
                    </Highlight>
                ),
            },
            pre: {
                component: ({ children, ...props }) => (
                  <pre {...props}>{children}</pre>

    //                 <Highlight
    //                 theme={themes.oneLight}
    //                 code={String(children)}
    //                 language="tsx"
    //               >
    //                 {({ className, style, tokens, getLineProps, getTokenProps }) => (
    //   <pre style={style}>
    //     {tokens.map((line, i) => (
    //       <div key={i} {...getLineProps({ line })}>
    //         <span>{i + 1}</span>
    //         {line.map((token, key) => (
    //           <span key={key} {...getTokenProps({ token })} />
    //         ))}
    //       </div>
    //     ))}
    //   </pre>
    // )}
    //                 </Highlight>
                        
                   
    //               <SyntaxHighlighter {...props} language="javascript" style={docco}>
    //   {children}
    // </SyntaxHighlighter>
                ),
                props: {
                  className: "text-[10px] mb-2 bg-zinc-100 bg-opacity-50 border border-gray-200 px-2 py-2 rounded-md w-full",
                },
              },
          },
        }}
      >
        {String(loaderData.markdown)}
      </Markdown>
    </DocsLayout>
  );
}
