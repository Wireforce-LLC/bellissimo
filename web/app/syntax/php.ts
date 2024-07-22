import { Monaco } from "@monaco-editor/react";

export function createHighlightRules(monaco: Monaco) {
    const languageId = 'php-snippet'

    monaco.languages.register({id: languageId})

    monaco.languages.setLanguageConfiguration(languageId, {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },

    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],

    autoClosingPairs: [
      {open: '{', close: '}', notIn: ['string']},
      {open: '[', close: ']', notIn: ['string']},
      {open: '(', close: ')', notIn: ['string']},
      {open: '"', close: '"', notIn: ['string']},
      {open: "'", close: "'", notIn: ['string', 'comment']},
    ],

    folding: {
      markers: {
        start: new RegExp('^\\s*(#|//)region\\b'),
        end: new RegExp('^\\s*(#|//)endregion\\b'),
      },
    },
  })

  monaco.languages.setMonarchTokensProvider(languageId, {
    defaultToken: '',
    tokenPostfix: '',

    tokenizer: {
      root: [
        // Keywords
        [/\b(abstract|class|function|public|protected|private|static|if|else|return|new|var|let|const|null|true|false|import|export)\b/, 'keyword'],
        [/\b(TelegramBot|FCM|FacebookCAPI)\b/, 'class-name'],
        // Numbers
        [/\b(\d+)\b/, 'number'],
        // Strings
        [/".*?"/, 'string'],
        // Identifiers
        [/\b(\w+::\w+)\b/, 'class-method'],  // Для FCM::sendNotification
        [/\b([A-Za-z_$][\w$]*)\b/, 'identifier'],
        // PHP tags
        [/<\?php/, 'keyword'],
        [/\?>/, 'keyword'],
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*[\s\S]*?\*\//, 'comment']

  ],

      phpComment: [
        [/\*\//, 'comment.php', '@pop'],
        [/[^*]+/, 'comment.php'],
        [/./, 'comment.php'],
      ],

      phpLineComment: [
        [/\?>/, {token: '@rematch', next: '@pop'}],
        [/.$/, 'comment.php', '@pop'],
        [/[^?]+$/, 'comment.php', '@pop'],
        [/[^?]+/, 'comment.php'],
        [/./, 'comment.php'],
      ],

      phpDoubleQuoteString: [
        [/[^\\"]+/, 'string.php'],
        [/@escapes/, 'string.escape.php'],
        [/\\./, 'string.escape.invalid.php'],
        [/"/, 'string.php', '@pop'],
      ],

      phpSingleQuoteString: [
        [/[^\\']+/, 'string.php'],
        [/@escapes/, 'string.escape.php'],
        [/\\./, 'string.escape.invalid.php'],
        [/'/, 'string.php', '@pop'],
      ],
    },

    phpKeywords: [
      'abstract',
      'and',
      'array',
      'as',
      'break',
      'callable',
      'case',
      'catch',
      'cfunction',
      'class',
      'clone',
      'const',
      'continue',
      'declare',
      'default',
      'do',
      'else',
      'elseif',
      'enddeclare',
      'endfor',
      'endforeach',
      'endif',
      'endswitch',
      'endwhile',
      'extends',
      'false',
      'final',
      'for',
      'foreach',
      'function',
      'global',
      'goto',
      'if',
      'implements',
      'interface',
      'instanceof',
      'insteadof',
      'namespace',
      'new',
      'null',
      'object',
      'old_function',
      'or',
      'private',
      'protected',
      'public',
      'resource',
      'static',
      'switch',
      'throw',
      'trait',
      'try',
      'true',
      'use',
      'var',
      'while',
      'xor',
      'die',
      'echo',
      'empty',
      'exit',
      'eval',
      'include',
      'include_once',
      'isset',
      'list',
      'require',
      'require_once',
      'return',
      'print',
      'unset',
      'yield',
      '__construct',
    ],

    phpCompileTimeConstants: [
      '__CLASS__',
      '__DIR__',
      '__FILE__',
      '__LINE__',
      '__NAMESPACE__',
      '__METHOD__',
      '__FUNCTION__',
      '__TRAIT__',
    ],

    phpPreDefinedVariables: [
      '$GLOBALS',
      '$_SERVER',
      '$_GET',
      '$_POST',
      '$_FILES',
      '$_REQUEST',
      '$_SESSION',
      '$_ENV',
      '$_COOKIE',
      '$php_errormsg',
      '$HTTP_RAW_POST_DATA',
      '$http_response_header',
      '$argc',
      '$argv',
    ],

    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  })
}

export default function createPhpSyntax(monaco: Monaco, range: any) {
  return [

//    {
//     label: '"ddd"',
//     kind: monaco.languages.CompletionItemKind.Function,
//     documentation: "Describe your library here",
//     insertText: '"${1:my-third-party-library}": "${2:1.2.3}"',
//     insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
//     range: range
//    },
    {
        label: 'substr',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Finds a substring of a string.",
        detail: 'string',
        insertText: 'substr(${1:}, ${2:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'strlen',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Returns the length of a string.",
        detail: 'string',
        insertText: 'strlen(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'trim',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Removes whitespace (or other characters) from the beginning and end of a string.",
        detail: 'string',
        insertText: 'trim(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'strtolower',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Converts a string to lowercase.",
        detail: 'string',
        insertText: 'strtolower(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'strtoupper',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Converts a string to uppercase.",
        detail: 'string',
        insertText: 'strtoupper(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'json_encode',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Encodes a value into JSON.",
        detail: 'string',
        insertText: 'json_encode(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'json_decode',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Decodes a value from JSON.",
        detail: 'string',
        insertText: 'json_decode(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'json_last_error_msg',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Returns the last error message.",
        detail: 'string',
        insertText: 'json_last_error_msg()',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'json_last_error',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Returns the last error code.",
        detail: 'string',
        insertText: 'json_last_error()',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'file_get_contents',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Returns the contents of a file.",
        detail: 'string',
        insertText: 'file_get_contents(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'file_put_contents',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Writes a string to a file.",
        detail: 'string',
        insertText: 'file_put_contents(${1:}, ${2:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'fopen',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Opens a file.",
        detail: 'string',
        insertText: 'fopen(${1:}, ${2:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'fclose',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Closes a file.",
        detail: 'string',
        insertText: 'fclose(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'fclose',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Closes a file.",
        detail: 'string',
        insertText: 'fclose(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },  

    {
        label: 'fread',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Reads from a file.",
        detail: 'string',
        insertText: 'fread(${1:}, ${2:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'fwrite',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Writes to a file.",
        detail: 'string',
        insertText: 'fwrite(${1:}, ${2:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'include',
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Includes a file.",
        detail: 'string',
        insertText: 'include "${1:}";',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'include_once',
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Includes a file once.",
        detail: 'string',
        insertText: 'include_once "${1:}";',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'require',
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Requires a file.",
        detail: 'string',
        insertText: 'require "${1:}";',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'require_once',
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Requires a file once.",
        detail: 'string',
        insertText: 'require_once "${1:}";',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'define',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Defines a constant.",
        detail: 'string',
        insertText: 'define("${1:}", ${2:});',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'defined',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Checks if a constant is defined.",
        detail: 'string',
        insertText: 'defined("${1:}")',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'unset',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Unsets a variable.",
        detail: 'string',
        insertText: 'unset(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'exit',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Exits the script.",
        detail: 'string',
        insertText: 'exit(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'die',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Exits the script.",
        detail: 'string',
        insertText: 'die(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'print',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Prints something.",
        detail: 'string',
        insertText: 'print(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },  

    {
        label: 'echo',
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Prints something.",
        detail: 'string',
        insertText: 'echo ${1:};',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: 'include "@kit";',
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Includes a Bellissimo PHP kit.",
        detail: 'string',
        insertText: 'include_once "../../containers/PHP/Kit.php";',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "class",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Create base PHP class.",
        detail: 'class',
        insertText: 'class ${1:} {\n\t\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "extends",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Extends a class.",
        detail: 'extends',
        insertText: 'extends ${1:}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "implements",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Implements an interface.",
        detail: 'implements',
        insertText: 'implements ${1:}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "trait",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Create base PHP trait.",
        detail: 'trait',
        insertText: 'trait ${1:} {\n\t\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "enum",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Create base PHP enum.",
        detail: 'enum',
        insertText: 'enum ${1:} {\n\t\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },  

    {
        label: "namespace",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Create base PHP namespace.",
        detail: 'namespace',
        insertText: 'namespace ${1:} {\n\t\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "function",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Create base PHP function.",
        detail: 'function',
        insertText: 'function ${1:}(${2:}) {\n\t\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "const",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Create base PHP const.",
        detail: 'const',
        insertText: 'const ${1:} = ${2:}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "return",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Return a value.",
        detail: 'return',
        insertText: 'return ${1:}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "yield",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Yield a value.",
        detail: 'yield',
        insertText: 'yield ${1:}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "TelegramBot::sendMessage()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Send message to user into Telegram chat.",
        detail: 'TelegramBot::sendMessage',
        insertText: 'TelegramBot::sendMessage(chat_id: ${1:}, message: "${2:}");',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "TelegramBot::sendPhoto()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Send photo to user into Telegram chat.",
        detail: 'TelegramBot::sendPhoto',
        insertText: 'TelegramBot::sendPhoto(chat_id: ${1:}, photo: "${2:}");',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "TelegramBot::sendDocument()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Send document to user into Telegram chat.",
        detail: 'TelegramBot::sendDocument',
        insertText: 'TelegramBot::sendDocument(chat_id: ${1:}, document: "${2:}");',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },  

    {
        label: "TelegramBot::setToken()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Set token for bot.",
        detail: 'TelegramBot::setToken',
        insertText: 'TelegramBot::setToken(token: "${1:}");',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "TelegramBot::setWebhook()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Set webhook for bot.",
        detail: 'TelegramBot::setWebhook',
        insertText: 'TelegramBot::setWebhook(url: "${1:}");',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },
    {
        label: "TelegramBot::getWebhookInfo()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Get webhook info for bot.",
        detail: 'TelegramBot::getWebhookInfo',
        insertText: 'TelegramBot::getWebhookInfo();',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "TelegramBot::getMe()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Get information about bot.",
        detail: 'TelegramBot::getMe',
        insertText: 'TelegramBot::getMe();',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "Aggregate::mergeSelfRequests()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Merge self requests.",
        detail: 'Array',
        insertText: 'Aggregate::mergeSelfRequests(attr_window: ${1:}, key: "headers");',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "FacebookCAPI::trackEventLite()",
        kind: monaco.languages.CompletionItemKind.Method,
        documentation: "Track event.",
        detail: 'FacebookCAPI::trackEventLite',
        insertText:  '// Track event in facebook ad api' + "\n" +
        'FacebookCAPI::trackEventLite(' + "\n" +
        '    fbcid: "${1:}",' + "\n" +
        '    ua: "${2:}",' + "\n" +
        '    dataset: "${3:}",' + "\n" +
        '    access_token: "${4:}",' + "\n" +
        '    event_name: "${5:}",' + "\n" +
        '    data: ${6:}' + "\n" +
        ');',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "Playground::call()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Call payload function.",
        detail: '',
        insertText:  '// Call payload function' + "\n" +
        'Playground::call(' + "\n" +
        '    function_name: "${1:}",' + "\n" +
        '    argv: []' + "\n" +
        ');',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "FCM::sendNotification()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Send notification.",
        detail: 'sendNotification',
        insertText: '// Send notification via FCM' + "\n" +
        'FCM::sendNotification(' + "\n" +
        '    to: "${1:}",' + "\n" +
        '    token: "${2:}",' + "\n" +
        '    message: "${3:}",' + "\n" +
        '    title: "${4:}"' + "\n" +
        ');',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    // Aggregate::explore($database, $collection, $pipeline) 

    {
        label: "Aggregate::explore()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Explore database.",
        detail: 'explore',
        insertText: '// Explore database' + "\n" +
        'Aggregate::explore(' + "\n" +
        '    database: "${1:}",' + "\n" +
        '    collection: "${2:}",' + "\n" +
        '    pipeline: [${3:}]' + "\n" +
        ');',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    // Dataset::getDatasets(): array,
    // Dataset::writeDataset(string $datasetName, object $data)

    {
        label: "Dataset::getDatasets()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Get datasets from Playground API",
        detail: 'getDatasets',
        insertText: 'Dataset::getDatasets();',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "Dataset::writeDataset()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Write dataset to Playground API",
        detail: 'writeDataset',
        insertText: 'Dataset::writeDataset(dataset_name: "${1:}", data: (object) [${2:}]);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "array_map()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Map array",
        detail: 'array_map',
        insertText: 'array_map(callback: function(...) {${1:}}, array: (array) [${2:}]);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

    {
        label: "RemoteFunction::call()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Call remote function",
        detail: 'call',
        insertText: 'RemoteFunction::call(function_name: "${1:}", argv: (object) [${2:}]);',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    },

  //   foreach ($arr as &$value) {
  //     $value = $value * 2;
  // }

    {
        label: "foreach()",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Map array",
        detail: 'foreach',
        insertText: 'foreach((array) [${1:}] as $key => $value) {${2:}}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    }
  ]
}