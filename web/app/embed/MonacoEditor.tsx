import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  readonly onIntentSave: (content: string) => boolean;
  readonly onChangeContent?: (content: string) => void;
  readonly startContent?: string;
  readonly language?: string;
  readonly isHiddenRightBar?: boolean;
  readonly theme?: string;
}

export default function MonacoEditorEmbed({ theme, startContent,language, isHiddenRightBar, onIntentSave, onChangeContent }: Props) {
  const [content, setContent] = useState<string>(startContent || '');

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
        theme={theme || "vs"}
        options={{
          formatOnType: true,
          formatOnPaste: true,
          tabSize: 2,
          fontSize: 14,
          largeFileOptimizations: true,
          disableMonospaceOptimizations: true,
          minimap: {
            enabled: isHiddenRightBar ? false : true,
          },
          scrollBeyondLastLine: true,
          folding: true,
          lineNumbers: "on",
          automaticLayout: true,
          trimAutoWhitespace: true,
          wordBasedSuggestions: "allDocuments",
          "semanticHighlighting.enabled": true,
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
