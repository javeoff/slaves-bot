import { ReactElement } from "react";
import { bridgeClient } from "../bridge/bridge";
import { sleep } from "../helpers";

const { pathToRegexp, match } = require("path-to-regexp");

interface Route {
  activeView: string;
  activePanel: string;
  isInfinity?: boolean;
}

interface Page {
  id: string;
  params: Record<string, string>;
  isInfinity?: boolean;
}

interface Popout {
  params: Record<string, string>;
  element: ReactElement;
}

interface History {
  activeView: string;
  viewsHistory: string[];
  panelsHistory: Record<string, Page[]>;
  modalsHistory: Record<string, Page[]>;
  infinityPanelsHistory: Record<string, string[]>;
  infinityPanelsTypes: Record<string, Record<string, string>>;
  popoutsHistory: Record<string, Popout[]>;
}

type Routes = Record<string, Route>;

/**
 * Кастомный роутер специально для Epic приложений
 */
export class Router {
  history: History;
  routes: Routes;
  updateHistoryListeners: VoidFunction[];
  defaultPath: string;
  panelsCounted: number;
  isActive: boolean;
  _popHandler: VoidFunction;
  ignoreNextEvent: boolean;
  openedModal: boolean;

  constructor(routes: Routes, defaultPath: string = "/") {
    this.history = {
      activeView: "",
      viewsHistory: [],
      panelsHistory: {},
      modalsHistory: {},
      infinityPanelsHistory: {},
      infinityPanelsTypes: {},
      popoutsHistory: {},
    };
    this.routes = routes;
    this.updateHistoryListeners = [];
    this.defaultPath = defaultPath;
    this.panelsCounted = 0;
    this.isActive = false;
    this.ignoreNextEvent = false;
    this.openedModal = false;

    this._popHandler = async (event?: any) => {
      if (this.isActive) {
        if (!this.ignoreNextEvent) {
          await this.popChanges();
        } else {
          this.ignoreNextEvent = false;
        }
      } else {
        console.log("POP inactive!", this.isActive, event);
      }
    };
    this.init();
  }

  // Добавляет callback в слушатели обновлений
  onUpdateHistory(cb: VoidFunction) {
    this.updateHistoryListeners.push(cb);
  }

  // Запускаем прослушивание события кнопки "назад"
  startNativeListeners(k?: any) {
    console.log("Set is active", true, k);
    this.isActive = true;
    window.addEventListener("popstate", this._popHandler);
  }

  // Применяем изменения кнопки "назад"
  async popChanges() {
    if (this.getPopout()) {
      this.history.popoutsHistory[this.getViewId()].pop();
      this.initUpdateHistory();
    } else if (this.getModalId()) {
      if (this.openedModal) {
        console.log("Pop modal", JSON.stringify(this.history.modalsHistory));
        this.history.modalsHistory[this.getViewId()].pop();
        setTimeout(() => {
          this.openedModal = false;
        }, 600);
        this.initUpdateHistory();
      }
    } else {
      if (this.isInfinityPanel(this.getViewId())) {
        this.history.infinityPanelsHistory[this.getViewId()].pop();
        delete this.history.infinityPanelsTypes[this.getViewId()][
          this.getPanelId()
        ];
      }
      if (this.history.viewsHistory.length === 1) {
        if (this.history.panelsHistory[this.getViewId()].length === 1) {
          bridgeClient.closeApp();
        } else {
          this.history.panelsHistory[this.getViewId()].pop();
        }
      } else {
        this.history.panelsHistory[this.getViewId()].pop();
      }
      if (!this.history.panelsHistory[this.getViewId()].length) {
        // Удаляем из истории текущий view
        delete this.history.infinityPanelsTypes[this.getViewId()];
        delete this.history.infinityPanelsHistory[this.getViewId()];
        if (this.history.viewsHistory.length > 1) {
          this.history.viewsHistory.pop();
        } else {
          bridgeClient.closeApp();
        }
        this.history.activeView = this.getViewId();
      }
      this.initUpdateHistory();
    }
  }

  // Системная функция
  async popHandler() {
    this.popChanges();
  }

  // Перестаем слушать кнопку "назад" у браузера. Нужно для переключения между роутерами
  stopNativeListeners(k?: any) {
    console.log("Set is active", false, k);
    this.isActive = false;
    window.removeEventListener("popstate", this._popHandler);
  }

