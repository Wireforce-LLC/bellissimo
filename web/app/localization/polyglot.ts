import _ from "lodash";

import en_US from "~/localization/en_US";

const POLYGLOT_LANGUAGE_KEY = "polyglot_language";
const POLYGLOT_DEFAULT_LANGUAGE = "en_US";
const POLYGLOT_SUPPORTED_LANGUAGES = ["en_US"];

function getCurrentSessionLanguage() {
  let windowLanguageData: string | undefined = undefined;
  let sessionLanguageData: string | null = null;

  if (typeof window != "undefined") {
    windowLanguageData = _.get(window, POLYGLOT_LANGUAGE_KEY);
  }

  if (typeof sessionStorage != "undefined") {
    sessionLanguageData = sessionStorage.getItem(POLYGLOT_LANGUAGE_KEY);
  }

  const language =
    windowLanguageData || sessionLanguageData || POLYGLOT_DEFAULT_LANGUAGE;

  if (POLYGLOT_SUPPORTED_LANGUAGES.includes(language)) {
    return language;
  }

  return POLYGLOT_DEFAULT_LANGUAGE;
}

const polyglotRegistry = {
  en_US,
};

export default function string(path: string, language = undefined) {
  return _.get(
    _.get(polyglotRegistry, language || getCurrentSessionLanguage()),
    path,
    path
  );
}
