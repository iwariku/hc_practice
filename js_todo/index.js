"use strict";

const todoInput = document.getElementById("text");
const saveButton = document.getElementById("save");
const todoList = [];

const incompleteTodosContainer = document.getElementById("incomplete-todos");
const completedTodosContainer = document.getElementById("completed-todos");

const allCountElement = document.getElementById("all-count");
const completedCountElement = document.getElementById("completed-count");
const incompleteCountElement = document.getElementById("incomplete-count");

// --- 編集ボタンの作成 ---
const createEditButton = (index) => {
  const editButton = document.createElement("button");
  editButton.textContent = "編集";

  // DOMにインデックスを記録する
  editButton.dataset.index = index;

  editButton.addEventListener("click", (e) => {
    const listItem = e.target.parentElement;
    listItem.innerHTML = "";

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todoList[index].text;

    const saveEditButton = document.createElement("button");
    saveEditButton.textContent = "保存";

    listItem.appendChild(editInput);
    listItem.appendChild(saveEditButton);

    // 編集状態で出現する保存ボタンのロジック。上書きという役割を与えるため
    saveEditButton.addEventListener("click", () => {
      const newText = editInput.value;

      todoList[index].text = newText;

      renderTodos();
    });
  });
  return editButton;
};

// --- 削除ボタンの作成 ---
const createDeleteButton = (index) => {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";

  // DOMにインデックスを記録する
  deleteButton.dataset.index = index;

  deleteButton.addEventListener("click", () => {
    if (window.confirm("本当に削除してもよろしいですか?")) {
      todoList.splice(index, 1);

      renderTodos();
    }
  });
  return deleteButton;
};

// --- チェックボックスの作成 ---
const createCheckbox = (todo, index) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;

  checkbox.addEventListener("change", (e) => {
    todoList[index].completed = e.target.checked;
    renderTodos();
  });
  return checkbox;
};

const createListItem = (todo, index) => {
  const listItem = document.createElement("li");
  const todoTextSpan = document.createElement("span");
  todoTextSpan.textContent = todo.text;

  const checkbox = createCheckbox(todo, index);
  const editButton = createEditButton(index);
  const deleteButton = createDeleteButton(index);

  listItem.appendChild(checkbox);
  listItem.appendChild(todoTextSpan);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

// 配列全体を表示する関数
const renderTodos = () => {
  // リセット処理
  completedTodosContainer.innerHTML = "";
  incompleteTodosContainer.innerHTML = "";

  // カウント関数ロジック
  const totalCount = todoList.length;

  // 完了済みのタスクを計算
  const completedCount = todoList.filter(
    (todo) => todo.completed === true
  ).length;

  // 未完了のタスクを計算
  const incompleteCount = totalCount - completedCount;

  // カウンター要素を値にセット
  allCountElement.textContent = totalCount;
  completedCountElement.textContent = completedCount;
  incompleteCountElement.textContent = incompleteCount;

  for (let i = 0; i < todoList.length; i++) {
    const listItem = createListItem(todoList[i], i);

    // 完了か未完了かを見て、コンテナに追加
    if (todoList[i].completed) {
      completedTodosContainer.appendChild(listItem);
    } else {
      incompleteTodosContainer.appendChild(listItem);
    }
  }
};

// 保存ボタンが押された時に以下が呼び出される
saveButton.addEventListener("click", (e) => {
  // ブラウザの標準操作をキャンセルするコード。
  // これをする事で、保存したのに、別のリロードが働いて、追加できなかったという状況を防ぐことができる
  e.preventDefault();

  // 入力値を取得
  const newItemText = todoInput.value;

  // Todoアイテムを「オブジェクトとして作成」
  const newTodoObject = {
    text: newItemText,
    completed: false,
  };

  // オブジェクトをtodoListに追加
  todoList.push(newTodoObject);

  renderTodos();
  console.log("現在のTodoリスト", todoList);
});
