// localStorageService.js

export function loadProgress(username) {
  const key = `collection_${username}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function saveProgress(username, collection) {
  const key = `collection_${username}`;
  localStorage.setItem(key, JSON.stringify(collection));
}

export function loadCustomSettings(username) {
  const key = `custom_${username}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function saveCustomSettings(username, settings) {
  const key = `custom_${username}`;
  localStorage.setItem(key, JSON.stringify(settings));
}

export function clearCustomSettings(username) {
  const key = `custom_${username}`;
  localStorage.removeItem(key);
}
