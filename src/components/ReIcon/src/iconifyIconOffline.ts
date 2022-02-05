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
import User from "@iconify-icons/ep/user";
import Iphone from "@iconify-icons/ep/iphone";
import Location from "@iconify-icons/ep/location";
import Tickets from "@iconify-icons/ep/tickets";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import Notebook from "@iconify-icons/ep/notebook";
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
addIcon("user", User);
addIcon("iphone", Iphone);
addIcon("location", Location);
addIcon("tickets", Tickets);
addIcon("office-building", OfficeBuilding);
addIcon("notebook", Notebook);

// remixicon
import arrowRightSLine from "@iconify-icons/ri/arrow-right-s-line";
import arrowLeftSLine from "@iconify-icons/ri/arrow-left-s-line";
import logoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import nodeTree from "@iconify-icons/ri/node-tree";
addIcon("arrow-right-s-line", arrowRightSLine);
addIcon("arrow-left-s-line", arrowLeftSLine);
addIcon("logout-circle-r-line", logoutCircleRLine);
addIcon("node-tree", nodeTree);

// Font Awesome 4
import faUser from "@iconify-icons/fa/user";
import faLock from "@iconify-icons/fa/lock";
import faSignOut from "@iconify-icons/fa/sign-out";
addIcon("fa-user", faUser);
addIcon("fa-lock", faLock);
addIcon("fa-sign-out", faSignOut);

// Iconify Icon在Vue里离线使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIcon",
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
