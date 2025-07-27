const ratingFiles = [1, 2, 3, 4, 5];
const koopaImg = 'https://cdn.discordapp.com/emojis/964397863910117396.webp?size=44';

async function loadCSV(file, rating) {
  const res = await fetch(file);
  const text = await res.text();
  const rows = text.trim().split(/\r?\n/).slice(1);
  return rows
    .filter(r => r.trim())
    .map(row => {
      const [name, image_url, comment] = row
        .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
        .map(x => x.replace(/^\"|\"$/g, '').trim());
      return { name, image_url, comment, rating };
    });
}

async function init() {
  const allGames = [];
  for (let i of ratingFiles) {
    const games = await loadCSV(`rating_${i}.csv`, i);
    allGames.push(...games);
  }
  render(allGames);
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', () => {
    filterGames(searchInput.value.toLowerCase());
  });
}

function render(games) {
  const container = document.getElementById('gallery');
  container.innerHTML = '';
  const groups = {};
  games.forEach(g => {
    (groups[g.rating] = groups[g.rating] || []).push(g);
  });

  for (let rating of ratingFiles) {
    const section = document.createElement('div');
    section.className = 'section';

    const header = document.createElement('h2');
    header.className = 'section-header';
    header.textContent = `${rating} Star${rating > 1 ? 's' : ''}`;
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '▼';
    header.appendChild(arrow);
    header.addEventListener('click', () => {
      section.classList.toggle('collapsed');
      arrow.textContent = section.classList.contains('collapsed') ? '▶' : '▼';
    });

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards';
    (groups[rating] || []).forEach(game => {
      const card = createCard(game);
      cardsContainer.appendChild(card);
    });

    section.appendChild(header);
    section.appendChild(cardsContainer);
    container.appendChild(section);
  }
}

function createCard(game) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.backgroundImage = `url('${game.image_url}')`;

  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = game.name;

  const comment = document.createElement('div');
  comment.className = 'comment';
  comment.textContent = game.comment;

  const koopa = document.createElement('div');
  koopa.className = 'koopa';
  for (let i = 0; i < game.rating; i++) {
    const img = document.createElement('img');
    img.src = koopaImg;
    img.alt = 'Koopa';
    img.loading = 'lazy';
    koopa.appendChild(img);
  }

  overlay.appendChild(title);
  overlay.appendChild(comment);
  card.appendChild(overlay);
  card.appendChild(koopa);
  return card;
}

function filterGames(query) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    let visible = 0;
    const cards = section.querySelectorAll('.card');
    cards.forEach(card => {
      const name = card.querySelector('.title').textContent.toLowerCase();
      const comment = card.querySelector('.comment').textContent.toLowerCase();
      const match = name.includes(query) || comment.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    section.style.display = visible > 0 ? '' : 'none';
  });
}

init();
