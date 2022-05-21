import { h, defineComponent } from "vue";
import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";

// element-plus icon
import Check from "@iconify-icons/ep/check";
import Menu from "@iconify-icons/ep/menu";
import HomeFilled from "@iconify-icons/ep/home-filled";
import SetUp from "@iconify-icons/ep/set-up";
import Edit from "@iconify-icons/ep/edit";
import Setting from "@iconify-icons/ep/setting";
import Lollipop from "@iconify-icons/ep/lollipop";
import Link from "@iconify-icons/ep/link";
import Position from "@iconify-icons/ep/position";
import Histogram from "@iconify-icons/ep/histogram";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import ArrowDown from "@iconify-icons/ep/arrow-down";
import Close from "@iconify-icons/ep/close";
import CloseBold from "@iconify-icons/ep/close-bold";
import Bell from "@iconify-icons/ep/bell";
import Guide from "@iconify-icons/ep/guide";
import Iphone from "@iconify-icons/ep/iphone";
import Location from "@iconify-icons/ep/location";
import Tickets from "@iconify-icons/ep/tickets";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import Notebook from "@iconify-icons/ep/notebook";
import Rank from "@iconify-icons/ep/rank";
import VideoPlay from "@iconify-icons/ep/video-play";
import Monitor from "@iconify-icons/ep/monitor";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import More from "@iconify-icons/ep/more-filled";
addIcon("check", Check);
addIcon("menu", Menu);
addIcon("home-filled", HomeFilled);
addIcon("set-up", SetUp);
addIcon("edit", Edit);
addIcon("setting", Setting);
addIcon("lollipop", Lollipop);
addIcon("link", Link);
addIcon("position", Position);
addIcon("histogram", Histogram);
addIcon("refresh-right", RefreshRight);
addIcon("arrow-down", ArrowDown);
addIcon("close", Close);
addIcon("close-bold", CloseBold);
addIcon("bell", Bell);
addIcon("guide", Guide);
addIcon("iphone", Iphone);
addIcon("location", Location);
addIcon("tickets", Tickets);
addIcon("office-building", OfficeBuilding);
addIcon("notebook", Notebook);
addIcon("video-play", VideoPlay);
addIcon("rank", Rank);
addIcon("monitor", Monitor);
addIcon("search", Search);
addIcon("refresh", Refresh);
addIcon("edits", EditPen);
addIcon("delete", Delete);
addIcon("more", More);

// remixicon
import ArrowRightSLine from "@iconify-icons/ri/arrow-right-s-line";
import ArrowLeftSLine from "@iconify-icons/ri/arrow-left-s-line";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import NodeTree from "@iconify-icons/ri/node-tree";
import UbuntuFill from "@iconify-icons/ri/ubuntu-fill";
import QuestionLine from "@iconify-icons/ri/question-line";
import CheckboxCircleLine from "@iconify-icons/ri/checkbox-circle-line";
import InformationLine from "@iconify-icons/ri/information-line";
import CloseCircleLine from "@iconify-icons/ri/close-circle-line";
import ArrowUpLine from "@iconify-icons/ri/arrow-up-line";
import ArrowDownLine from "@iconify-icons/ri/arrow-down-line";
import Bookmark2Line from "@iconify-icons/ri/bookmark-2-line";
import AddFill from "@iconify-icons/ri/add-circle-line";
import ListCheck from "@iconify-icons/ri/list-check";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import Database from "@iconify-icons/ri/database-2-line";
import Dict from "@iconify-icons/ri/git-repository-line";
import Card from "@iconify-icons/ri/bank-card-line";
import Reset from "@iconify-icons/ri/restart-line";
import Dept from "@iconify-icons/ri/git-branch-line";
import Password from "@iconify-icons/ri/lock-password-line";
import Ppt from "@iconify-icons/ri/file-ppt-2-line";
import TerminalWindowLine from "@iconify-icons/ri/terminal-window-line";
import User from "@iconify-icons/ri/user-3-fill";
import Lock from "@iconify-icons/ri/lock-fill";
addIcon("arrow-right-s-line", ArrowRightSLine);
addIcon("arrow-left-s-line", ArrowLeftSLine);
addIcon("logout-circle-r-line", LogoutCircleRLine);
addIcon("node-tree", NodeTree);
addIcon("ubuntu-fill", UbuntuFill);
addIcon("question-line", QuestionLine);
addIcon("checkbox-circle-line", CheckboxCircleLine);
addIcon("information-line", InformationLine);
addIcon("close-circle-line", CloseCircleLine);
addIcon("arrow-up-line", ArrowUpLine);
addIcon("arrow-down-line", ArrowDownLine);
addIcon("bookmark-2-line", Bookmark2Line);
addIcon("add", AddFill);
addIcon("list-check", ListCheck);
addIcon("more-vertical", More2Fill);
addIcon("database", Database);
addIcon("dict", Dict);
addIcon("card", Card);
addIcon("reset", Reset);
addIcon("dept", Dept);
addIcon("password", Password);
addIcon("ppt", Ppt);
addIcon("terminal-window-line", TerminalWindowLine);
addIcon("user", User);
addIcon("lock", Lock);

// Font Awesome 4
import FaUser from "@iconify-icons/fa/user";
import FaLock from "@iconify-icons/fa/lock";
import FaSignOut from "@iconify-icons/fa/sign-out";
addIcon("fa-user", FaUser);
addIcon("fa-lock", FaLock);
addIcon("fa-sign-out", FaSignOut);

// Unicons
import Import from "@iconify-icons/uil/import";
import Export from "@iconify-icons/uil/export";
import ArrowsShrinkV from "@iconify-icons/uil/arrows-shrink-v";
addIcon("import", Import);
addIcon("export", Export);
addIcon("density", ArrowsShrinkV);

// fluent
import Role from "@iconify-icons/fluent/people-swap-28-filled";
import FlUser from "@iconify-icons/fluent/person-12-filled";
addIcon("role", Role);
addIcon("flUser", FlUser);

// Material Design Icons
import Expand from "@iconify-icons/mdi/arrow-expand-down";
import UnExpand from "@iconify-icons/mdi/arrow-expand-right";
addIcon("expand", Expand);
addIcon("unExpand", UnExpand);

// carbon
import LocationCompany from "@iconify-icons/carbon/location-company";
addIcon("location-company", LocationCompany);

// Iconify Icon在Vue里离线使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIconOffline",
  components: { IconifyIcon },
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  render() {
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: `${this.icon}`,
        ...attrs
      },
      {
        default: () => []
      }
    );
  }
});
