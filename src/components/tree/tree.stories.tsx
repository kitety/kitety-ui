import React from "react";
import { Tree } from "./index";
import {
withKnobs,
text,
boolean,
color,
select,
} from "@storybook/addon-knobs";

export default {
title: "Tree",
component: Tree,
decorators: [withKnobs],
};

export const knobsBtn = () => <Tree/>