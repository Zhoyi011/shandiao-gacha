// i18n.js
let lang = "zh"; // 默认语言

const translations = {
  zh: {
    title: "沙雕抽卡大全",
    enter_name: "输入昵称",
    start: "开始游戏",
    pull: "抽卡",
    pulling: "抽卡中…",
    gacha_machine: "抽卡机",
    collection: "我的图鉴",
    all_collected: "恭喜你，收集完成！",
    Common: "普通",
    Rare: "稀有",
    Epic: "史诗",
    Legendary: "传说",
    Secret: "隐藏",
    全部: "全部",
  },
  en: {
    title: "Silly Gacha Gallery",
    enter_name: "Enter your name",
    start: "Start Game",
    pull: "Draw",
    pulling: "Drawing…",
    gacha_machine: "Gacha Machine",
    collection: "My Collection",
    all_collected: "Congratulations, you've collected all!",
    Common: "Common",
    Rare: "Rare",
    Epic: "Epic",
    Legendary: "Legendary",
    Secret: "Secret",
    全部: "All",
  },
};

export function t(key) {
  return translations[lang][key] || key;
}

export function setLanguage(newLang) {
  lang = newLang;
}

export const currentLang = () => lang;
