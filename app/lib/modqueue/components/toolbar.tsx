"use client";

import type { Entry, EntryState } from "../model";
import * as Actions from "../actions";
import { Avatar, Box } from "@mui/material";
import Icon from "@mdi/react";
import {
  mdiFlag,
  mdiCheck,
  mdiClose,
  mdiAccountGroupOutline,
  mdiAccount,
  mdiAccountOutline,
} from "@mdi/js";
import _ from "lodash";
import { QueueTabs } from "@/lib/components/queue-tab";
//import { QueueDropdown } from "@/lib/components/queue-dropdown";
import { useState } from "react";

const modes = ["Needs Review", "Resolved"]	

export const ToolbarRenderer = () => {
  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{fontSize: 30, fontWeight: "semi-bold"}}>Mod Queue</Box>
      <Box display="flex" flexDirection="row">
        <QueueTabs modes={modes}/>
      </Box>
    </Box>
  );
};
	//<QueueDropdown>Dropdown1</QueueDropdown>
	//<QueueDropdown>Dropdown2</QueueDropdown>
  //      <ActionButton 
//	  icon={}
//	  label="Tab2"
//	  variant="clear"
//	  onClick={() => {}}
//	/>

