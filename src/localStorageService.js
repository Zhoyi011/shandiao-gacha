// localStorageService.js

// 存储抽卡进度
export function saveProgress(username, collection) {
  if (!username) return;
  localStorage.setItem(`gacha_${username}`, JSON.stringify(collection));
}

// 读取抽卡进度
export function loadProgress(username) {
  if (!username) return [];
  const data = localStorage.getItem(`gacha_${username}`);
  return data ? JSON.parse(data) : [];
}
