import React from 'react';
// import { action } from '@storybook/addon-actions';
import { WalletActionsButton } from './index';

export default {
  title: 'Component/WalletActionsButton',
  component: WalletActionsButton,
};

const Template = (args) => <WalletActionsButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Receive',
  image: "https://www.svgrepo.com/svg/524254/arrow-down",
  onClick: console.log("Receive button clicked"),
};
