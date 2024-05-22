import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import string from "~/localization/polyglot";


export default function BlackBar() {
  const [zoneId, setZoneId] = useState()


  return (
    <div className="w-full h-[34px] bg-black justify-end flex items-center">
      <div className="container mx-auto w-full justify-end flex items-center gap-4">
        <span className="-mt-1">
          <span className="text-gray-300 font-light text-xs">{string("const.zoneName")}: </span>
          <Link to="/dashboard/zone" className="text-white font-semibold text-xs border-b border-gray-50 border-dashed cursor-pointer">{0 || "select"}</Link>
        </span>

        <span className="-mt-1">
          <span className="text-gray-300 font-light text-xs">{string("const.userId")}: </span>
          <Link to="/dashboard/zone" className="text-white font-semibold text-xs border-b border-gray-50 border-dashed cursor-pointer">SW</Link>
        </span>
      </div>
    </div>
  )
}
