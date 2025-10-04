import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Login from '@/features/auth/components/Login';

const meta: Meta<typeof Login> = {
  title: 'Auth/Login',
  component: Login,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// Define Story type
type Story = StoryObj<typeof Login>;

export const Default: Story = {
  args: {
    // Default props if applicable
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Invalid credentials provided',
  },
};

// Further stories can be added to cover more UI scenarios
