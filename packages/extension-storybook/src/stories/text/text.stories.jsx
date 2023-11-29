import React from "react";
import { Text } from "./index";

export default {
  title: "Component/Text",
  component: Text,
};

const Template = (args) => <Text {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Hello, World!",
};

export const DifferentSizes = () => (
  <>
    <Text size="extra-small">Extra Small</Text>
    <Text size="small">Small Text</Text>
    <Text size="medium">Medium Text</Text>
    <Text size="large">Large Text</Text>
    <Text size="extra-large">Extra Large Text</Text>
  </>
);

export const DifferentColors = () => (
  <>
    <Text color="white">White Text</Text>
    <Text color="grey">Grey Text</Text>
  </>
);

export const CurrencyView = () => (
  <>
    <Text currencyView>123 FET</Text>
    <Text currencyView>29 TESTFET</Text>
    <Text currencyView>456 USD</Text>
  </>
);
