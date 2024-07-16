import AdsCampaigns from "~/embed/AdsCampaigns";
import Button from "~/components/Button";
import CreateCampaignEmbed, { Submit } from "~/embed/CreateCampaign";
import EazyModal from "~/components/EazyModal";
import Input from "~/components/Input";
import SubNavbar from "~/components/SubNavbar";
import moment from "moment";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useState } from "react";

export default function AdsManager() {
  const [isCreationModalShow, setCreationModalShow] = useState(false);
  const [startDate, setStartDate] = useState<number>(moment().add(-1, "days").unix());
  const [endDate, setEndDate] = useState<number>(moment().unix());

  const [applyStartDate, setApplyStartDate] = useState<number>(startDate);
  const [applyEndDate, setApplyEndDate] = useState<number>(endDate);

  const onCreateCampaign = useCallback((it: Submit) => {
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .post(
          webConfig.apiEndpointFactory(ApiPathEnum.CreateAdsManagerCampaign),
          {
            name: it.title,
            campaign_id: it.campaignId,
            target_click: it.targetClick.split(","),
            campaign_type: it.operator,
          }
        )
        .then((res) => {
          setCreationModalShow(false);
        })
        .catch((err) => {
          console.log(err);
        });
    })
  }, []);

  return (
    <>
      <EazyModal title="Create new campaign" isVisible={isCreationModalShow} intent={() => setCreationModalShow(false)}>
        <CreateCampaignEmbed onSubmit={onCreateCampaign}/>
      </EazyModal>

      <SubNavbar title="AdsManager" createActionLabel="Create campaign" onCreateAction={() => setCreationModalShow(true)}/>

      <div className="flex bg-white flex-row gap-4 px-2 py-2 border-b border-b-zinc-200 items-center">
        <Input
          name="startDate"
          placeholder="Enter start date"
          type="date"
          value={moment(startDate * 1000).format("YYYY-MM-DD")}
          onChangeValue={it => setStartDate(moment(it).unix())}
        />

        <Input
          name="endDate"
          placeholder="Enter end date"
          type="date"
          value={moment(endDate * 1000).format("YYYY-MM-DD")}
          onChangeValue={it => setEndDate(moment(it).unix())}
        />

        <div className="w-64">
          <Button 
            variant="secondary"
            onPress={() => {
              setApplyStartDate(startDate);
              setApplyEndDate(endDate);
            }}
          >
            Apply
          </Button>
        </div>
      </div>

      <AdsCampaigns startDate={applyStartDate} endDate={applyEndDate}/>
    </>
  );
}
