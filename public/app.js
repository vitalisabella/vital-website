// Tab notifications
let tabTitle = document.title;
let notificationIndex = 0;
const notifications = [
  'Come back to VITAL...',
  'We miss you...',
  'New updates waiting...',
  'Join us!'
];

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    const interval = setInterval(() => {
      if (!document.hidden) {
        clearInterval(interval);
        document.title = tabTitle;
      } else {
        notificationIndex = (notificationIndex + 1) % notifications.length;
        document.title = notifications[notificationIndex] + ' | VITAL';
      }
    }, 3000);
  } else {
    document.title = tabTitle;
  }
});

// Set active nav link
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '/' && link.getAttribute('href') === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
