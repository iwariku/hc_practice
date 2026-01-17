package main

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type User struct {
	Age  int    `json:"age"`
	Name string `json:"name"`
	Role string `json:"role"`
}

type LogEntry struct {
	User User `json:"user"`
}

// PostgreSQLの設定情報,Docker-compose.yamlに記述してある。
const (
	user     = "root"
	password = "root"
	db       = "testdb"
	port     = "5432"
)

func main() {

	// 第二引数がない場合、多い場合
	if len(os.Args) != 2 {
		log.Fatal("エラー： ログファイルを1つ指定してください")
	}

	//DB接続
	dsn := fmt.Sprintf("user=%s password=%s dbname=%s port=%s sslmode=disable", user, password, db, port)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("DB設定に失敗しました: ", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("DBへの接続処理に失敗しました: ", err)
	}

	// テーブル準備
	createTableSQL :=
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			age INTEGER,
			name VARCHAR(500),
			role VARCHAR(15)
		);`
	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatal("テーブル作成に失敗しました: ", err)
	}

	// 第二引数に渡されたファイルを開く
	inputFile, err := os.Open(os.Args[1])
	if err != nil {
		log.Fatal("ファイルが開けません: ", err)
	}
	defer inputFile.Close()

	// トランザクション処理の開始
	tx, err := db.Begin()
	if err != nil {
		log.Fatal("トランザクション処理の開始に失敗しました", err)
	}
	defer tx.Rollback()

	// データの挿入
	insertQuery := "INSERT INTO users (age, name, role) VALUES ($1,$2,$3)"
	scanner := bufio.NewScanner(inputFile)
	for scanner.Scan() {
		var entry LogEntry
		// entryの中身が書き換わると同時に、成否の結果がerrに入る
		err := json.Unmarshal(scanner.Bytes(), &entry)
		if err != nil {
			// 変換に失敗などの(JSONに問題がある？)ときの処理
			log.Fatal("JSON変換エラーが発生したため、全処理を中止します: ", err)
		}

		_, err = tx.Exec(insertQuery, entry.User.Age, entry.User.Name, entry.User.Role)
		if err != nil {
			log.Fatal("データの挿入に失敗したため、全処理を中止します: ", err)
		}
	}

	//ファイルの読み取りの際に、osやハードウェアレベルの「何か」が原因でエラーが出た時のエラーハンドリング
	err = scanner.Err()
	if err != nil {
		log.Fatal("ファイルの読み込み中にエラーが発生しました: ", err)
	}

	// すべて成功したらコミット
	err = tx.Commit()
	if err != nil {
		log.Fatal("コミットに失敗しました: ", err)
	}

	fmt.Println("データの挿入が完了しました")
}
