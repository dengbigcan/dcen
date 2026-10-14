const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航');
  mobileNav.hidden = true;
  header.classList.remove('menu-open');
};
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? '打开导航' : '关闭导航');
  mobileNav.hidden = expanded;
  header.classList.toggle('menu-open', !expanded);
});
mobileNav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 651px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

const sectors = {
  private: { title: '私宅全案', english: 'PRIVATE RESIDENCES', image: 'private-bedroom', alt: '品牌资料中的私宅卧室与材料应用', description: '以生活为出发点，理解一家人的习惯、审美与空间需求。把规划、设计、材料配置与落地衔接起来，让家成为适合自己的生活平台。', services: ['生活需求与空间规划', '设计深化与品牌材料配置', '落地协调与日常使用关照'] },
  commercial: { title: '商业全案', english: 'COMMERCIAL SPACES', image: 'commercial-space', alt: '品牌资料中的商业空间设计', description: '围绕经营目标，把空间体验与实际投入一起考虑。从前期选址、策划和规划，到设计深化、项目统筹与后期陪伴，以顾问和统筹的角色参与项目。', services: ['前期选址、策划与规划', '空间设计与材料配置', '进度统筹、技术支持与后期陪伴'] },
  wellness: { title: '康养民宿', english: 'WELLNESS RETREATS', image: 'wellness-retreat', alt: '品牌资料中的汉中民宿庭院夜景', description: '以汉中民宿为起点，将对人居体验的关注延伸到自然与旅居。让风景、饮食、触感与身心感受共同构成一段放慢脚步的生活时光。', services: ['自然环境中的休闲旅居体验', '关注感官与日常生活感受', '探索长期交流与合作的更多可能'] },
  stone: { title: '石材矿业', english: 'NATURAL STONE', image: 'quarry', alt: '品牌资料中的石材矿区', description: '以石材经营积累和源头资源为基础，将选材、配套、落地与养护连接起来。关注天然纹理之美，也关注材料在真实空间中的使用方式。', services: ['源头石材资源与选材建议', '加工配套与空间应用', '落地技术支持与后续养护'] },
};
const slides = [
  { key: 'private', title: '精致生活，由此展开。', subtitle: '以设计为核心，让材料与生活相遇。', link: '探索私宅全案' },
  { key: 'commercial', title: '让空间，成就事业。', subtitle: '从策划到统筹，让设计回应经营。', link: '探索商业全案' },
  { key: 'wellness', title: '在自然里，安放身心。', subtitle: '放慢生活的步调，感受日常之外的从容。', link: '探索康养生活' },
  { key: 'stone', title: '源于自然，成于匠心。', subtitle: '从源头选材到空间应用，读懂每一块石头。', link: '探索石材世界' },
];
const backdrops = [...document.querySelectorAll('.hero-backdrop')];
const pagination = [...document.querySelectorAll('.slide-pagination button')];
const heroLink = document.querySelector('.hero-link');
let current = 0;
const showSlide = (index) => {
  current = (index + slides.length) % slides.length;
  backdrops.forEach((image, i) => { image.classList.toggle('is-active', i === current); image.setAttribute('aria-hidden', String(i !== current)); });
  pagination.forEach((button, i) => { button.classList.toggle('is-active', i === current); button.setAttribute('aria-pressed', String(i === current)); });
  document.querySelector('#hero-title').textContent = slides[current].title;
  document.querySelector('.hero-subtitle').textContent = slides[current].subtitle;
  heroLink.dataset.sector = slides[current].key;
  heroLink.replaceChildren(document.createTextNode(slides[current].link + ' '));
  const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); heroLink.append(arrow);
};
pagination.forEach((button, i) => button.addEventListener('click', () => showSlide(i)));
document.querySelector('.previous').addEventListener('click', () => showSlide(current - 1));
document.querySelector('.next').addEventListener('click', () => showSlide(current + 1));

const dialog = document.querySelector('.sector-dialog');
const interest = document.querySelector('#interest');
let dialogTrigger;
const openSector = (key, trigger) => {
  const sector = sectors[key]; if (!sector) return;
  dialogTrigger = trigger;
  const picture = document.querySelector('#dialog-image'); picture.src = `assets/projects/${sector.image}.webp`; picture.alt = sector.alt;
  document.querySelector('#dialog-eyebrow').textContent = sector.english;
  document.querySelector('#sector-dialog-title').textContent = sector.title;
  document.querySelector('#dialog-description').textContent = sector.description;
  document.querySelector('#dialog-services').replaceChildren(...sector.services.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
  document.querySelector('#dialog-contact').dataset.interest = sector.title;
  document.body.classList.add('dialog-open'); dialog.showModal();
};
document.querySelectorAll('[data-sector]').forEach(button => button.addEventListener('click', () => openSector(button.dataset.sector, button)));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); dialogTrigger?.focus({ preventScroll: true }); });
document.querySelectorAll('[data-interest], #dialog-contact').forEach(link => link.addEventListener('click', () => { interest.value = link.dataset.interest; if (dialog.open) dialog.close(); }));
document.querySelector('.inquiry-form').addEventListener('submit', event => event.preventDefault());
