import * as React from "react";

import { Avatar, Badge, Menu, MenuItem, Switch, Tooltip } from "@mui/material";
import { Tab, TabConfig } from "../types/common";
import { User, UserStatus } from "../types/users";
import { styled, useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import ChatIcon from "@mui/icons-material/Chat";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Contacts from "./Contacts";
import ContactsIcon from "@mui/icons-material/Contacts";
import { ContentCopy } from "@mui/icons-material";
import Conversations from "./Conversations";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import NewContactModal from "./Modals/NewContactModal";
import NewConversationModal from "./Modals/NewConversationModal";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useConversations } from "../contexts/ConversationsProvider";
import useLocalStorage from "../hooks/useLocalStorage";

const drawerWidth = 240;

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface IDashboard {
  id: string;
  name: string;
}

const Dashboard: React.FC<IDashboard> = ({ id, name }) => {
  const [user, setUser] = useLocalStorage<User>("id", {} as User);
  const [selectedTab, setSelectedTab] = React.useState<Tab>(Tab.CONVERSATIONS);
  // const { }
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (tab: Tab) => {
    setSelectedTab(tab);
    handleDrawerClose();
  };

  const tabsConfig: {
    [key in Tab]: TabConfig;
  } = {
    [Tab.CONVERSATIONS]: {
      name: "Conversations",
      Component: Conversations,
      ButtonModal: NewConversationModal,
      Icon: ChatIcon,
      id: Tab.CONVERSATIONS,
      props: {
        id,
        name,
      },
    },
    [Tab.CONTACTS]: {
      name: "Contacts",
      Component: Contacts,
      ButtonModal: NewContactModal,
      Icon: ContactsIcon,
      id: Tab.CONTACTS,
      props: {
        id,
        name,
      },
    },
  };

  const tabs: TabConfig[] = Object.values(tabsConfig);
  const { Component, ButtonModal, props } = tabsConfig[selectedTab];
  const { changeStatus } = useConversations();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = React.useCallback(
    (e: any) => {
      const status =
        UserStatus.ONLINE === user.status
          ? UserStatus.OFFLINE
          : UserStatus.ONLINE;
      setUser({
        ...user,
        status,
      });

      changeStatus(status);
    },
    [user, setUser, changeStatus]
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {tabsConfig[selectedTab].name}
          </Typography>
          <Box marginLeft="auto" marginRight={2}>
            <Typography variant="body1">
              {name}
              <Tooltip title="Copy User Id" placement="top-start">
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={() => navigator.clipboard.writeText(id)}
                  size="small"
                >
                  <ContentCopy htmlColor="white" fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
          </Box>

          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Badge
              color={user.status === UserStatus.ONLINE ? "success" : "warning"}
              overlap="circular"
              variant="dot"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {name.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>
              Go {user.status === UserStatus.ONLINE ? "Offline" : "Online"}
              <Switch
                edge="end"
                onChange={handleToggle}
                checked={user.status === UserStatus.ONLINE}
                inputProps={{
                  "aria-labelledby": "switch-list-label-wifi",
                }}
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List component="nav">
          {tabs.map((tab) => (
            <ListItem key={tab.id} disablePadding>
              <ListItemButton
                selected={selectedTab === tab.id}
                onClick={() => handleListItemClick(tab.id)}
              >
                <ListItemIcon>
                  <tab.Icon />
                </ListItemIcon>
                <ListItemText primary={tab.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <ButtonModal />
      </Drawer>
      <Main>
        <DrawerHeader />
        <Component {...props} />
      </Main>
    </Box>
  );
};

export default Dashboard;
