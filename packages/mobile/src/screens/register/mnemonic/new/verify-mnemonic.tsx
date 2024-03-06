import React, { FunctionComponent, useEffect, useState } from "react";
import { FlatList, Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { WordChip } from "components/mnemonic";
import { Button } from "components/button";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSmartNavigation } from "navigation/smart-navigation";
import { NewMnemonicConfig } from "../hook";
import { RegisterConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { RectButton } from "components/rect-button";
import { BIP44AdvancedButton, useBIP44Option } from "screens/register/bip44";
import { PageWithScrollViewHeader } from "components/new/page/scroll-view-in-header";

export const VerifyMnemonicScreen: FunctionComponent = observer(() => {
  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          registerConfig: RegisterConfig;
          newMnemonicConfig: NewMnemonicConfig;
        }
      >,
      string
    >
  >();

  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  const registerConfig = route.params.registerConfig;
  const newMnemonicConfig = route.params.newMnemonicConfig;

  const bip44Option = useBIP44Option();

  const [candidateWords, setCandidateWords] = useState<
    {
      word: string;
      usedIndex: number;
    }[]
  >([]);
  const [wordSet, setWordSet] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    const words = newMnemonicConfig.mnemonic.split(" ");
    const randomSortedWords = words.slice().sort(() => {
      return Math.random() > 0.5 ? 1 : -1;
    });

    const candidateWords = randomSortedWords.slice();
    setCandidateWords(
      candidateWords.map((word) => {
        return {
          word,
          usedIndex: -1,
        };
      })
    );

    setWordSet(
      newMnemonicConfig.mnemonic.split(" ").map((_) => {
        return undefined;
      })
    );
  }, [newMnemonicConfig.mnemonic]);

  const firstEmptyWordSetIndex = wordSet.findIndex(
    (word) => word === undefined
  );

  const [isCreating, setIsCreating] = useState(false);

  const renderButtonItem = ({ item, index }: any) => {
    return (
      <WordButton
        key={index}
        word={item.word}
        used={item.usedIndex >= 0}
        onPress={() => {
          const newWordSet = wordSet.slice();
          const newCandiateWords = candidateWords.slice();
          if (item.usedIndex < 0) {
            if (firstEmptyWordSetIndex < 0) {
              return;
            }

            newWordSet[firstEmptyWordSetIndex] = item.word;
            setWordSet(newWordSet);

            newCandiateWords[index].usedIndex = firstEmptyWordSetIndex;
            setCandidateWords(newCandiateWords);
          } else {
            newWordSet[item.usedIndex] = undefined;
            setWordSet(newWordSet);

            newCandiateWords[index].usedIndex = -1;
            setCandidateWords(newCandiateWords);
          }
        }}
      />
    );
  };

  return (
    <PageWithScrollViewHeader
      backgroundMode="image"
      contentContainerStyle={style.get("flex-grow-1")}
      style={style.flatten(["padding-x-page"]) as ViewStyle}
      headerTitle="Verify your recovery phrase"
      parallaxHeaderHeight={170}
      fixed={
        <React.Fragment>
          <View style={style.flatten(["flex-1"])} />
          <View>
            <FlatList
              data={candidateWords}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderButtonItem}
              numColumns={4}
              scrollEnabled={false}
            />
            <Button
              containerStyle={
                style.flatten([
                  "border-radius-32",
                  "margin-top-24",
                ]) as ViewStyle
              }
              text="Continue"
              size="large"
              loading={isCreating}
              disabled={wordSet.join(" ") !== newMnemonicConfig.mnemonic}
              onPress={async () => {
                setIsCreating(true);
                smartNavigation.navigateSmart("Register.CreateAccount", {
                  registerConfig: registerConfig,
                  mnemonic: encodeURIComponent(
                    JSON.stringify(newMnemonicConfig.mnemonic.trim())
                  ),
                  bip44HDPath: bip44Option.bip44HDPath,
                });
              }}
            />
          </View>
        </React.Fragment>
      }
    >
      <View style={style.flatten(["margin-y-10"]) as ViewStyle}>
        <WordsCard
          wordSet={wordSet.map((word, i) => {
            return {
              word: word ?? "",
              empty: word === undefined,
              dashed: i === firstEmptyWordSetIndex,
            };
          })}
        />
        <BIP44AdvancedButton bip44Option={bip44Option} />
      </View>
    </PageWithScrollViewHeader>
  );
});

const WordButton: FunctionComponent<{
  word: string;
  used: boolean;
  onPress: () => void;
}> = ({ word, used, onPress }) => {
  const style = useStyle();

  return (
    <RectButton
      style={
        style.flatten(
          [
            "padding-y-6",
            "margin-4",
            "flex-1",
            "items-center",
            "border-radius-32",
            "border-width-1",
            "border-color-gray-300",
          ],
          [used && "border-color-platinum-400"]
        ) as ViewStyle
      }
      onPress={onPress}
      rippleColor={"black@50%"}
    >
      <Text
        style={style.flatten(
          ["body3", "color-white"],
          [used && "color-platinum-400"]
        )}
      >
        {word}
      </Text>
    </RectButton>
  );
};

const WordsCard: FunctionComponent<{
  wordSet: {
    word: string;
    empty: boolean;
    dashed: boolean;
  }[];
}> = ({ wordSet }) => {
  const renderItem = ({ item, index }: any) => {
    return (
      <WordChip
        key={index.toString()}
        word={item.word}
        empty={item.empty}
        dashedBorder={item.dashed}
      />
    );
  };

  return (
    <FlatList
      data={wordSet}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      numColumns={3}
      scrollEnabled={false}
    />
  );
};
