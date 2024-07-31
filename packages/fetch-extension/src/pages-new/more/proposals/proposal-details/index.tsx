import { HeaderLayout } from "@layouts-v2/header-layout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { ButtonV2 } from "@components-v2/buttons/button";
import { Card } from "@components-v2/card";
import { Dropdown } from "@components-v2/dropdown";
import { useDropdown } from "@components-v2/dropdown/dropdown-context";
import { useNotification } from "@components/notification";
import moment from "moment";
import { Link } from "react-router-dom";
import { useStore } from "../../../../stores";
import { calculatePercentages } from "../../../activity/utils";
import { ProposalDurationRow } from "../proposal-row/proposal-duration-row";
import { ProgressBar } from "./progress-bar";
import style from "./style.module.scss";
import { observer } from "mobx-react-lite";

type TallyResult = {
  title: string;
  percentage: string;
  color: string;
};

const voteArr = ["Unspecified", "Yes", "No", "NoWithVeto", "Abstain"];

export const ProposalDetail = observer(() => {
  const navigate = useNavigate();
  const notification = useNotification();

  const { queriesStore, chainStore, accountStore, analyticsStore } = useStore();
  const { id } = useParams<{ id: string }>();
  const [votedOn, setVotedOn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [closed, setClosed] = useState(true);
  const [isSendingTx, setIsSendingTx] = useState(false);
  const [tallyResult, setTallyResult] = useState<TallyResult[]>([
    {
      title: "Yes",
      percentage: "0",
      color: "rgba(66, 25, 229, 1)",
    },
    {
      title: "No",
      percentage: "0",
      color: "rgba(95, 56, 251, 1)",
    },
    {
      title: "No with veto",
      percentage: "0",
      color: "rgba(159, 136, 253, 1)",
    },
    {
      title: "Abstain",
      percentage: "0",
      color: "rgba(207, 195, 254, 1)",
    },
  ]);

  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const queries = queriesStore.get(chainStore.current.chainId);
  const proposal = queries.cosmos.queryGovernance.getProposal(id || "");

  useEffect(() => {
    const date = new Date();
    if (
      proposal &&
      moment(proposal.raw.voting_end_time).valueOf() > date.getTime()
    ) {
      setClosed(false);
    }

    if (proposal) {
      const {
        yesPercentage,
        noPercentage,
        abstainPercentage,
        noWithVetoPercentage,
      } = calculatePercentages(
        proposal.raw.final_tally_result.yes,
        proposal.raw.final_tally_result.abstain,
        proposal.raw.final_tally_result.no,
        proposal.raw.final_tally_result.no_with_veto
      );

      setTallyResult([
        {
          title: "Yes",
          percentage: yesPercentage,
          color: "rgba(66, 25, 229, 1)",
        },
        {
          title: "No",
          percentage: noPercentage,
          color: "rgba(95, 56, 251, 1)",
        },
        {
          title: "No with veto",
          percentage: noWithVetoPercentage,
          color: "rgba(159, 136, 253, 1)",
        },
        {
          title: "Abstain",
          percentage: abstainPercentage,
          color: "rgba(207, 195, 254, 1)",
        },
      ]);
    }
  }, [proposal]);

  const handleClick = async () => {
    const vote: any = voteArr[votedOn];
    if (!proposal) return;
    if (vote !== "Unspecified" && accountInfo.isReadyToSendTx) {
      analyticsStore.logEvent("vote_txn_click", {
        action: vote,
      });
      const tx = accountInfo.cosmos.makeGovVoteTx(proposal?.id, vote);
      setIsSendingTx(true);
      try {
        let gas = accountInfo.cosmos.msgOpts.govVote.gas;

        // Gas adjustment is 1.5
        // Since there is currently no convenient way to adjust the gas adjustment on the UI,
        // Use high gas adjustment to prevent failure.
        try {
          gas = (await tx.simulate()).gasUsed * 1.5;
        } catch (e) {
          // Some chain with older version of cosmos sdk (below @0.43 version) can't handle the simulation.
          // Therefore, the failure is expected. If the simulation fails, simply use the default value.
          console.log(e);
        }

        await tx.send(
          { amount: [], gas: gas.toString() },
          "",
          {},
          {
            onBroadcasted: () => {
              analyticsStore.logEvent("vote_txn_broadcasted", {
                chainId: chainStore.current.chainId,
                chainName: chainStore.current.chainName,
              });
            },
          }
        );

        navigate(`/gov-proposal/details//${id}`, { replace: true });
      } catch (e: any) {
        analyticsStore.logEvent("vote_txn_broadcasted_fail", {
          chainId: chainStore.current.chainId,
          chainName: chainStore.current.chainName,
          message: e?.message ?? "",
        });
        console.log(e);
        if (e?.message === "Request rejected") {
          notification.push({
            type: "warning",
            placement: "top-center",
            duration: 5,
            content: `Failed to vote: ${e.message}`,
            canDelete: true,
            transition: {
              duration: 0.25,
            },
          });
          navigate("/", { replace: true });
          return;
        }
        notification.push({
          type: "warning",
          placement: "top-center",
          duration: 5,
          content: `Failed to vote: ${e.message}`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
        navigate(-2);
        navigate(`/activity`, { replace: true });
      } finally {
        setIsSendingTx(false);
      }
    }
  };

  const handleVoteClick = (id: number) => {
    if (closed) {
      return;
    }
    setVotedOn(id);
  };

  const { isDropdownOpen, setIsDropdownOpen } = useDropdown();

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      onBackButton={() => {
        navigate(-1);
      }}
      showBottomMenu={false}
      showTopMenu={true}
    >
      {isLoading ? (
        <div>Loading.....</div>
      ) : (
        <div>
          <div className={style["gov-proposal-details-container"]}>
            <div className={style["content"]}>
              <div className={style["title"]}>
                {proposal?.raw.content.title}
              </div>
              <div className={style["description"]}>
                {proposal?.raw.content.description}
              </div>
            </div>

            <ProposalDurationRow
              voting_start_time={proposal?.raw.voting_start_time}
              voting_end_time={proposal?.raw.voting_end_time}
              status={proposal?.proposalStatus}
            />

            <Link
              to={`https://www.mintscan.io/fetchai/proposals/${id}`}
              target="_blank"
            >
              <Card
                style={{
                  cursor: "pointer",
                }}
                heading="View full text of the proposal"
                leftImage={require("@assets/svg/wireframe/proposal.svg")}
                rightContent={require("@assets/svg/wireframe/external-link.svg")}
                leftImageStyle={{
                  height: "32px",
                  width: "32px",
                  padding: "4px",
                }}
              />
            </Link>

            <div className={style["turnout"]}>
              <div className={style["label"]}>Turnout</div>
              <ProgressBar
                progressWidth={
                  parseInt(proposal?.turnout.toString() || "0") ?? 0
                }
                height="30px"
                title={proposal?.turnout.toString() || "0%"}
                bgColor="rgba(249, 119, 75, 1)"
                isShowPercentage={false}
              />
            </div>

            <div className={style["tally-results"]}>
              {tallyResult.map((item: any, index: number) => (
                <ProgressBar
                  key={index}
                  progressWidth={parseFloat(item.percentage)}
                  height="54px"
                  title={item.title}
                  bgColor={item.color}
                  isShowPercentage={true}
                  isYourVote={votedOn > 0 && votedOn - 1 === index}
                />
              ))}
            </div>

            <div
              style={{
                marginBottom: "12px",
              }}
            />
          </div>

          <ButtonV2
            text={
              closed
                ? "Voting closed"
                : votedOn > 0
                ? "Change your vote"
                : "Vote"
            }
            styleProps={{
              width: "336px",
              padding: "12px",
              height: "56px",
              background: votedOn > 0 ? "transparent" : "",
              color: votedOn > 0 ? "white" : "",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
            disabled={closed}
            onClick={() => {
              if (closed) return;
              setIsDropdownOpen(true);
            }}
          />
          <Dropdown
            closeClicked={() => setIsDropdownOpen(false)}
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
            title="Vote"
          >
            <div>
              {voteArr.map((voteOption: string, index: number) => {
                return (
                  index > 0 && (
                    <Card
                      style={{
                        cursor: "pointer",
                      }}
                      key={index}
                      heading={voteOption}
                      onClick={() => handleVoteClick(index)}
                      isActive={votedOn === index}
                    />
                  )
                );
              })}
            </div>

            <ButtonV2
              text="Submit"
              styleProps={{
                padding: "12px",
                height: "56px",
              }}
              disabled={votedOn === 0 || isSendingTx}
              onClick={handleClick}
            />
          </Dropdown>
        </div>
      )}
    </HeaderLayout>
  );
});