  // Запускаем и иницилизируем первый роут
  init() {
    let foundLocation = false;
    for (let routePath in this.routes) {
      let route = this.routes[routePath];
      if (this.defaultPath.match(pathToRegexp(routePath))) {
        let matched = match(routePath)(this.defaultPath);
        foundLocation = true;
        this.pushPage(
          route.activeView,
          route.activePanel,
          matched.params,
          route.isInfinity
        );
        break;
      }
    }
    if (!foundLocation && this.routes["/"]) {
      this.pushPage(
        this.routes["/"].activeView,
        this.routes["/"].activePanel,
        {},
        this.routes["/"].isInfinity
      );
    }
    this.initUpdateHistory();
  }

  isFirstPage(): boolean {
    return (
      this.history.viewsHistory.length === 1 &&
      this.history.panelsHistory[this.getViewId()].length === 1
    );
  }

  // Получает текущий ID для View
  getViewId(): string {
    return this.history.viewsHistory[this.history.viewsHistory.length - 1];
  }

  // Получает текущие параметры
  getParams(): Record<string, string> {
    let panels = this.history.panelsHistory[this.getViewId()];
    let modals = this.history.modalsHistory[this.getViewId()];
    if (modals && modals.length) {
      return modals[modals.length - 1].params;
    }
    if (panels && panels[panels.length - 1].params) {
      return panels[panels.length - 1].params;
    } else {
      return {};
    }
  }

  // Получает ID текущей панели
  getPanelId(): string {
    let panels = this.history.panelsHistory[this.getViewId()];
    return panels ? panels[panels.length - 1].id : "";
  }

  // Получает ID текущей бесконечной панели
  getInfinityPanelId(): string {
    let panels = this.history.infinityPanelsHistory[this.getViewId()];
    return panels ? panels[panels.length - 1] : "";
  }

  // Проверяет, что эта панель - бесконечная
  isInfinityPanel(panelId: string): boolean {
    if (!this.history.infinityPanelsTypes[this.getViewId()]) return false;
    return (
      this.history.infinityPanelsTypes[this.getViewId()][panelId] != undefined
    );
  }

  // Получает оригинальное название бесконечной панели
  getInfinityPanelOriginal(viewId?: string, panelId?: string): string {
    return this.history.infinityPanelsTypes[viewId ? viewId : this.getViewId()][
      panelId ? panelId : this.getPanelId()
    ];
  }

  // Получает ID предыдущей панели
  getPrevPanelId(): string {
    let panels = this.history.panelsHistory[this.getViewId()];
    return panels ? panels[panels.length - 2]?.id : "";
  }

  // Пушаем новую страницу по заданному роуту и парамтерам (как раз для открытия каких-то айтемов по ID)
  pushPageRoute(path: string, params: Record<string, string>) {
    if (this.routes[path]) {
      this.pushPage(
        this.routes[path].activeView,
        this.routes[path].activePanel,
        params,
        this.routes[path].isInfinity
      );
    } else {
      throw new Error("Unknow path " + path);
    }
  }

  // Пушаем новую страницу по заданному роуту и парамтерам (как раз для открытия каких-то айтемов по ID)
  replacePageRoute(path: string, params: Record<string, string>) {
    if (this.routes[path]) {
      this.replacePage(
        this.routes[path].activeView,
        this.routes[path].activePanel,
        params,
        this.routes[path].isInfinity
      );
    } else {
      throw new Error("Unknow path " + path);
    }
  }

  // Пушаем новую страницу
  pushPage(
    activeView: string,
    activePanel: string,
    params: Record<string, string>,
    isInfinity?: boolean
  ) {
    window.history.pushState("", "", null);
    this.history.activeView = activeView;
    if (this.getViewId() !== activeView) {
      this.history.viewsHistory.push(activeView);
    }
    if (this.getPanelId() !== activePanel) {
      this.pushPanel(activePanel, params, isInfinity);
      if (isInfinity) {
        this.panelsCounted++;
      }
    }
    this.initUpdateHistory();
  }

  replacePage(
    activeView: string,
    activePanel: string,
    params: Record<string, string>,
    isInfinity?: boolean
  ) {
    this.history.activeView = activeView;
    if (this.getViewId() !== activeView) {
      this.history.viewsHistory[
        this.history.viewsHistory.length - 1
      ] = activeView;
    }
    if (this.getPanelId() !== activePanel) {
      this.replacePanel(activePanel, params, isInfinity);
      if (isInfinity) {
        this.panelsCounted++;
      }
    }
    this.initUpdateHistory();
  }

  getModalId(): string | null {
    let modals = this.history.modalsHistory[this.getViewId()];
    console.log("Modals", JSON.stringify(modals));
    return modals ? modals[modals.length - 1]?.id || null : null;
  }

