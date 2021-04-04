import { Router } from "./custom-router";

export const PAGE_PROFILE = "/";
export const PAGE_PROFILE_USER = "/user/:id";
export const PAGE_PROFILE_USER_PANEL = "user_profile";
export const PAGE_PROFILE_PANEL = "profile";
export const PAGE_PROFILE_VIEW = "profile";

export const router = new Router({
  [PAGE_PROFILE]: {
    activePanel: PAGE_PROFILE_PANEL,
    activeView: PAGE_PROFILE_VIEW,
  },
  [PAGE_PROFILE_USER]: {
    activePanel: PAGE_PROFILE_USER_PANEL,
    isInfinity: true,
    activeView: PAGE_PROFILE_VIEW,
  },
});

export const PAGE_MARKET = "/market";
export const PAGE_MARKET_USER = "/market/user/:id";
export const PAGE_MARKET_USER_PANEL = "user_market";
export const PAGE_MARKET_PANEL = "market";
export const PAGE_MARKET_VIEW = "market";

export const marketRouter = new Router(
  {
    [PAGE_MARKET]: {
      activePanel: PAGE_MARKET_PANEL,
      activeView: PAGE_MARKET_VIEW,
    },
    [PAGE_MARKET_USER]: {
      activePanel: PAGE_MARKET_USER_PANEL,
      isInfinity: true,
      activeView: PAGE_MARKET_VIEW,
    },
  },
  PAGE_MARKET
);

export const PAGE_RATING = "/rating";
export const PAGE_RATING_USER = "/rating/user/:id";
export const PAGE_RATING_USER_PANEL = "user_rating";
export const PAGE_RATING_PANEL = "rating";
export const PAGE_RATING_VIEW = "rating";

export const ratingRouter = new Router(
  {
    [PAGE_RATING]: {
      activePanel: PAGE_RATING_PANEL,
      activeView: PAGE_RATING_VIEW,
    },
    [PAGE_RATING_USER]: {
      activePanel: PAGE_RATING_USER_PANEL,
      isInfinity: true,
      activeView: PAGE_RATING_VIEW,
    },
  },
  PAGE_RATING
);

export const getActiveRouter = (): Router => {
  return router.isActive
    ? router
    : ratingRouter.isActive
    ? ratingRouter
    : marketRouter.isActive
    ? marketRouter
    : router;
};

router.startNativeListeners();
