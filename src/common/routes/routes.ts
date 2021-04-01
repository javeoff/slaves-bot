import { Page, Router } from '@happysanta/router';

export const PAGE_MAIN = '/';
export const PANEL_MAIN = 'panel_main';
export const VIEW_MAIN = 'view_main';

export const routes = {
  [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
};

export const router = new Router(routes);
