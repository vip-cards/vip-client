import { ROUTES } from "constants/routes";
import { accountMenuRender } from "./accountMenuRender";
import { cartRender } from "./cartRender";
import { wishListRender } from "./wishListRender";

export function navItemsRender(
  wishlist: any,
  cartProducts: any,
  setConfirmModal
) {
  return [
    { link: ROUTES.HOME, title: "home" },
    { link: ROUTES.CATEGORIES, title: "categories" },
    { link: ROUTES.VENDORS, title: "vendors" },
    { link: ROUTES.HOT_DEALS, title: "hotDeals" },
    { link: `/${ROUTES.OFFERS}`, title: "offers" },
    { link: `/${ROUTES.JOBS.MAIN}`, title: "jobs" },
    { link: `/${ROUTES.SERVICES}`, title: "services" },
    {
      link: `/${ROUTES.WISHLIST}`,
      title: "wishlist",
      render: wishListRender(wishlist),
    },
    {
      link: `/${ROUTES.CART}`,
      title: "cart",
      render: cartRender(cartProducts),
    },
    { link: `/${ROUTES.ADS.MAIN}`, title: "Ads" },
    { link: `/${ROUTES.CHAT}`, title: "chat" },
    {
      title: "account",
      withHover: false,
      withCaret: true,
      menu: [
        { link: `/${ROUTES.ACCOUNT}`, title: "myAccount" },
        { link: `/${ROUTES.SUBSCRIBE}`, title: "VIP premium" },
        {
          link: `?`,
          title: "logout",
          onClick: (_e) => setConfirmModal(true),
        },
      ],
      listRender: accountMenuRender(),
    },
  ];
}
