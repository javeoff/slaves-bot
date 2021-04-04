import { getActiveRouter } from "../common/routes";
import { MODAL_ERROR_CARD } from "./Error";

export const openErrorModal = (e: Error) => {
  getActiveRouter().pushModal(MODAL_ERROR_CARD, {
    message: e.message,
  });
};
