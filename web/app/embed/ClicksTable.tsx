import humanizeString from "humanize-string";
import _ from "lodash";
import { useState, useEffect, useCallback, useMemo } from "react";
import BigInput from "~/components/BigInput";
import EazyModal from "~/components/EazyModal";
import Modal from "~/components/Modal";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Props {}

export default function ClicksTableEmbed({}: Props) {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isShowModalWithSource, setIsShowModalWithSource] = useState(false);

  const [code] = useState(`<script>"use strict";var x=0,y=0;function r(n){var e=new XMLHttpRequest;e.open("GET","/click?name="+encodeURI(n)+"&cursor_x="+x+"&cursor_y="+y+"&time="+Date.now()),e.send()}document.addEventListener("DOMContentLoaded",function(){document.onmousemove=function(n){x=n.clientX,y=n.clientY,console.log({x:x,y:y})}});</script>`)

  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllClicks)).then(
        (res) => {
          if (_.isArray(res.data.value)) {
            setData(res.data.value);
          }
        }
      );
    });
  }, []);

  const tableHeaders = useMemo(() => {
    return (
      data &&
      (!_.isEmpty(data)
        ? _.keys(_.first(data)).map((i) => humanizeString(i))
        : [])
    );
  }, [data]);

  return (
    <div>
      <EazyModal isVisible={isShowModalWithSource} title="Source code" intent={setIsShowModalWithSource}>
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

      <div className="w-full flex flex-col justify-center items-start px-4 pt-2 pb-2.5 bg-white border-b border-b-gray-200">
        <h2 className="text-sm font-bold">
          Add this code
        </h2>

        <p className="text-xs">
          To start recording clicks on a page, use one simple code that will work on absolutely any host, on any path. 
          {" "}<a href="#" onClick={() => setIsShowModalWithSource(true)} className="text-blue-500">Click to open code window</a>
        </p>

        {/*
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
        )} */}
      </div>

      <Table headers={tableHeaders} data={data} />
    </div>
  );
}