  getPopout(): ReactElement | null {
    let popouts = this.history.popoutsHistory[this.getViewId()];
    return popouts ? popouts[popouts.length - 1]?.element || null : null;
  }

  async pushModal(modalId: string, params: Record<string, string>) {
    window.history.pushState("", "", null);
    while (this.openedModal) {
      await sleep(200);
    }
    this.openedModal = true;
    if (this.getViewId()) {
      if (!this.history.modalsHistory[this.getViewId()]) {
        this.history.modalsHistory[this.getViewId()] = [];
      }
      if (this.getModalId() != modalId) {
        this.history.modalsHistory[this.getViewId()].push({
          id: modalId,
          isInfinity: false,
          params,
        });
        this.initUpdateHistory();
      }
    }
  }

  async pushPopout(popout: ReactElement, params: Record<string, string>) {
    window.history.pushState("", "", null);
    this.openedModal = true;
    if (this.getViewId()) {
      if (!this.history.popoutsHistory[this.getViewId()]) {
        this.history.popoutsHistory[this.getViewId()] = [];
      }
      this.history.popoutsHistory[this.getViewId()].push({
        element: popout,
        params,
      });
      this.initUpdateHistory();
    }
  }

  // Юзает нативный объект истории для перемещения в своей истории
  popPage() {
    window.history.back();
  }

  popPageTo(viewId: string, panelId: string) {
    let timesBack = 0;
    this.stopNativeListeners("Before all true");
    while (true) {
      console.log("i", this.getViewId(), this.getPanelId());
      // console.log(this.getViewId(), this.getPanelId(), panelId);
      if (this.getViewId() === viewId && this.getPanelId() == panelId) {
        this.ignoreNextEvent = true;
        window.history.go(-timesBack);
        break;
      }
      this.popChanges();
      timesBack++;
    }
    this.startNativeListeners("after all true");
    this.initUpdateHistory();
  }

  createPanels() {
    if (!this.history.panelsHistory[this.getViewId()]) {
      this.history.panelsHistory[this.getViewId()] = [];
    }
    if (!this.history.infinityPanelsHistory[this.getViewId()]) {
      this.history.infinityPanelsHistory[this.getViewId()] = [];
    }
    if (!this.history.infinityPanelsTypes[this.getViewId()]) {
      this.history.infinityPanelsTypes[this.getViewId()] = {};
    }
  }

  // Пушает новую панель в список
  pushPanel(
    activePanel: string,
    params: Record<string, string>,
    infinity?: boolean
  ) {
    this.createPanels();
    let originalPanelId = activePanel;
    let infinityPaneldId = activePanel + "_" + this.panelsCounted;
    this.history.panelsHistory[this.getViewId()].push({
      id: infinity ? infinityPaneldId : originalPanelId,
      params: params,
    });
    if (infinity) {
      this.history.infinityPanelsHistory[this.getViewId()].push(
        infinityPaneldId
      );
      this.history.infinityPanelsTypes[this.getViewId()][
        infinityPaneldId
      ] = originalPanelId;
    }
  }

  replacePanel(
    activePanel: string,
    params: Record<string, string>,
    infinity?: boolean
  ) {
    this.createPanels();
    let originalPanelId = activePanel;
    let infinityPaneldId = activePanel + "_" + this.panelsCounted;
    let panels = this.history.panelsHistory[this.getViewId()];
    panels[panels.length - 1] = {
      id: infinity ? infinityPaneldId : originalPanelId,
      params: params,
    };
    if (infinity) {
      let infinityPanels = this.history.infinityPanelsHistory[this.getViewId()];
      infinityPanels[this.getInfinityPanels.length - 1] = infinityPaneldId;
      this.history.infinityPanelsTypes[this.getViewId()][
        infinityPaneldId
      ] = originalPanelId;
    }
  }

  // Возвращает списком идентификаторы текущих бесконечных панелей (генерируются на ходу)
  getInfinityPanels(viewId?: string): string[] {
    if (
      !this.history.infinityPanelsHistory[viewId ? viewId : this.getViewId()]
    ) {
      this.history.infinityPanelsHistory[
        viewId ? viewId : this.getViewId()
      ] = [];
    }
    return Array.from(
      this.history.infinityPanelsHistory[viewId ? viewId : this.getViewId()]
    );
  }

  // Сообщает слушателям о том, что произошло изменение состояния
  initUpdateHistory() {
    this.updateHistoryListeners.forEach((cb) => cb());
  }
}
