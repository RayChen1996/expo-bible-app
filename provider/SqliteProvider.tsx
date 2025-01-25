import { type SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { PropsWithChildren } from "react";
export default function SqliteProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider
      databaseName="bibles"
      onInit={migrateDbIfNeeded}
      // assetSource={{ assetId: require("./assets/bible.db") }}
    >
      {children}
    </SQLiteProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 5; // 資料庫版本
  let result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = result ? result.user_version : 0;

  console.log("currentDbVersion", currentDbVersion);
  // if (currentDbVersion >= DATABASE_VERSION) {
  //   console.log("Database is up-to-date.");
  //   return;
  // }

  if (currentDbVersion > 0 && currentDbVersion < DATABASE_VERSION) {
    console.log("Initializing Bible database...");
    console.log("Creating tables...創建tables");

    // 創建儲存聖經經文的資料表
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      DROP TABLE IF EXISTS scriptures;
      CREATE TABLE scriptures (
      id INTEGER PRIMARY KEY NOT NULL, 
      book TEXT NOT NULL, -- 書名 (例如：Genesis)
      chapter INTEGER NOT NULL, -- 章
      verse INTEGER NOT NULL, -- 節
      content TEXT NOT NULL, -- 經文內容
      date_added TEXT NOT NULL, -- 新增日期 (格式: YYYY-MM-DD)
      read_count INTEGER NOT NULL DEFAULT 0 -- 閱讀次數 (初始為 0)
      );
    `);

    // 插入範例經文
    const currentDate = new Date().toISOString().split("T")[0]; // 取得當前日期 (YYYY-MM-DD)
    await db.runAsync(
      "INSERT INTO scriptures (book, chapter, verse, content, date_added, read_count) VALUES (?, ?, ?, ?, ?, ?)",
      "Genesis", // 書名：創世記
      1, // 章：第 1 章
      1, // 節：第 1 節
      "In the beginning God created the heavens and the earth.", // 經文內容
      currentDate, // 新增日期
      0 // 閱讀次數
    );

    await db.runAsync(
      "INSERT INTO scriptures (book, chapter, verse, content, date_added, read_count) VALUES (?, ?, ?, ?, ?, ?)",
      "Genesis",
      1,
      2,
      "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
      currentDate,
      0
    );

    console.log("Bible database initialized with sample data.");
    currentDbVersion = 1;
  }

  // 更新資料庫版本
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
