import { redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import _ from "lodash";
import SuccessActivity from "~/components/SuccessActivity";
import LoadingActivity from "~/components/LoadingActivity";
import GrayWrapper from "~/components/GrayWrapper";

export const meta: MetaFunction = () => {
  return [
    { title: "Paper. Dashboard" },
    {
      name: "description",
      content: "Welcome to Paper Analytics! This is your dashboard",
    },
  ];
};

export default function Dashboard() {
  return (
    <DashboardLayout currentLeftActiveBarItem={LeftActiveBarItem.THREADS}>
      <GrayWrapper className="py-12">
        <LoadingActivity text="Redirecting" />
      </GrayWrapper>
    </DashboardLayout>
  );
}
