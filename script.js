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
}

function render(games) {
  const container = document.getElementById('gallery');
  games.forEach(game => {
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
    container.appendChild(card);
  });
}

init();
