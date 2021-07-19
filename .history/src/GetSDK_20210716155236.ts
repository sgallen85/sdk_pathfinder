import { ShowcaseEmbedWindow } from './sdk';

const SDK_VERSION = '3.2';

export const GetSDK = function(elementId: string | HTMLIFrameElement, applicationKey: string): Promise<any> {
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
        clearInterval(intervalId);

        const sdk = await (iframe.contentWindow as ShowcaseEmbedWindow).MP_SDK.connect(iframe, applicationKey, SDK_VERSION);
        resolve(sdk);
        console.log(sdk);
      }
    };
    const intervalId = setInterval(checkIframe, 100);
  });
}
