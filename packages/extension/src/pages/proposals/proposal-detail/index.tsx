import { HeaderLayout } from "@layouts/header-layout";
import React, { useEffect, useState, Fragment } from "react";
import { FunctionComponent } from "react";
import { useHistory, useParams } from "react-router";
import style from "./style.module.scss";
import { Button } from "reactstrap";
import { ProposalSetup, ProposalType } from "src/@types/proposal-type";
import { VoteBlock } from "@components/proposal/vote-block";
import moment from "moment";
import { useSelector } from "react-redux";
import { useProposals } from "@chatStore/proposal-slice";
// import { signTransaction } from "@utils/sign-transaction";
import { useStore } from "../../../stores";
export const ProposalDetail: FunctionComponent = () => {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [proposal, setProposal] = useState<ProposalType>();
  const [votedOn, setVotedOn] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [closed, setClosed] = useState(true);
  const { chainStore } = useStore();
  const reduxProposals: ProposalSetup = useSelector(useProposals);
  useEffect(() => {
    let proposalItem = reduxProposals.activeProposals.find(
      (proposal) => proposal.proposal_id === id
    );
    if (!proposalItem) {
      proposalItem = reduxProposals.closedProposals.find(
        (proposal) => proposal.proposal_id === id
      );
    }
    if (!proposalItem) {
      proposalItem = reduxProposals.votedProposals.find(
        (proposal) => proposal.proposal_id === id
      );
    }
    setIsLoading(false);
    setProposal(proposalItem);
  }, [id]);

  useEffect(() => {
    const date = new Date();
    if (
      proposal &&
      moment(proposal?.voting_end_time).valueOf() > date.getTime()
    ) {
      setClosed(false);
    }
  }, [proposal]);
  const handleClick = async () => {
    // const data = {
    //   chainId: "fetchhub-4",
    //   accountNumber: 309355,
    //   sequence: 10,
    //   bodyBytes:
    //     "CpcBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEncKLGZldGNoMXN2ODQ5NGRkamd6aHFnODA4dW1jdHpsNTN1eXRxNTBxamtqdmZyEixmZXRjaDFzZ2pkNTgyOTh4dGdteWNlMnd2YTVra2pqcmVsbWxjdnU5cGV3dBoZCgRhZmV0EhExMDAwMDAwMDAwMDAwMDAwMA==",
    //   gasLimit: "96000",
    // };
    // const data2 = {
    //   txBody: {
    //     messages: [  // try {
    //   const signResult = await signTransaction(
    //     JSON.stringify(data),
    //     "fetchhub-4",
    //     "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr"
    //   );
    // } catch (e) {
    //   console.log(e);
    // }
    //       {
    //         proposalId: "19",
    //         voter: "fetch1sgjd58298xtgmyce2wva5kkjjrelmlcvu9pewt",
    //         option: "VOTE_OPTION_YES",
    //       },
    //     ],
    //     memo: "",
    //     timeoutHeight: "0",
    //     extensionOptions: [],
    //     nonCriticalExtensionOptions: [],
    //   },
    //   authInfo: {
    //     signerInfos: [
    //       {
    //         publicKey: {
    //           typeUrl: "/cosmos.crypto.secp256k1.PubKey",
    //           value: "CiECpyDO9t58kT69+lQwoSLQChM3GOMK/e08KNi0hvrq7o4=",
    //         },
    //         modeInfo: {
    //           single: {
    //             mode: "SIGN_MODE_DIRECT",
    //           },
    //         },
    //         sequence: "203",
    //       },
    //     ],
    //     fee: {
    //       amount: [
    //         {
    //           denom: "afet",
    //           amount: "0",
    //         },
    //       ],
    //       gasLimit: "69695",
    //       payer: "",
    //       granter: "",
    //     },
    //   },
    //   chainId: "fetchhub-4",
    //   accountNumber: "304189",
    // };
    // try {
    //   const signResult = await signTransaction(
    //     JSON.stringify(data),
    //     "fetchhub-4",
    //     accountInfo
    //   );
    // } catch (e) {
    //   console.log(e);
    // }
    history.push(`/proposal-vote-status/${votedOn}/${id}`);
  };

  const handleVoteClick = (id: number) => {
    if (closed) {
      return;
    }
    setVotedOn(id);
  };
  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle="Proposals"
      onBackButton={() => {
        history.goBack();
      }}
      showBottomMenu={false}
    >
      <div className={style.pContainer}>
        {isLoading ? (
          <div className={style.isLoading}>
            <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
          </div>
        ) : (
          <Fragment>
            <div className={style.pContentScroll}>
              <div className={style.pHeading}>
                <p className={style.pTitle}>{proposal?.content.title}</p>
                <p className={style.pId}>{proposal?.proposal_id}</p>
              </div>
              <div className={style.pVotingDate}>
                <div className={style.votingStart}>
                  <p className={style.pVotingHead}>Voting Start</p>
                  <p className={style.pVotingEnd}>
                    {moment(proposal?.voting_start_time)
                      .utc()
                      .format("MMM DD, hh:mm UTC")}
                  </p>
                </div>
                <div>
                  <p className={style.pVotingHead}>Voting End</p>
                  <p className={style.pVotingEnd}>
                    {moment(proposal?.voting_end_time)
                      .utc()
                      .format("MMM DD, hh:mm UTC")}
                  </p>
                </div>
              </div>
              <p className={style.pDesc}>{proposal?.content.description}</p>
            </div>

            <div className={style.pLinkContainer}>
              <p
                className={style.pLink}
                onClick={() => {
                  if (chainStore.current.chainId === "fetchhub-4") {
                    window.open(
                      `https://fetchstation.azoyalabs.com/mainnet/governance/${id}`,
                      "_blank"
                    );
                  } else {
                    window.open(
                      `https://fetchstation.azoyalabs.com/dorado/governance/${id}`,
                      "_blank"
                    );
                  }
                }}
              >
                View more in Block Explorer{" "}
                <img src={require("@assets/svg/gov-share-blue.svg")} />
              </p>
            </div>

            <div className={style.voteContainer}>
              <VoteBlock
                selected={votedOn}
                title="Yes"
                icon="gov-tick"
                id={1}
                color="#6ab77a4d"
                activeColor="#6AB77A"
                handleClick={handleVoteClick}
                closed={closed}
              />

              <VoteBlock
                selected={votedOn}
                title="Abstain"
                icon="gov-abstain"
                id={2}
                color="#ECAA5D4D"
                activeColor="#ECAA5D"
                handleClick={handleVoteClick}
                closed={closed}
              />

              <VoteBlock
                selected={votedOn}
                title="No"
                icon="gov-cross-2"
                id={3}
                color="#DC64614D"
                activeColor="#DC6461"
                handleClick={handleVoteClick}
                closed={closed}
              />

              <VoteBlock
                selected={votedOn}
                title="No with veto"
                icon="gov-no-veto"
                id={4}
                color="#3E64C44D"
                activeColor="#3E64C4"
                handleClick={handleVoteClick}
                closed={closed}
              />
            </div>
            <Button
              className={style.button}
              color="primary"
              disabled={votedOn === 0}
              onClick={handleClick}
            >
              Vote
            </Button>
          </Fragment>
        )}
      </div>
    </HeaderLayout>
  );
};
