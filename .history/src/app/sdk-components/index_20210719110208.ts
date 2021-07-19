import { MpSdk } from "../../mp/sdk";
import { PathRendererFactory, pathRendererType } from "./PathRenderer";

/**
 * Registers all SDK Scene components.
 * @param {MpSdk} sdk
 */

export const initComponents = async (sdk: MpSdk | any) => {
  await Promise.all([
    sdk.Scene.register(pathRendererType, PathRendererFactory),
  ]);
}