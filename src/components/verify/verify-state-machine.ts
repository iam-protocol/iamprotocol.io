import type { VerifyState, VerifyAction } from "./types";

export const initialState: VerifyState = { step: "idle" };

export function verifyReducer(
  state: VerifyState,
  action: VerifyAction
): VerifyState {
  switch (action.type) {
    case "START_CAPTURE":
      // Allow starting from idle, or re-entering from the failed state when
      // the user chose to reset their baseline after a baseline-missing error.
      if (state.step !== "idle" && state.step !== "failed") return state;
      return { step: "capturing", intent: action.intent };

    case "CAPTURE_DONE":
      if (state.step !== "capturing") return state;
      return { step: "processing", intent: state.intent };

    case "PROOF_COMPLETE":
      if (state.step !== "processing") return state;
      return { step: "signing", intent: state.intent };

    case "VERIFICATION_SUCCESS":
      if (state.step !== "processing" && state.step !== "signing") return state;
      return {
        step: "verified",
        intent: state.intent,
        commitment: action.commitment,
        txSignature: action.txSignature,
      };

    case "VERIFICATION_FAILED":
      if (state.step === "verified") return state;
      return { step: "failed", error: action.error };

    case "RESET":
      return { step: "idle" };

    default:
      return state;
  }
}
