import { useState } from "react";
import BigInput from "~/components/BigInput";
import EazyModal from "~/components/EazyModal";
import SubNavbar from "~/components/SubNavbar";
import Tabs from "~/components/Tabs";
import ClicksMapTableEmbed from "~/embed/ClicksMapTable";
import ClicksTableEmbed from "~/embed/ClicksTable";
import RequestsTableEmbed from "~/embed/RequestsTable";
import string from "~/localization/polyglot";

export default function DatahubClicks() {
  const [onAppendModal, setOnAppendModal] = useState(false);
  const [code] = useState(`<script src="/ga.js"></script>`);
  
  return (
    <div className="w-full h-full">
      <EazyModal
        title="How to send clicks"
        isVisible={onAppendModal}
        intent={setOnAppendModal}
      >
        <BigInput
          value={code}
          label="Copy and paste this code into your HTML"
          isDisabled
          isRequired
        />

        <BigInput
          value={`<button onClick="r('Event name')">Click on me!</button>`}
          label="Usage"
          isDisabled
          isRequired
        />
      </EazyModal>

      <SubNavbar
        title={string("dashboard.subtitle.clicks")}
        createActionLabel="How to send clicks"
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
      
      <Tabs isFullSize isDisablePaddings isDisableBorders titles={["Map", "Table"]}>
        <ClicksMapTableEmbed />
        <ClicksMapTableEmbed />
      </Tabs>
    </div>
  );
}
