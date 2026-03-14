const soundToggle = document.getElementById('sound-toggle');
const themeToggle = document.getElementById('theme-toggle');
const main = document.querySelector('main');

export default function setUpEventListeners() {
  soundToggle.addEventListener('click', () => {
    main.classList.contains('unmuted') ? main.classList.remove('unmuted') : main.classList.add('unmuted');
  });
  
  themeToggle.addEventListener('click', () => {
    main.classList.contains('dark-mode') ? main.classList.remove('dark-mode') : main.classList.add('dark-mode');
  })
}
