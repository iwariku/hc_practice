"use strict";

// --- コードの構成 ---
// カレンダーを生成する関数
// メイン実行ブロック

// --- カレンダーを生成する関数 ---
const createCalendarMatrix = (year, month) => {
  // CLIから入力された月の最初の日にちをfirstDayOfMonthに格納
  const firstDayOfMonth = new Date(year, month - 1, 1);
  // CLIから入力された月の最後の日にちをlastDayOfMonthに格納
  const lastDayOfMonth = new Date(year, month, 0);
  // CLIから入力された月の最終日を格納
  const lastDay = lastDayOfMonth.getDate();
  // 月始めの日の曜日を取得
  const startDayOfWeek = firstDayOfMonth.getDay();

  // 日にちを格納するための1次元配列の作成。カレンダー表示するための2次元配列で使う
  const calendarData = [];

  // 指定した月の日付以外を空白にする
  // (例)カレンダーでは先月の最後の週(30日,31日など)も含まれてしまうので、そちらを空白にする
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarData.push("");
  }

  // 日付を配列に追加していく。
  for (let day = 1; day <= lastDay; day++) {
    calendarData.push(day);
  }

  // 1次元配列を2次元配列に変換する
  // カレンダーの見た目で表示するためには2次元配列にする必要がある
  const calendarMatrix = [];

  // calendarDataの分(指定した月の日数分)繰り返す
  for (let i = 0; i < calendarData.length; i++) {
    // もし繰り返しの要素数が7の倍数になったら、2次元配列に空配列を作成
    // 7の倍数になったら空配列を作成する理由は、1週間日付を入れたら、次の週に改行されて表示されて欲しいから
    if (i % 7 === 0) {
      calendarMatrix.push([]);
    }
    // calendarMatrixの中で最後に準備された配列(現在の週)にcalendarDataの要素を追加していく
    // 7日分追加したら、上のif文が作動し、新しい配列(次の週)が作成され、同じ処理を行う
    calendarMatrix[calendarMatrix.length - 1].push(calendarData[i]);
  }

  // 完成したカレンダー構造を返す(2次元配列)
  return calendarMatrix;
};

// --- メイン実行ブロック ---

// 1. コマンドラインから取得したい月を取得
const args = process.argv.slice(3);
const monthInput = args[0];
let targetMonth;

if (!monthInput) {
  // 引数がない場合、現在の月を使用し、後続の処理に進む
  targetMonth = new Date().getMonth() + 1;
} else {
  // 引数がある場合、数値として変換する
  targetMonth = parseInt(monthInput);
}

// targetMonthがNan、または 1 ~ 12 の範囲外であれば、エラーとして即座に終了
if (isNaN(targetMonth) || targetMonth < 1 || targetMonth > 12) {
  let errorMessage = "";

  if (isNaN(targetMonth)) {
    // 'abc' や '-'などのparseInt()で数値に変換できない文字が入力された場合
    errorMessage =
      "エラー: 月の指定が無効です。1から12の範囲の数値を入力してください";
  } else {
    // 1 ~ 12以外が入力された場合
    errorMessage = `エラー: ${targetMonth}は無効な月です。1から12の範囲で指定してください`;
  }

  console.error(errorMessage);
  process.exit(1);
}

const now = new Date();
const targetYear = now.getFullYear();

// カレンダー生成
const calendarMatrix = createCalendarMatrix(targetYear, targetMonth);

// カレンダーを表示
console.log(`      ${targetMonth}月 ${targetYear}`);
console.log("日 月 火 水 木 金 土");

for (const week of calendarMatrix) {
  let weekString = "";

  for (const item of week) {
    // itemが数値の場合は' 1'のように整形し、空白の場合は'  'と整形される
    const formattedItem = String(item).padStart(2, " ");

    weekString += formattedItem + " ";
  }
  console.log(weekString);
}
