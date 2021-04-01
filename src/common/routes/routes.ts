import { Page, Router } from '@happysanta/router';

export const PAGE_MAIN = '/';
export const PAGE_MARKET = '/market';
export const PAGE_RATING = '/rating';
export const PAGE_USER = '/user/:id([0-9]+)'; // Юзер

export const PANEL_MAIN = 'panel_main';
export const VIEW_MAIN = 'view_main';
export const VIEW_RATING = 'view_rating';

export const VIEW_MARKET = 'view_market';
export const PANEL_MARKET = 'panel_market';
export const PANEL_RATING = 'panel_rating';

export const routes = {
  [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
  [PAGE_MARKET]: new Page(PANEL_MARKET, VIEW_MARKET),
  [PAGE_RATING]: new Page(PANEL_RATING, VIEW_RATING),
};

export const router = new Router(routes);
