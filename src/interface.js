const soundToggle = document.getElementById('sound-toggle');
const themeToggle = document.getElementById('theme-toggle');
let darkmode = localStorage.getItem('darkmode');
const main = document.querySelector('main');

export default function setUpEventListeners() {
  soundToggle.addEventListener('click', () => {
    main.classList.contains('unmuted') ? main.classList.remove('unmuted') : main.classList.add('unmuted');
  });
  
  themeToggle.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    darkmode === 'active' ? disableDarkMode() : enableDarkMode();
  });

  if (darkmode === 'active') enableDarkMode();
}

function enableDarkMode() {
  main.classList.add('dark-mode');
  localStorage.setItem('darkmode', 'active');
}

function disableDarkMode() {
  main.classList.remove('dark-mode');
  localStorage.setItem('darkmode', 'inactive');
}