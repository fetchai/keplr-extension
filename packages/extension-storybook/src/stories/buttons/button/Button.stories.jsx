import React from 'react';
import { Button } from './button';

export default {
  title: 'Component/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
  },
} 

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Claim rewards',
  onClick: () => console.log('Claim rewards clicked'),
};

export const PrimaryBlur = Template.bind({});
PrimaryBlur.args = {
  // primary: true,
  label: 'Claim rewards',
  className: 'storybook-button--primaryBlur',
  onClick: () => console.log('Claim rewards clicked'),
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Fetchhub !',
  onClick: () => console.log('Claim rewards clicked'),
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Claim rewards',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'view details',
};
