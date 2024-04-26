import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "stores/index";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { Toggle } from "components/toggle";
import FastImage from "react-native-fast-image";
import { VectorCharacter } from "components/vector-character";
import { BlurBackground } from "components/new/blur-background/blur-background";
import { PageWithScrollView } from "components/page";
import { TextInput } from "components/input";
import { SearchIcon } from "components/new/icon/search-icon";
import { EmptyView } from "components/new/empty";

export const SettingChainListScreen: FunctionComponent = observer(() => {
  const { chainStore } = useStore();
  const style = useStyle();

  const [search, setSearch] = useState("");
  const [filterChainInfos, setFilterChainInfos] = useState(
    chainStore.chainInfosWithUIConfig
  );

  useEffect(() => {
    const searchTrim = search.trim();
    const newChainInfos = chainStore.chainInfosWithUIConfig.filter(
      (chainInfoUI) => {
        return chainInfoUI.chainInfo.chainId
          .toLowerCase()
          .includes(searchTrim.toLowerCase());
      }
    );
    setFilterChainInfos(newChainInfos);
  }, [chainStore.chainInfosWithUIConfig, search]);

  return (
    <PageWithScrollView
      backgroundMode="image"
      contentContainerStyle={
        [
          style.flatten(["flex-grow-1"]),
          {
            height: filterChainInfos.length === 0 ? "100%" : undefined,
          },
        ] as ViewStyle
      }
      style={style.flatten(["padding-x-page", "padding-y-page"]) as ViewStyle}
    >
      {filterChainInfos.length === 0 ? <EmptyView /> : null}
      <BlurBackground
        borderRadius={12}
        blurIntensity={20}
        containerStyle={style.flatten(["margin-y-20"]) as ViewStyle}
      >
        <TextInput
          placeholder="Search"
          placeholderTextColor={"white"}
          style={style.flatten(["h6"])}
          inputContainerStyle={
            style.flatten([
              "border-width-0",
              "padding-x-18",
              "padding-y-12",
            ]) as ViewStyle
          }
          value={search}
          onChangeText={(text: string) => {
            setSearch(text);
          }}
          containerStyle={style.flatten(["padding-0"]) as ViewStyle}
          inputRight={<SearchIcon />}
        />
      </BlurBackground>
      {/* <FlatList
        renderItem={({ item }) => <SettingChainListScreenElement {...item} />}
        keyExtractor={(item) => item.key}
        data={chainStore.chainInfosWithUIConfig.map((chainInfoUI, index) => {
          return {
            key: chainInfoUI.chainInfo.chainId,
            isFirst: index === 0,
            isLast: index === chainStore.chainInfosWithUIConfig.length - 1,
            chainId: chainInfoUI.chainInfo.chainId,
            chainName: chainInfoUI.chainInfo.chainName,
            chainSymbolImageUrl: chainInfoUI.chainInfo.raw.chainSymbolImageUrl,
            disabled: chainInfoUI.disabled,
          };
        })}
        scrollEnabled={false}
      /> */}
      {filterChainInfos.map((chainInfoUI, index) => {
        return (
          <SettingChainListScreenElement
            key={chainInfoUI.chainInfo.chainId}
            isFirst={index === 0}
            isLast={index === chainStore.chainInfosWithUIConfig.length - 1}
            chainId={chainInfoUI.chainInfo.chainId}
            chainName={chainInfoUI.chainInfo.chainName}
            chainSymbolImageUrl={chainInfoUI.chainInfo.raw.chainSymbolImageUrl}
            disabled={chainInfoUI.disabled}
          />
        );
      })}
      <View style={style.flatten(["height-page-pad"]) as ViewStyle} />
    </PageWithScrollView>
  );
});

export const SettingChainListScreenElement: FunctionComponent<{
  isFirst: boolean;
  isLast: boolean;

  chainId: string;
  chainName: string;
  chainSymbolImageUrl: string | undefined;
  disabled: boolean;
}> = observer(({ chainId, chainName, chainSymbolImageUrl, disabled }) => {
  const { chainStore } = useStore();

  const style = useStyle();

  return (
    <BlurBackground
      blurIntensity={15}
      borderRadius={12}
      containerStyle={
        style.flatten([
          "flex-row",
          "height-58",
          "items-center",
          "margin-y-2",
          "padding-x-12",
        ]) as ViewStyle
      }
    >
      <BlurBackground
        backgroundBlur={true}
        containerStyle={
          style.flatten([
            "width-36",
            "height-36",
            "border-radius-64",
            "items-center",
            "justify-center",
            "margin-right-12",
          ]) as ViewStyle
        }
      >
        {chainSymbolImageUrl ? (
          <FastImage
            style={{
              width: 24,
              height: 24,
            }}
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: chainSymbolImageUrl,
            }}
          />
        ) : (
          <VectorCharacter char={chainName[0]} color="white" height={15} />
        )}
      </BlurBackground>
      <View style={style.flatten(["justify-center"]) as ViewStyle}>
        <Text style={style.flatten(["h6", "color-white"])}>{chainName}</Text>
      </View>
      <View style={style.get("flex-1")} />
      <View>
        <Toggle
          on={!disabled}
          onChange={() => {
            chainStore.toggleChainInfoInUI(chainId);
          }}
        />
      </View>
    </BlurBackground>
  );
});
