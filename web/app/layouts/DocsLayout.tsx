import Navbar from "~/components/Navbar";
import fs from 'fs';
import { ReactNode, useCallback, useEffect, useState } from "react";
import getDatasetDashboardLeftBar from "~/dataset/DashboardLeftBar";
import webConfig, { ApiPathEnum } from "~/web.config";

import wireforceLogo from "/wireforce-logo.png";
import rightTopImage from "/top-right-01.png";
import classNames from "classnames";
import { motion } from "framer-motion";

interface Props {
  readonly children: ReactNode;
  readonly title?: string;
}

export default function DocsLayout({
  children,
  title
}: Props) {
  return (
    <main className="w-full h-full bg-white flex flex-col overflow-hidden">
      <h1 className="font-semibold text-3xl">{title}</h1>
      <div className="w-full transition-all h-full bg-white overflow-y-auto">
        {children}
      </div>
    </main>
  );
}
