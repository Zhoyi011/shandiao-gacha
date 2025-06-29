// App.jsx（更新：接入 Firebase Google 登录 + 用户名绑定 + 登出功能）
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cards from "./cards";
import { t, setLanguage, currentLang } from "./i18n";
import { loadProgress, saveProgress } from "./localStorageService";
import { auth, signInWithGoogle, signOutUser } from "./firebase";

export default function App() {
  const [started, setStarted] = useState(false);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [pulledCard, setPulledCard] = useState(null);
  const [displayCard, setDisplayCard] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [collection, setCollection] = useState([]);
  const [filter, setFilter] = useState("全部");
  const [showAchievement, setShowAchievement] = useState(false);
  const [view, setView] = useState("gacha");
  const [themeColor, setThemeColor] = useState("yellow");
  const audioRef = useRef(null);

  const rarityColors = {
    Common: "#fef9c3",
    Rare: "#fde047",
    Epic: "#facc15",
    Legendary: "#eab308",
    Secret: "#ca8a04",
  };

  const rarityList = ["全部", "Common", "Rare", "Epic", "Legendary", "Secret"];

  useEffect(() => {
    if (username) {
      const saved = loadProgress(username);
      if (saved) setCollection(saved);
    }
  }, [username]);

  const handlePull = () => {
    if (rolling) return;
    setRolling(true);
    setShowAchievement(false);

    let interval = setInterval(() => {
      setDisplayCard(cards[Math.floor(Math.random() * cards.length)]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const finalCard = getRandomCard();
      setPulledCard(finalCard);
      setDisplayCard(finalCard);
      setCollection((prev) => {
        const exists = prev.find((c) => c.name === finalCard.name);
        let updated;
        if (exists) {
          exists.level = Math.min(exists.level + 1, 5);
          updated = [...prev];
        } else {
          updated = [...prev, { ...finalCard, level: 1 }];
        }
        saveProgress(username, updated);
        if (updated.length === cards.length) setShowAchievement(true);
        return updated;
      });
      if (audioRef.current) {
        audioRef.current.src = `/sounds/${finalCard.sound}`;
        audioRef.current.play();
      }
      setRolling(false);
    }, 3000);
  };

  const getRandomCard = () => {
    const pool = cards.flatMap((card) => Array(card.weight).fill(card));
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const filteredCollection =
    filter === "全部" ? collection : collection.filter((c) => c.rarity === filter);

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (result?.user) {
      setUsername(result.user.uid);
      setUserEmail(result.user.email);
      setStarted(true);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUsername("");
    setUserEmail(null);
    setStarted(false);
  };

  const clearCollection = () => {
    setCollection([]);
    saveProgress(username, []);
    alert("图鉴记录已清除。");
  };

  if (!started) {
    return (
      <div style={{ textAlign: "center", paddingTop: "10vh" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#facc15" }}>{t("title")}</h1>
        <button
          onClick={handleGoogleLogin}
          style={{ backgroundColor: "#facc15", padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", color: "#000", fontSize: "1.1rem" }}
        >
          使用 Google 登录
        </button>
        <div style={{ marginTop: "2rem" }}>
          <button onClick={() => setLanguage("zh")}>中文</button>
          <button onClick={() => setLanguage("en")}>English</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "220px", backgroundColor: "#fef08a", padding: "1.5rem" }}>
        <h2 style={{ marginBottom: "1rem", color: "#92400e" }}>{t("title")}</h2>
        {userEmail && <p style={{ fontSize: "0.85rem" }}>👤 {userEmail}</p>}
        <button onClick={() => setView("gacha")} style={{ display: "block", marginBottom: "1rem" }}>🎰 抽卡机</button>
        <button onClick={() => setView("collection")} style={{ display: "block", marginBottom: "1rem" }}>📚 图鉴</button>
        <button onClick={() => setView("settings")} style={{ display: "block", marginBottom: "1rem" }}>⚙️ 设置</button>
        <button onClick={handleSignOut} style={{ display: "block", color: "#dc2626" }}>🔓 登出</button>
      </div>

      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {/* 原内容保留 */}
        {view === "gacha" && (
          <div>
            <h2 style={{ color: "#facc15" }}>抽卡机</h2>
            <button
              onClick={handlePull}
              disabled={rolling}
              style={{ margin: "1rem 0", padding: "0.75rem 2rem", fontSize: "1.1rem", backgroundColor: "#fde047", border: "none", borderRadius: "0.5rem" }}
            >
              {rolling ? "抽卡中..." : "抽卡！"}
            </button>
            <AnimatePresence>
              {displayCard && (
                <motion.div
                  key={displayCard.name + rolling}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    backgroundColor: "white",
                    padding: "1rem",
                    borderRadius: "1rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    textAlign: "center",
                    maxWidth: "300px"
                  }}
                >
                  <img src={displayCard.image} alt={displayCard.name} style={{ width: "250px", borderRadius: "0.5rem" }} />
                  <h3>{displayCard.name}</h3>
                  <p style={{ color: rarityColors[displayCard.rarity] }}>{t(displayCard.rarity)}</p>
                  <p>{displayCard.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {showAchievement && (
              <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#facc15", color: "black" }}>
                🏆 图鉴已全收集！
              </div>
            )}
          </div>
        )}

        {view === "collection" && (
          <div>
            <h2 style={{ color: "#facc15" }}>图鉴</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}>
              {rarityList.map((r) => (
                <option key={r} value={r}>{t(r)}</option>
              ))}
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem" }}>
              {filteredCollection.map((card) => (
                <div key={card.name} style={{ backgroundColor: "white", padding: "0.75rem", borderRadius: "0.5rem", textAlign: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                  <img src={card.image} alt={card.name} style={{ width: "100%" }} />
                  <strong>{card.name}</strong>
                  <p style={{ fontSize: "0.85rem", color: rarityColors[card.rarity] }}>{t(card.rarity)} Lv.{card.level || 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "settings" && (
          <div>
            <h2 style={{ color: "#facc15" }}>设置</h2>
            <div style={{ marginBottom: "1rem" }}>
              <strong>主题颜色切换（开发中）</strong><br />
              <button onClick={() => setThemeColor("yellow")} style={{ marginRight: "0.5rem" }}>💛 黄色</button>
              <button onClick={() => setThemeColor("pink")} disabled>🌸 粉色</button>
              <button onClick={() => setThemeColor("blue")} disabled>🔵 蓝色</button>
            </div>
            <div>
              <button onClick={clearCollection} style={{ backgroundColor: "#f87171", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "0.5rem" }}>清除图鉴记录</button>
            </div>
          </div>
        )}

        <audio ref={audioRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
