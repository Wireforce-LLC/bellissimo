import Navbar, { NavbarModeEnum, PageIdEnum } from "~/components/Navbar";
import DashboardArea, { Menu, View } from "~/components/DashboardArea";
import DashboardMenuItem from "~/components/DashboardMenuItem";
import DashboardMenuHolder from "~/components/DashboardMenuHolder";
import string from "~/localization/polyglot";
import DashboardBasicWrapper from "~/components/DashboardBasicWrapper";
import { ReactNode, useCallback, useEffect, useState } from "react";
import getDatasetDashboardLeftBar from "~/dataset/DashboardLeftBar";
import webConfig, { ApiPathEnum } from "~/web.config";
import { Link } from "@remix-run/react";

function MenuElement(
  currentLeftActiveBarItem: LeftActiveBarItem | null | undefined
) {
  const [items, setItems] = useState<undefined | any[]>(getDatasetDashboardLeftBar(null));

  useEffect(() => {
    if (currentLeftActiveBarItem) {
      setItems(getDatasetDashboardLeftBar(currentLeftActiveBarItem));
    }
  }, [currentLeftActiveBarItem]);

  return (
    <DashboardMenuHolder>
      {items?.map((item) => (
        <DashboardMenuItem
          isActive={item.classname == currentLeftActiveBarItem}
          key={item.id}
          href={item.href}
          priority={item.priority}
          icon={item.icon}
          name={item.name}
        />
      ))}
    </DashboardMenuHolder>
  );
}

export enum LeftActiveBarItem {
  ROUTES = "routes",
  FILTERS = "filters",
  RESOURCES = "resources",
  ASN_RECORDS = "asn-records",

  // OLD
  THREADS = "threads",
  VISITORS = "visitors",
  EVENTS = "events",
  TRAFFIC = "traffic",
}

interface Props {
  readonly children: ReactNode;
  readonly isHideMenu?: boolean;
  readonly subTitle?: string;
  readonly currentLeftActiveBarItem?: LeftActiveBarItem | null;
}

export default function DashboardLayout({
  children,
  subTitle,
  isHideMenu,
  currentLeftActiveBarItem,
}: Props) {
  const [isInternetError, setInternetError] = useState(false)
  const [zoneId, setZoneId] = useState()

  const pingRequest = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then(data => {
      data.get(webConfig.apiEndpointFactory(ApiPathEnum.Ping)).catch(error => {

        if (error && error.response && error.response.status === 401) {
          location.href = "/login"
        } else {
          setInternetError(error.code === 'ERR_NETWORK')
        }
      })
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      pingRequest()
    }, 5000)

    pingRequest()

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ height: 'calc(100vh - 46px - 34px)' }}>
      <div className="w-full h-[34px] bg-black justify-end flex items-center">
        <div className="container mx-auto w-full justify-end flex items-center gap-4">
          <span className="-mt-1">
            <span className="text-gray-300 font-light text-xs">{string("const.zoneName")}: </span>
            <Link to="/dashboard/zone" className="text-white font-semibold text-xs border-b border-gray-50 border-dashed cursor-pointer">{1 || "select"}</Link>
          </span>

          <span className="-mt-1">
            <span className="text-gray-300 font-light text-xs">{string("const.userId")}: </span>
            <Link to="/dashboard/zone" className="text-white font-semibold text-xs border-b border-gray-50 border-dashed cursor-pointer">SW</Link>
          </span>
        </div>
      </div>

      <Navbar
        mode={NavbarModeEnum.IN_DASHBOARD}
        currentActivePageId={PageIdEnum.DASHBOARD}
      />

      {isInternetError && <div className="bottom-0 left-0 text-white z-50 px-3.5 py-2 text-xs right-0 absolute bg-red-600 font-medium">
        There are problems with your Internet connection.
      </div>}

      <DashboardBasicWrapper className="h-full">
        <DashboardArea
          menuEnabled={!isHideMenu}
          nested={[
            View({
              children: <div className="h-full w-full overflow-y-auto bg-gray-50 bg-opacity-50">
                <section className="">{children}</section>
              </div>
            }),
            isHideMenu !== true
              ? Menu({ children: MenuElement(currentLeftActiveBarItem) })
              : undefined,
          ]}
        />
      </DashboardBasicWrapper>
    </div>
  );
}
