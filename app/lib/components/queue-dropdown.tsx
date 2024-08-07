import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Menu,
} from "@mui/material";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";

export const QueueDropdown = ({
  modes,
  activeMode,
  setActiveMode,
}: {
  modes: string[];
  activeMode: string;
  setActiveMode: (mode: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    option: string,
  ) => {
    setActiveMode(option);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <List
        component="nav"
        aria-label="Panel Filter Mode"
        sx={[
          {
            padding: 0,
          },
        ]}
      >
        <ListItemButton
          disableRipple
          id="panel-filter-button"
          aria-haspopup="listbox"
          aria-controls="panel-filter"
          aria-label=""
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
          sx={[
            {
              fontWeight: "Bold",
              textTransform: "none",
              fontSize: 20,
              height: "100%",
              width: "fit-content",
            },
          ]}
        >
          <>{activeMode}</>
          <Icon path={mdiChevronDown} size={1} />
        </ListItemButton>
      </List>
      <Menu
        id="panel-filter"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "panel-filter-button",
          role: "listbox",
        }}
      >
        {modes.map((option, i) => (
          <MenuItem
            key={option}
            selected={option == activeMode}
            onClick={(event) => handleMenuItemClick(event, option)}
            sx={[
              {
                py: 2,
                px: 4,
                fontWeight: "Bold",
                fontSize: 20,
                color: "grey",
                "&:Mui-selected": {
                  backgroundColor: "grey",
                },
              },
            ]}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
