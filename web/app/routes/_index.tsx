import AdsManager from "~/fragments/ads_manager";
import DashboardLayout from "~/layouts/DashboardLayout";
import DatahubDatasets from "~/fragments/datahub_datasets";
import DatahubExplorer from "~/fragments/datahub_explorer";
import DatahubRequests from "~/fragments/datahub_requests";
import Files from "../fragments/files";
import Filters from "../fragments/filters";
import RemoteFunctions from "~/fragments/functions";
import Resources from "../fragments/resources";
import Routes from "../fragments/routes";
import Widgets from "~/fragments/widgets";
import _ from "lodash";
import createPhpSyntax, { createHighlightRules } from "~/syntax/php";
import themeMonaco from "monaco-themes/themes/GitHub Light.json";
import { useMonaco } from "@monaco-editor/react";
import { type MetaFunction } from "@remix-run/node";
import { ReactNode, Suspense, useCallback, useEffect, useMemo, useState } from "react";

export const meta: MetaFunction = () => {;

  return [
    { title: "Bellissimo" },
    {
      name: "description",
      content: "Fa una zuppa meravigliosa!",
    },
  ];
};

export default function Dashboard() {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) {
      return;
    }

    createHighlightRules(monaco!!);

    // like GitHub light theme
    monaco?.editor?.defineTheme("bellissimo", {
      base: "vs",
      inherit: true,
      rules: [...themeMonaco?.rules, 
        {
          "foreground": "005cc5",
          "token": "variable.other.constant",
          "fontStyle": "bold"
        },
        {
          "foreground": "005cc5",
          "token": "variable.language",
          "fontStyle": "bold"
        },
        { token: 'class-method', foreground: '008080', fontStyle: 'bold' },
        { token: 'class-name', foreground: '0000FF', fontStyle: 'bold' },
      ],
      colors: themeMonaco?.colors
    });

    monaco?.languages.registerCompletionItemProvider('php', {
      
      provideCompletionItems(model, position, context, token) {
        // find out if we are completing a property in the 'dependencies' object.
        var word = model.getWordUntilPosition(position);

        var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
        };

        return {
            suggestions: createPhpSyntax(monaco, range)
        };
      },
      // provideCompletionItems: (model, position) => {
      //   return [
      //     {
      //       label: 'substr',
      //       kind: monaco.languages.CompletionItemKind.Function,
      //       documentation: "Finds a substring of a string.",
      //       detail: 'string'
      //     }
      //   ];
      // }
    });

  }, [monaco]);

  
  // const [route, setRoute] = useState("/routes")
  const [currentPath, setCurrentPathValue] = useState(
    () => {
      if (typeof window !== "undefined") {
        let value = window.location.hash.replace("#", '');

        if (_.isEmpty(value)) {
          return null;
        } else {
          return value;
        }
      } else {
        undefined
      }
    }
  );

  const setCurrentPath = useCallback((value: string|null) => {
    setCurrentPathValue(value);
    if (value != null) {
      location.hash = `#${value}`;
    } else {
      location.hash = `#`;
    }
  }, []);


  const registry: { [key: string]: ReactNode } = useMemo(() => {
    return {
      "/routes": <Routes/>,
      "/files": <Files/>,
      "/filters": <Filters/>,
      "/resources": <Resources/>,
      "/functions": <RemoteFunctions/>,
      "/adsmanager": <AdsManager/>,
      "/datahub/explorer": <DatahubExplorer/>,
      "/datahub/requests": <DatahubRequests/>,
      "/datahub/datasets": <DatahubDatasets/>,
      "/widgets": <Widgets/>
    }
  }, []);

  const fragment = useMemo(() => {
    if (currentPath === null) {
      return registry["/routes"];
    }

    if (currentPath === undefined) {
      return undefined;
    }

    return registry[currentPath] || undefined;
  }, [currentPath]);

  return (
    <DashboardLayout currentPath={currentPath || undefined} onMenuSelected={setCurrentPath}>
      <Suspense>
        {fragment}
      </Suspense>
    </DashboardLayout>
  );
}
