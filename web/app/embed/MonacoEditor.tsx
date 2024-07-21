import createPhpSyntax, { createHighlightRules } from "~/syntax/php";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  readonly onIntentSave: (content: string) => boolean;
  readonly onChangeContent?: (content: string) => void;
  readonly startContent?: string;
  readonly language?: string;
  readonly isHiddenRightBar?: boolean;
}

export default function MonacoEditorEmbed({ startContent,language, isHiddenRightBar, onIntentSave, onChangeContent }: Props) {
  const [content, setContent] = useState<string>(startContent || '');

  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) {
      return;
    }

    createHighlightRules(monaco!!);

    monaco?.languages.registerSignatureHelpProvider('php-snippet', {
      signatureHelpTriggerCharacters: ["(", ","],
      //@ts-ignore
      provideSignatureHelp: async (model, position, token, context) => {
          //@ts-ignore
          let signatureHelp= {
              signatures: [
                  {
                      label: 'test',
                      documentation: "ooooo",
                      parameters: [{ label: 'par1', documentation: 'ppp' }]
                  }
              ],
              activeParameter: 0,
              activeSignature: 0
          };

          return { value: signatureHelp };
      }
  });

    monaco?.languages.registerCompletionItemProvider('php-snippet', {
      
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

  const keydownHandler = (e: KeyboardEvent) => {
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onIntentSave(content);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, [content]);

  useEffect(() => {
    setContent(startContent || '');
  }, [startContent]);

  const editorRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="overflow-hidden w-full h-full" ref={editorRef}>
      <Editor
        width={editorRef.current?.clientWidth}
        height={editorRef.current?.clientHeight}
        // defaultLanguage="html"
        language={language}
        value={content}
        theme="vs"
        options={{
          formatOnType: true,
          formatOnPaste: true,
          tabSize: 2,
          fontSize: 14,
          minimap: {
            enabled: isHiddenRightBar ? false : true,
          },
          scrollBeyondLastLine: true,
          folding: true,
          lineNumbers: "on",
          automaticLayout: true,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
            horizontal: "hidden",
          },
          renderLineHighlight: "all",
          autoIndent: "full",
        }}
        onChange={(text) => {
          onChangeContent?.(String(text))
          
          //   if (!cursorOnFile) {
          //     return;
          //   }

          //   if (!text) {
          //     return;
          //   }

          //   setSafeOut(false);

          setContent(String(text));
        }}
      />
    </div>
  );
}
