import { useState } from "react";
import EazyModal from "~/components/EazyModal";
import SubNavbar from "~/components/SubNavbar";
import Tabs from "~/components/Tabs";
import ClicksTableEmbed from "~/embed/ClicksTable";
import PostbackTableEmbed from "~/embed/PostbacksTable";
import RequestsTableEmbed from "~/embed/RequestsTable";
import string from "~/localization/polyglot";

export default function DatahubPostbacks() {
  const [onAppendModal, setOnAppendModal] = useState(false);

  return (
    <>
      <EazyModal
        title="How to send postbacks"
        isVisible={onAppendModal}
        intent={setOnAppendModal}
      >
        <h2 className="text-sm font-bold">
          How to send postbacks{" "}
          <span className="text-gray-400">(webhooks)</span>?
        </h2>
        <p className="text-xs font-normal text-gray-500">
          Sending postbacks is very easy. Set up a posbek link in your affiliate
          program as follows:
        </p>

        {typeof window !== "undefined" && (
          <p className="text-xs font-normal text-blue-500 block mt-2">
            {window.location.protocol}//{window.location.hostname}
            /service/postback?
            {`uuid={uuid}&date={date}&status={status}&ip={ip}&amount={amount}&stream={stream}&currency={currency}&time={time}`}
          </p>
        )}
      </EazyModal>

      <SubNavbar
        title={string("dashboard.subtitle.postbacks")}
        createActionLabel="Register a postback"
        createActionIcon={
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1em"
            width="1em"
            className="size-3"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
          </svg>
        }
        onCreateAction={() => {
          setOnAppendModal(true);
        }}
      />

      <PostbackTableEmbed />
    </>
  );
}
