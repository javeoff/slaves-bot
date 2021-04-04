import { Page, Router } from '@happysanta/router';

export const PAGE_MAIN = '/';
export const PAGE_MARKET = '/market';
export const PAGE_RATING = '/rating';
export const PAGE_USER = '/user/:id([0-9]+)'; // Юзер
export const PAGE_MARKET_USER = '/market/user/:id([0-9]+)'; // Юзер из маркета
export const PAGE_RATING_USER = '/rating/user/:id([0-9]+)'; // Юзер из рейтинга

export const PANEL_MAIN = 'panel_main';
export const VIEW_MAIN = 'view_main';
export const VIEW_RATING = 'view_rating';

export const VIEW_MARKET = 'view_market';
export const PANEL_MARKET = 'panel_market';
export const PANEL_RATING = 'panel_rating';

export const PANEL_MAIN_USER = 'panel_main_user'; // User из главной
export const PANEL_MARKET_USER = 'panel_market_user'; // USER из маркета
export const PANEL_RATING_USER = 'panel_rating_user'; // USER из рейтинга

export const routes = {
  [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
  [PAGE_MARKET]: new Page(PANEL_MARKET, VIEW_MARKET),
  [PAGE_RATING]: new Page(PANEL_RATING, VIEW_RATING),
  [PAGE_MARKET_USER]: new Page(PANEL_MARKET_USER, VIEW_MARKET),
  [PAGE_RATING_USER]: new Page(PANEL_RATING_USER, VIEW_RATING),
  [PAGE_USER]: new Page(PANEL_MAIN_USER, VIEW_MAIN).makeInfinity(),
};

export const router = new Router(routes);
