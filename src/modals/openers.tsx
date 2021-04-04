import { router } from "../common/routes/routes";
import { MODAL_ERROR_CARD } from "./Error";

export const openErrorModal = (e: Error) => {
  router.pushModal(MODAL_ERROR_CARD, {
    message: e.message,
  });
};
