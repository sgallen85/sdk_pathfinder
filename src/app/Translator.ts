export default class Translator {

  private url: string = "https://api-free.deepl.com/v2/translate";
  private key: string = "1fa4cd0a-7872-2cc0-e6e3-e96c6587ca62:fx";

  constructor(lang: string) {
    this.url += `?auth_key=${this.key}&target_lang=${lang}`;
  }

  /**
   * Smoketest for DeepL HTTP requests
   */
  // public testQuery(): boolean {
  //   const xhr = new XMLHttpRequest();
  //   let query = this.url + `&text=`;
  //   xhr.open("GET", query, false); // synchronous request
  //   xhr.send(); 
  //   let status = xhr.status;
  //   return status === 0 || (status >= 200 && status < 400);
  // }

  public checkUsage(): void {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api-free.deepl.com/v2/usage?auth_key=${this.key}`);
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        const status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          console.log("DeepL Usage:", xhr.responseText);
        } else {
          console.error("Usage retrieval failed.")
        }
      }
    }
    xhr.send();
  }

  /**
   * Translate using DeepL via HTTP request
   * @param texts List of strings to translate
   * @param callBack Callback handling translated strings
   */
  public translate(
    texts: string[], 
    callBack: (newTexts: string[]) => void,
  ){
    const xhr = new XMLHttpRequest();
    let query = this.url;
    for (let i=0; i<texts.length; i++) {
      query += `&text=${texts[i]}`;
    }
    xhr.open("GET", query); 
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        const status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          const json = xhr.responseText;
          callBack(this.parse(json));
        } else {
          console.error("Translation failed.")
        }
      }
    }
    xhr.send();
  }

  /**
   * Parse the JSON received from DeepL. Returns translated texts, as a list.
   */
  private parse(json: string): string[] {
    const obj = JSON.parse(json);
    const transTexts = [];
    for (let i=0; i<obj.translations.length; i++) {
      transTexts.push(obj.translations[i].text);
    }
    return transTexts;
  }

}
