import React, { FunctionComponent, useEffect } from "react";
import { useStyle } from "styles/index";
import { useStore } from "stores/index";
import {
  DrawerActions,
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { useFocusedScreen } from "providers/focused-screen";
import {
  createDrawerNavigator,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeIcon } from "components/new/icon/file-icon";
import { RobotIcon } from "components/new/icon/robot-icon";
import { UpDownArrowIcon } from "components/new/icon/up-down-arrow";
import { ClockIcon } from "components/new/icon/clock-icon";
import { MoreIcon } from "components/new/icon/more-icon";
import { IconButtonWithText } from "components/new/button/icon-button-with-text";
import { View, ViewStyle } from "react-native";
import { IconView } from "components/new/button/icon";
import { BorderlessButton } from "react-native-gesture-handler";
import { BlurredBottomTabBar } from "components/bottom-tabbar";
import { HomeNavigation } from "navigation/home-navigation";
import { OtherNavigation } from "navigation/other-navigation";
import { SettingStackScreen } from "navigation/setting-navigation";
import { QuickTabOption } from "screens/home/new/quick-tab-options";
import Toast from "react-native-toast-message";
import { DrawerContent } from "components/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
export const MainTabNavigation: FunctionComponent = () => {
  const style = useStyle();
  const { chainStore } = useStore();
  const chainId = chainStore.current.chainId;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [isQuickOptionEnable, setQuickOptionEnable] = React.useState(false);

  const focusedScreen = useFocusedScreen();
  const isDrawerOpen = useDrawerStatus() === "open";
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // When the focused screen is not "Home" screen and the drawer is open,
    // try to close the drawer forcely.
    if (focusedScreen.name !== "Home" && isDrawerOpen) {
      navigation.dispatch(DrawerActions.toggleDrawer());
    }
  }, [focusedScreen.name, isDrawerOpen, navigation]);

  enum screenNames {
    Home = "Home",
    Agents = "Agents",
    Inbox = "Inbox",
    Activity = "Activity",
    More = "More",
  }

  const screenIcons = {
    Home: <HomeIcon color="white" />,
    Agents: <RobotIcon size={18} color="white" />,
    Inbox: <UpDownArrowIcon />,
    Activity: <ClockIcon color="white" />,
    More: <MoreIcon color="white" />,
  };

  return (
    <React.Fragment>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }) => {
            switch (route.name) {
              case "HomeTab":
                return (
                  <IconButtonWithText
                    icon={screenIcons[screenNames.Home]}
                    text={screenNames.Home}
                    backgroundBlur={focused}
                    borderRadius={32}
                    iconStyle={
                      style.flatten([
                        "padding-y-8",
                        "padding-x-24",
                      ]) as ViewStyle
                    }
                  />
                );
              case "AgentsTab":
                return (
                  <IconButtonWithText
                    icon={screenIcons[screenNames.Agents]}
                    text={screenNames.Agents}
                    borderRadius={32}
                    backgroundBlur={focused}
                    iconStyle={
                      style.flatten([
                        "padding-y-8",
                        "padding-x-24",
                      ]) as ViewStyle
                    }
                  />
                );
              case "InboxTab":
                return (
                  <IconView
                    img={screenIcons[screenNames.Inbox]}
                    borderRadius={64}
                    backgroundBlur={false}
                    iconStyle={
                      style.flatten([
                        "padding-16",
                        "background-color-white",
                      ]) as ViewStyle
                    }
                  />
                );
              case "ActivityTab":
                return (
                  <IconButtonWithText
                    icon={screenIcons[screenNames.Activity]}
                    text={screenNames.Activity}
                    borderRadius={32}
                    backgroundBlur={focused}
                    iconStyle={
                      style.flatten([
                        "padding-y-8",
                        "padding-x-24",
                      ]) as ViewStyle
                    }
                  />
                );
              case "MoreTab":
                return (
                  <IconButtonWithText
                    icon={screenIcons[screenNames.More]}
                    text={screenNames.More}
                    borderRadius={32}
                    backgroundBlur={focused}
                    iconStyle={
                      style.flatten([
                        "padding-y-8",
                        "padding-x-24",
                      ]) as ViewStyle
                    }
                  />
                );
            }
          },
          tabBarButton: (props) => (
            <View
              style={{
                display: route.name === "Web" ? "none" : "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <BorderlessButton
                {...props}
                activeOpacity={1}
                rippleColor={
                  style.get("color-rect-button-default-ripple").color
                }
                style={{
                  height: "100%",
                  aspectRatio: 1.9,
                  maxWidth: "100%",
                }}
              />
            </View>
          ),
          tabBarActiveTint: true,
          tabBarInactiveTint: false,
          tabBarStyle: {
            backgroundColor: style.get("color-indigo-900").color,
            shadowColor: style.get("color-transparent").color,
            elevation: 0,
            paddingVertical: 16,
            paddingHorizontal: 20,
            height: 100 + insets.bottom,
            borderTopWidth: 0,
          },
          showLabel: false,
        })}
        tabBar={(props) => (
          <BlurredBottomTabBar {...props} enabledScreens={["Home"]} />
        )}
      >
        <Tab.Screen name="HomeTab" component={HomeNavigation} />
        <Tab.Screen name="AgentsTab" component={HomeNavigation} />
        <Tab.Screen
          name="InboxTab"
          component={OtherNavigation}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setQuickOptionEnable(true);
            },
          }}
        />
        <Tab.Screen name="ActivityTab" component={HomeNavigation} />
        <Tab.Screen name="MoreTab" component={SettingStackScreen} />
      </Tab.Navigator>
      <QuickTabOption
        isOpen={isQuickOptionEnable}
        close={() => {
          setQuickOptionEnable(false);
        }}
        onPress={(event) => {
          console.log("test", event);
          switch (event) {
            case "Receive":
              navigation.navigate("Others", {
                screen: "Receive",
                params: { chainId: chainId },
              });
              break;
            case "Send":
              return Toast.show({
                type: "warning",
                text1: `Send is under development`,
              });
            case "Swap":
              return Toast.show({
                type: "warning",
                text1: `Swap is under development`,
              });

            case "Bridge":
              return Toast.show({
                type: "warning",
                text1: `Bridge is under development`,
              });
          }
        }}
      />
    </React.Fragment>
  );
};

export const MainTabNavigationWithDrawer: FunctionComponent = () => {
  const style = useStyle();

  const focused = useFocusedScreen();

  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        // If the focused screen is not "Home" screen,
        // disable the gesture to open drawer.
        swipeEnabled: focused.name === "Home",
        // gestureEnabled: focused.name === "Home",
        overlayColor: style.flatten([
          "color-gray-700@50%",
          "dark:color-gray-700@75%",
        ]).color,
        headerShown: false,
        drawerStyle: { width: "100%" },
      }}
    >
      <Drawer.Screen name="MainTab" component={MainTabNavigation} />
    </Drawer.Navigator>
  );
};
