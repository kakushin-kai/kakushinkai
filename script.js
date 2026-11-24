const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.querySelector('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletterMessage').textContent='Bienvenue dans le clan ! Connecte ce formulaire à Brevo ou Mailchimp pour enregistrer les inscriptions.';e.target.reset()});document.querySelector('#contactForm').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#contactMessage').textContent='Message prêt. Connecte Formspree, Netlify Forms ou ton serveur pour activer l’envoi.'});

// Synchronisation automatique des épisodes depuis le flux RSS Kakushin Kaï.
const RSS_URL = 'https://anchor.fm/s/fe4329e4/podcast/rss';
const RSS_API = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(RSS_URL);
const episodeList = document.querySelector('#episodeList');
const rssStatus = document.querySelector('#rssStatus');

function cleanText(value = '') {
  const doc = new DOMParser().parseFromString(value, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}
function truncate(value, max = 165) {
  const text = cleanText(value);
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, '') + '…' : text;
}
function formatDate(value) {
  const date = new Date(value.replace(' ', 'T') + 'Z');
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {day:'numeric', month:'short', year:'numeric'}).format(date).replace('.', '').toUpperCase();
}
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
function episodeLink(item) {
  return item.link || 'https://open.spotify.com/show/1hO1Onyv7K7K0gAh8rtk2K?si=e15c232742074ccc';
}
function audioUrl(item) {
  if (item.enclosure && item.enclosure.link) return item.enclosure.link;
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  if (item.guid && /\.(mp3|m4a)(\?|$)/i.test(item.guid)) return item.guid;
  return '';
}
function renderEpisodes(items) {
  episodeList.innerHTML = items.slice(0, 3).map((item, index) => {
    const title = cleanText(item.title) || 'Nouvel épisode';
    const description = truncate(item.description || item.content || 'Découvre le nouvel épisode de La Capsule d’Orphen.');
    const date = formatDate(item.pubDate);
    const label = index === 0 ? `NOUVEAU${date ? ' • ' + date : ''}` : date;
    const audio = audioUrl(item);
    const player = audio
      ? `<audio class="podcast-player" controls preload="metadata"><source src="${escapeHtml(audio)}" type="audio/mpeg">Ton navigateur ne prend pas en charge la lecture audio.</audio>`
      : `<a class="listen-fallback" href="${escapeHtml(episodeLink(item))}" target="_blank" rel="noopener">ÉCOUTER L’ÉPISODE ↗</a>`;
    return `<article class="episode ${index === 0 ? 'featured ' : ''}reveal visible">
      <div class="episode-index">${String(index + 1).padStart(2, '0')}</div>
      <div class="episode-main"><span class="pill">${escapeHtml(label)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p>${player}</div>
    </article>`;
  }).join('');
  document.querySelectorAll('.podcast-player').forEach(player => {
    player.addEventListener('play', () => {
      document.querySelectorAll('.podcast-player').forEach(other => { if (other !== player) other.pause(); });
    });
  });
}
async function updateEpisodes() {
  try {
    const response = await fetch(RSS_API + '&_=' + Date.now(), {cache: 'no-store'});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (data.status !== 'ok' || !Array.isArray(data.items) || !data.items.length) throw new Error('Flux vide');
    const items = [...data.items].sort((a,b) => new Date(b.pubDate) - new Date(a.pubDate));
    renderEpisodes(items);
    rssStatus.textContent = `Mis à jour automatiquement • ${items.length} épisode${items.length > 1 ? 's' : ''} détecté${items.length > 1 ? 's' : ''} dans le flux RSS.`;
  } catch (error) {
    rssStatus.textContent = 'La synchronisation automatique est temporairement indisponible. Utilise Spotify, Apple Podcasts ou le flux RSS ci-dessous.';
    episodeList.innerHTML = `<article class="episode featured reveal visible"><div class="episode-index">!</div><div><span class="pill">PODCAST</span><h3>Retrouve les derniers épisodes sur Spotify</h3><p>Le flux n’a pas pu être chargé pour le moment.</p></div><span class="duration">EN LIGNE</span><a class="play" href="https://open.spotify.com/show/1hO1Onyv7K7K0gAh8rtk2K?si=e15c232742074ccc" target="_blank" rel="noopener" aria-label="Ouvrir Spotify">▶</a></article>`;
    console.warn('Synchronisation RSS impossible :', error);
  }
}
updateEpisodes();
