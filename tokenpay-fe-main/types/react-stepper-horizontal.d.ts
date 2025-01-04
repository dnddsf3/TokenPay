declare module "react-stepper-horizontal" {
  import React from "react";

  interface Step {
    title: string;
    onClick?: () => void;
  }

  interface StepperProps {
    steps: Step[];
    activeStep: number;
    activeColor?: string;
    completeColor?: string;
    defaultBarColor?: string;
    circleTop?: number;
    size?: number;
    circleFontSize?: number;
    completeBarColor?: string;
    completeTitleColor?: string;
    activeTitleColor?: string;
    defaultTitleColor?: string;
    defaultColor?: string;
    barStyle?: "solid" | "dashed";
    lineMarginOffset?: number;
  }

  export default class Stepper extends React.Component<StepperProps> {}
}
