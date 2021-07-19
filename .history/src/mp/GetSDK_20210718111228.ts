import { MpSdk, ShowcaseEmbedWindow } from './sdk';

const SDK_VERSION = '3.2';

/**
 * Gets a reference to the SDK. Use this if you want to do SDK stuff.
 * @param {string | HTMLIFrameElement} elementId ID of the iframe or the iframe element itself
 * @param {string} applicationKey Your API key 
 * @returns Promise of MpSdk reference
 */
export const GetSDK = function(elementId: string | HTMLIFrameElement, applicationKey: string): Promise<MpSdk> {
  return new Promise(function(resolve, reject) {
    const checkIframe = async function() {
      let iframe = null;
      if (elementId instanceof HTMLIFrameElement) {
        iframe = elementId as HTMLIFrameElement;
      }
      else {
        iframe = document.getElementById(elementId) as HTMLIFrameElement;
      }

      if (iframe) {
        // sometimes this is undefined for some reason, so check for it
        const sdkWindow = (await iframe.contentWindow as ShowcaseEmbedWindow).MP_SDK;
        if (sdkWindow) {
          clearInterval(intervalId);
          const sdk = sdkWindow.connect(iframe, applicationKey, SDK_VERSION);
          resolve(sdk);
          console.log(sdk);
        }
      }
    };
    const intervalId = setInterval(checkIframe, 100);
  });
}
