import _ from "lodash";
import { useCallback, useState } from "react";
import Button from "~/components/Button";
import ErrorString from "~/components/ErrorString";
import Input from "~/components/Input";
import Select from "~/components/Select";

export interface Submit {
  readonly title: string;
  readonly campaignId: string;
  readonly targetClick: string;
  readonly operator: number;
}

interface Props {
  readonly onSubmit: (it: Submit) => void;
}

export default function CreateCampaignEmbed({ onSubmit } : Props) {
  const [title, setTitle] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [targetClick, setTargetClick] = useState("");
  const [operator, setOperator] = useState<any>("");  

  const [errorString, setErrorString] = useState<string|undefined>();

  const doSubmit = useCallback(() => {
    if (_.isEmpty(title)) {
      setErrorString("Please enter campaign name");
      return;
    }

    if (_.isEmpty(campaignId)) {
      setErrorString("Please enter campaign ID");
      return;
    }

    if (_.isEmpty(targetClick)) {
      setErrorString("Please enter target click names");
      return;
    }

    if (_.isEmpty(operator)) {
      setErrorString("Please select operator");
      return;
    }

    setErrorString(undefined);

    onSubmit({ title, campaignId, targetClick, operator: parseInt(operator) })
  }, [title, campaignId, targetClick, operator, errorString]);

  return (
    <div className="space-y-4">
      <Input
        name="title"
        label="Title of campaign"
        placeholder="Enter campaign name"
        value={title}
        onChangeValue={setTitle}
      />

      <Input
        name="campaignId"
        label="Campaign ID"
        placeholder="From 'utm_campaign'"
        value={campaignId}
        onChangeValue={setCampaignId}
      />

      <Input
        name="targetClick"
        label="Target click"
        placeholder="Enter target click names (comma separated)"
        value={targetClick}
        onChangeValue={setTargetClick}
      />

      <Select 
        name="operator"
        label="Operator"
        placeholder="Select operator"
        values={[
          {value: "101", name: "Facebook"},
          {value: "102", name: "Google Ads"},
          {value: "103", name: "Google Search"},
          {value: "104", name: "Google Display"},
          {value: "105", name: "Google Shopping"},
          {value: "106", name: "Bing"},
          {value: "107", name: "TikTok"},
        ]}
        value={operator}
        onChangeValue={setOperator}
      />

      <ErrorString>
        {errorString}
      </ErrorString>

      <Button onPress={doSubmit}>
        Create campaign
      </Button>
    </div>
  )
}
