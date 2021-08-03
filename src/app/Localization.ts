export const LanguageOptions = {
  EN: {
    code: 'en',
    text: 'English',
  },
  ES: {
    code: 'es',
    text: 'Español',
  },
  FR: {
    code: 'fr',
    text: 'Français',
  },
  DE: {
    code: 'de',
    text: 'Deutsch',
  },
  RU: {
    code: 'ru',
    text: 'Русский',
  },
  ZH: {
    code: 'zh',
    text: '中文',
  },
  JA: {
    code: 'ja',
    text: '日本語',
  },
  NL: {
    code: 'nl',
    text: 'Nederlands',
  },
  IT: {
    code: 'it',
    text: 'Italiano',
  },
  PT: {
    code: 'pt',
    text: 'Português',
  },
}

interface LookupTable {
  [key: string]: TranslationTable;
}

interface TranslationTable {
  [lang: string]: string;
}

const table: LookupTable = {
  'Locations': {
    'en': "Locations",
    'es': "Ubicaciones",
    'fr': "Emplacements",
    'de': "Standorte",
    'ru': "Локации",
    'zh': "地点",
    'ja': "場所",
    'nl': "Plaatsen",
    'it': "Posizioni",
    'pt': "Localizações",
  },
  'Floor': {
    'en': "Floor",
    'es': "Piso",
    'fr': "Étage",
    'de': "Stock",
    'ru': "Этаж",
    'zh': "层",
    'ja': "階",
    'nl': "Verdieping",
    'it': "Piano",
    'pt': "Andar",
  },
  'nudge_text': {
    'en': "Select a location to begin pathfinding",
    'es': "Seleccione una ubicación para iniciar la búsqueda de rutas",
    'fr': "Sélectionnez un emplacement pour commencer la recherche de chemin",
    'de': "Wählen Sie einen Ort aus, um die Pfadsuche zu starten",
    'ru': "Выберите местоположение для начала поиска пути",
    'zh': "选择一个地点开始寻路",
    'ja': "パスファインディングを開始する場所を選択",
    'nl': "Selecteer een plaats om het zoeken naar een pad te beginnen",
    'it': "Seleziona una posizione per iniziare il pathfinding",
    'pt': "Seleccione um local para iniciar a pesquisa de caminhos",
  },
  'CLOSE': {
    'en': "CLOSE",
    'es': "CERRAR",
    'fr': "FERMER",
    'de': "SCHLIESSEN",
    'ru': "ЗАКРЫТЬ",
    'zh': "关",
    'ja': "閉じる",
    'nl': "SLUITEN",
    'it': "CHIUDERE",
    'pt': "FECHAR",
  },
  'Fly Mode': {
    'en': "Fly Mode",
    'es': "Modo Vuelo",
    'fr': "Mode Vol",
    'de': "Flugmodus",
    'ru': "Режим Полета",
    'zh': "飞行模式",
    'ja': "フライモード",
    'nl': "Vliegmodus",
    'it': "Modalità Volo",
    'pt': "Modo Voo",
  },
};

export function loc(key: string, lang: string): string {
  if (lang in table[key])
    return table[key][lang];
  else
    return table[key]['en'];
}



