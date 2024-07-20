import EazyModal from "~/components/EazyModal";
import FilterRequests from "~/components/FilterRequests";
import Modal from "~/components/Modal";
import RequestOverviewEmbed from "~/embed/RequestOverview";
import RequestsTableEmbed from "~/embed/RequestsTable";
import SubNavbar from "~/components/SubNavbar";
import string from "~/localization/polyglot";
import { Moment } from "moment";
import { useState } from "react";

export default function DatahubRequests() {
  const [onAppendModal, setOnAppendModal] = useState(false);
  const [country, setCountry] = useState<string | undefined>();
  const [date, setDate] = useState<Moment | undefined>();
  const [modelOverviewData, setModelOverviewData] = useState<any | undefined>();

  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(24);

  const [filterKeys, setFilterKeys] = useState<string[]>([
    // "query",
    // "headers",
    "asn_description",
    // "request_id",
    "asn_number",
    "is_ua_bot",
    "asn_name",
    // "resource_id",
    "user_agent_client",
  ]);

  return (
    <>
      {modelOverviewData && (
        <Modal
          title="Overview request"
          isNoPadding
          isBigModal
          onClose={() => setModelOverviewData(undefined)}
        >
          <RequestOverviewEmbed requestBody={modelOverviewData} />
        </Modal>
      )}

      <EazyModal
        title="Filter"
        isVisible={onAppendModal}
        intent={setOnAppendModal}
      >
        <FilterRequests
          filterKeys={filterKeys}
          onChangeDate={setDate}
          onChangeCountry={setCountry}
          onSetFilterKeys={setFilterKeys}
          onSetSkip={setSkip}
          onSetLimit={setLimit}
          limit={limit}
          skip={skip}
        />
      </EazyModal>

      <SubNavbar
        title={string("dashboard.subtitle.requests")}
        createActionLabel="Filter"
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

      <div className="p-2 w-full overflow-x-auto">
        <RequestsTableEmbed
          date={date}
          country={country}
          filterKeys={filterKeys}
          skip={skip}
          limit={limit}
          onSelectedItem={(index, item) => {
            setModelOverviewData(item);
          }}
        />
      </div>
    </>
  );
}
