const fetchAndDisplay = async (endpointSlug) => {
  const API_BASE_URL = 'https://ihatov08.github.io/kimetsu_api/api/';
  const IMAGE_BASE_URL = 'https://ihatov08.github.io';

  const API_URL = API_BASE_URL + endpointSlug;
  const listContainer = document.getElementById('kimetsuList');
  const loadingIndicator = document.getElementById('loadingIndicator');

  // リストを更新する前に、古いリストの中身を空にする
  loadingIndicator.style.display = 'block';
  listContainer.innerHTML = '';

  const data = await fetch(API_URL);
  const characters = await data.json();

  loadingIndicator.style.display = 'none';

  characters.forEach((character) => {
    const listItem = document.createElement('li');

    const nameText = document.createElement('p');
    nameText.textContent = `名前: ${character.name}`;

    const charImage = document.createElement('img');
    charImage.src = IMAGE_BASE_URL + character.image;

    const categoryText = document.createElement('p');
    categoryText.textContent = `カテゴリー: ${character.category}`;

    listItem.appendChild(nameText);
    listItem.appendChild(charImage);
    listItem.appendChild(categoryText);

    listContainer.appendChild(listItem);
  });
};

const init = () => {
  const filterContainer = document.getElementById('filterOptions');

  filterContainer.addEventListener('change', (event) => {
    if (event.target.matches('input[type=radio]')) {
      const selectedSlug = event.target.value;
      fetchAndDisplay(selectedSlug);
    }
  });

  fetchAndDisplay('all.json');
};

init();
