import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { PageWithScrollViewInBottomTabView } from "../page";
import {
  AppState,
  AppStateStatus,
  Platform,
  RefreshControl,
  ScrollView,
  ViewStyle,
} from "react-native";
import { useStore } from "../../stores";
// import { StakingInfoCard } from "../../screens/home/staking-info-card";
import { useStyle } from "../../styles";
// import { GovernanceCard } from "../../screens/home/governance-card";
import { observer } from "mobx-react-lite";
// import { MyRewardCard } from "../../screens/home/my-reward-card";
// import { TokensCard } from "../../screens/home/tokens-card";
import { usePrevious } from "../../hooks";
import { useFocusEffect } from "@react-navigation/native";
// import { Dec } from "@keplr-wallet/unit";
import { AccountSection } from "./account-section";
import { TransectionActionCard } from "./transection-action-card";
import { AssertsSection } from "./asserts-section";
import { BIP44Selectable } from "../../screens/home/bip44-selectable";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TestHomeScreen: FunctionComponent = observer(() => {
  const safeAreaInsets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = React.useState(false);

  const { chainStore, accountStore, queriesStore, priceStore } = useStore();

  const style = useStyle();

  const scrollViewRef = useRef<ScrollView | null>(null);

  const currentChain = chainStore.current;
  const currentChainId = currentChain.chainId;
  const previousChainId = usePrevious(currentChainId);
  const chainStoreIsInitializing = chainStore.isInitializing;
  const previousChainStoreIsInitializing = usePrevious(
    chainStoreIsInitializing,
    true
  );

  const account = accountStore.getAccount(chainStore.current.chainId);
  const queries = queriesStore.get(chainStore.current.chainId);

  // const queryStakable = queries.queryBalances.getQueryBech32Address(
  //   account.bech32Address
  // ).stakable;
  // const stakable = queryStakable.balance;
  // const queryDelegated = queries.cosmos.queryDelegations.getQueryBech32Address(
  //   account.bech32Address
  // );
  // const queryUnbonding =
  //   queries.cosmos.queryUnbondingDelegations.getQueryBech32Address(
  //     account.bech32Address
  //   );
  // const delegated = queryDelegated.total;
  // const unbonding = queryUnbonding.total;

  // const stakedSum = delegated.add(unbonding);
  // const total = stakable.add(stakedSum);

  const checkAndUpdateChainInfo = useCallback(() => {
    if (!chainStoreIsInitializing) {
      (async () => {
        try {
          await chainStore.tryUpdateChain(currentChainId);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [chainStore, chainStoreIsInitializing, currentChainId]);

  useEffect(() => {
    const appStateHandler = (state: AppStateStatus) => {
      if (state === "active") {
        checkAndUpdateChainInfo();
      }
    };

    const callback = AppState.addEventListener("change", appStateHandler);

    return () => {
      callback.remove();
    };
  }, [checkAndUpdateChainInfo]);

  useFocusEffect(
    useCallback(() => {
      if (
        (chainStoreIsInitializing !== previousChainStoreIsInitializing &&
          !chainStoreIsInitializing) ||
        currentChainId !== previousChainId
      ) {
        checkAndUpdateChainInfo();
      }
    }, [
      chainStoreIsInitializing,
      previousChainStoreIsInitializing,
      currentChainId,
      previousChainId,
      checkAndUpdateChainInfo,
    ])
  );

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0 });
    }
  }, [chainStore.current.chainId]);

  const onRefresh = React.useCallback(async () => {
    // Because the components share the states related to the queries,
    // fetching new query responses here would make query responses on all other components also refresh.

    await Promise.all([
      priceStore.waitFreshResponse(),
      ...queries.queryBalances
        .getQueryBech32Address(account.bech32Address)
        .balances.map((bal) => {
          return bal.waitFreshResponse();
        }),
      queries.cosmos.queryRewards
        .getQueryBech32Address(account.bech32Address)
        .waitFreshResponse(),
      queries.cosmos.queryDelegations
        .getQueryBech32Address(account.bech32Address)
        .waitFreshResponse(),
      queries.cosmos.queryUnbondingDelegations
        .getQueryBech32Address(account.bech32Address)
        .waitFreshResponse(),
    ]);

    setRefreshing(false);
  }, [accountStore, chainStore, priceStore, queriesStore]);

  return (
    <PageWithScrollViewInBottomTabView
      backgroundMode={"image"}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{
        paddingTop: Platform.OS === "ios" ? safeAreaInsets.top : 48,
      }}
      ref={scrollViewRef}
    >
      <BIP44Selectable />
      <AccountSection />
      <TransectionActionCard
        containtStyle={style.flatten(["margin-y-32"]) as ViewStyle}
      />
      <AssertsSection />

      {/* <AccountCard
        containerStyle={style.flatten(["margin-y-card-gap"]) as ViewStyle}
      />
      {total.toDec().gt(new Dec(0)) ? (
        <View>
          <MyRewardCard
            containerStyle={
              style.flatten(["margin-bottom-card-gap"]) as ViewStyle
            }
          />
          <TokensCardRenderIfTokenExists />
          <StakingInfoCard
            containerStyle={
              style.flatten(["margin-bottom-card-gap"]) as ViewStyle
            }
          />
          <GovernanceCard
            containerStyle={
              style.flatten(["margin-bottom-card-gap"]) as ViewStyle
            }
          />
        </View>
      ) : null} */}
    </PageWithScrollViewInBottomTabView>
  );
});

/**
 * TokensCardRenderIfTokenExists is used to reduce the re-rendering of HomeScreen component.
 * Because HomeScreen is screen of the app, if it is re-rendered, all children component will be re-rendered.
 * If all components on screen are re-rendered, performance problems may occur and users may feel delay.
 * Therefore, the screen should not have state as much as possible.
 *
 * In fact, re-rendering took place because home screen had to check the user's balances
 * when deciding whether to render the tokens card on the screen and this makes some delay.
 * To solve this problem, this component has been separated.
 */
// const TokensCardRenderIfTokenExists: FunctionComponent = observer(() => {
//   const { chainStore, accountStore, queriesStore } = useStore();

//   const style = useStyle();

//   const queryBalances = queriesStore
//     .get(chainStore.current.chainId)
//     .queryBalances.getQueryBech32Address(
//       accountStore.getAccount(chainStore.current.chainId).bech32Address
//     );

//   const tokens = queryBalances.positiveNativeUnstakables.concat(
//     queryBalances.nonNativeBalances
//   );

//   return (
//     <React.Fragment>
//       {tokens.length > 0 ? (
//         <TokensCard
//           containerStyle={
//             style.flatten(["margin-bottom-card-gap"]) as ViewStyle
//           }
//         />
//       ) : null}
//     </React.Fragment>
//   );
// });
