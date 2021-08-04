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

// TODO: this is a temporary fix for localization. For the final product, need to make more scalable

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
    'nl': "Locaties",
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
    'en': "Select a location to begin wayfinding",
    'es': "Seleccione una ubicación para comenzar la orientación",
    'fr': "Sélectionnez un emplacement pour commencer l'orientation",
    'de': "Wählen Sie einen Ort aus, um mit der Wegfindung zu beginnen",
    'ru': "Выберите место, чтобы начать поиск",
    'zh': "选择一个地点开始寻路",
    'ja': "経路探索を開始する場所を選択します",
    'nl': "Selecteer een locatie om te beginnen met bewegwijzering",
    'it': "Seleziona una posizione per iniziare l'orientamento",
    'pt': "Selecione um local para começar o wayfinding",
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
  'Great Hall': {
    'en': "Great Hall",
    'es': "Gran Salón",
    'fr': "Grand Hall",
    'de': "Großer Saal",
    'ru': "Большой Зал",
    'zh': "大厅",
    'ja': "グレート・ホール",
    'nl': "Grote Zaal",
    'it': "Sala Grande",
    'pt': "Grande Salão",
  },
  '125: History Department Conference Room': {
    'en': "125: History Department Conference Room",
    'es': "125: Sala de Conferencias del Departamento de Historia",
    'fr': "125: Salle de Conférence du Département d'Histoire",
    'de': "125: Konferenzraum der Fachbereich Geschichte",
    'ru': "125: Конференц-зал Исторического Факультета",
    'zh': "125: 历史系会议室",
    'ja': "125: 歴史学部会議室",
    'nl': "125: Geschiedenis Departement Conferentiezaal",
    'it': "125: Sala Conferenze del Dipartimento di Storia",
    'pt': "125: Sala de Conferências do Departamento de História",
  },
  '225: History Department Graduate Lounge': {
    'en': "225: History Department Graduate Lounge",
    'es': "225: Salón de Grados del Departamento de Historia",
    'fr': "225: Salon des Diplômés du Département d'Histoire",
    'de': "125: Fachbereich Geschichte Graduate Lounge",
    'ru': "125: Гостиная для Выпускников Исторического факультета",
    'zh': "125: 历史系研究生休息室",
    'ja': "125: 歴史学部大学院ラウンジ",
    'nl': "125: Geschiedenis Departement Graduate Lounge",
    'it': "125: Salone dei Laureati del Dipartimento di Storia",
    'pt': "125: Departamento de História Lounge de Graduados",
  },
  'B21: Warren Center Conference Room': {
    'en': "225: Warren Center Conference Room",
    'es': "225: Sala de Conferencias del Centro Warren",
    'fr': "225: Salle de Conférence du Centre Warren",
    'de': "125: Warren Center Konferenzraum",
    'ru': "125: Конференц-зал Центра Уоррена",
    'zh': "125: 沃伦中心会议厅",
    'ja': "125: ウォーレンセンター会議室",
    'nl': "125: Warren Center Conferentiezaal",
    'it': "125: Sala conferenze del Warren Center",
    'pt': "125: Sala de Conferências do Centro Warren",
  },
};

export function loc(key: string, lang: string): string {
  if (!(key in table))
    return key;
  if (!(lang in table[key]))
    return table[key]['en'];
  return table[key][lang];
}



