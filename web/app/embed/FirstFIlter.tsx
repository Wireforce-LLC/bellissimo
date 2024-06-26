import { useState } from "react";
import { FilterRow } from "./BuildFilter";

interface Props {
  readonly onSubmit: (submit: FilterRow[]) => void;
}

interface CardProps {
  readonly name: string;
  readonly description: string;
  readonly value: any;
}

function ExampleCards({ name, description, value }: CardProps) {
  return (
    <div className="border border-gray-200 px-4 pb-3 py-2 hover:border-black cursor-pointer ">
      <h4 className="text-md font-semibold">{name}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

const DEFAULT_SCHEMA = [
  {
    name: "UserAgent Bot",
    value: "",
    operator: "==",
    plugin: "ua::bot",
    resourceId: "",
  },
  {
    name: "Request Guard",
    value: "",
    operator: "!=",
    plugin: "request_guard",
    resourceId: "",
  }
];

const SCHEMAS = [
  {
    name: "Facebook",
    description: "Preventing Facebook traffic from reaching your resources",
    value: [
      ...DEFAULT_SCHEMA,
      {
        name: "Facebook",
        value: "facebook",
        operator: "in",
        plugin: "asn::groups",
        resourceId: "",
      },
    ],
  },

  {
    name: "Google",
    description: "Preventing Google traffic from reaching your resources",
    value: [
      ...DEFAULT_SCHEMA,
      {
        name: "Google",
        value: "google",
        operator: "in",
        plugin: "asn::groups",
        resourceId: "",
      },
    ],
  },

  {
    name: "Amazon",
    description: "Preventing Amazon traffic from reaching your resources",
    value: [
      ...DEFAULT_SCHEMA,
      {
        name: "Amazon",
        value: "amazon",
        operator: "in",
        plugin: "asn::groups",
        resourceId: "",
      },
      {
        name: "Amazon (contains)",
        value: "amazon",
        operator: "~",
        plugin: "asn::owner",
        resourceId: "",
      },
      {
        name: "Amazon (contains 2)",
        value: "amaz",
        operator: "~",
        plugin: "asn::owner",
        resourceId: "",
      },
    ],
  },

  {
    name: "Twitter",
    description: "Preventing Twitter traffic from reaching your resources",
    value: [
      ...DEFAULT_SCHEMA,
      {
        name: "Twitter",
        value: "twitter",
        operator: "in",
        plugin: "asn::groups",
        resourceId: "",
      },
    ],
  },

  {
    name: "Tor Traffic",
    description: "Preventing Tor traffic from reaching your resources",
    value: [
      ...DEFAULT_SCHEMA,
      {
        name: "Tor",
        value: "",
        operator: "==",
        plugin: "traffic::tor",
        resourceId: "",
      },
    ],
  },

  {
    name: "Wireforce Protect",
    description: "Complex filtering traffic by Wireforce Protect",
    value: [
      ...DEFAULT_SCHEMA,
      {
        name: "Tor",
        value: "",
        operator: "==",
        plugin: "traffic::tor",
        resourceId: "",
      },
      {
        name: "Facebook",
        value: "facebook",
        operator: "in",
        plugin: "asn::groups",
        resourceId: "",
      },
      {
        name: "Google",
        value: "google",
        operator: "in",
        plugin: "asn::groups",
        resourceId: "",
      },
      {
        name: "Amazon",
        value: "amazon",
        operator: "in",
        plugin: "asn::groups",
        resourceId: "",
      },
      {
        name: "Amazon (contains)",
        value: "amazon",
        operator: "~",
        plugin: "asn::owner",
        resourceId: "",
      },
      {
        name: "Amazon (contains 2)",
        value: "amaz",
        operator: "~",
        plugin: "asn::owner",
        resourceId: "",
      },
      
      {
        name: "Microsoft",
        value: "microsoft",
        operator: "~",
        plugin: "asn::owner",
        resourceId: "",
      },

      {
        name: "Microsoft (owner)",
        value: "microsoft",
        operator: "in",
        plugin: "asn::groups",
        resourceId: "",
      },
    ],
  }
];

export default function FirstFilterEmbed({ onSubmit }: Props) {
  const [rows] =
    useState<{ name: string; description: string; value: FilterRow[] }[]>(
      SCHEMAS
    );

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 justify-between items-top gap-2">
        {rows.map((row) => (
          <div onClick={() => onSubmit(row.value)}>
            <ExampleCards
              name={row.name}
              description={row.description}
              value={row.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
