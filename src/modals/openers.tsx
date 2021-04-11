import { getActiveRouter } from "../common/routes";
import { MODAL_ERROR_CARD } from "./Error";

export const openErrorModal = (e: Error) => {
  console.log("ERROR", e);
  getActiveRouter().pushModal(MODAL_ERROR_CARD, {
    message: e.message,
  });
};
