export default class Translator {

  private xhr: XMLHttpRequest;
  private url: string = "https://api-free.deepl.com/v2/translate";
  private key: string = "1fa4cd0a-7872-2cc0-e6e3-e96c6587ca62:fx";

  constructor(lang: string) {
    this.xhr = new XMLHttpRequest();
    this.url += `?auth_key=${this.key}&target_lang=${lang}`;
  }

  public testQuery(): boolean {
    const { xhr } = this;

    let query = this.url + `&text=`;
    xhr.open("GET", query, false); 
    xhr.send(); // synchronous request
    let status = xhr.status;
    if (status === 0 || (status >= 200 && status < 400)) {
      return true;
    } else {
      return false;
    }
  }

  public checkUsage(): void {
    const { xhr } = this;
    xhr.open("GET", `https://api-free.deepl.com/v2/usage?auth_key=${this.key}`, false);
    xhr.send(); // synchronous request
    console.log("DeepL Usage", xhr.responseText);
  }

  public translate(texts: string[]): string[] {
    const { xhr } = this;

    let query = this.url;
    for (let i=0; i<texts.length; i++) {
      query += `&text=${texts[i]}`;
    }
    xhr.open("GET", query, false); 
    xhr.send(); // synchronous request
    let status = xhr.status;
    if (status === 0 || (status >= 200 && status < 400)) {
      const json = xhr.responseText;
      return this.parse(json);
    } else {
      return texts;
    }
  }

  /**
   * Parse the JSON received from DeepL
   */
  private parse(raw: string): string[] {
    const obj = JSON.parse(raw);
    const transTexts = [];
    for (let i=0; i<obj.translations.length; i++) {
      transTexts.push(obj.translations[i].text);
    }
    return transTexts;
  }

}
