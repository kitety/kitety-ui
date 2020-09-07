import React from "react";
import { badge } from "./index";
import {
withKnobs,
text,
boolean,
color,
select,
} from "@storybook/addon-knobs";

export default {
title: "badge",
component: badge,
decorators: [withKnobs],
};

export const knobsBtn = () => (
);