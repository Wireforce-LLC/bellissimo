import { PageIdEnum } from "~/components/Navbar";
import string from "~/localization/polyglot";

export default function getDatasetNavbar(
  currentActivePageId: PageIdEnum | null
) {
  return [
    // {
    //   name: string("navbar.dashboard"),
    //   href: "/dashboard",
    //   isActive: currentActivePageId == PageIdEnum.DASHBOARD,
    // },
    // {
    //   name: string("navbar.pipelines"),
    //   href: "/pipelines",
    //   isActive: currentActivePageId == PageIdEnum.PIPELINES,
    // },
    // {
    //   name: string("navbar.cloudObject"),
    //   href: "/cloudObject",
    //   isActive: currentActivePageId == PageIdEnum.CLOUD_OBJECT,
    // },
  ];
}
