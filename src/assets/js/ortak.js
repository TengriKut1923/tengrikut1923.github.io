document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'eager');
    }
    if (!img.hasAttribute('title')) {
      const altText = img.getAttribute('alt') || 'Image';
      img.setAttribute('title', altText);
    }
  });
}); 

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const scrollTopButton = document.getElementById('scrollTopButton');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollTopButton.style.display = 'flex';
            } else {
                scrollTopButton.style.display = 'none';
            }
        });

const footerHTML = `
  <footer class="footer">
    <div class="footer-links">
      <a href="https://git.tengrikut1923.com/yazışmalık" class="footer-icons" title="Yazışmalık"><i class="fa-solid fa-comment-dots"></i><span class="footer-hidden-text">.</span></a>
      <a href="https://tengrikut1923.com/b/dad32" class="footer-icons" title="DAD32"><i class="fa-solid fa-key"></i><span class="footer-hidden-text">.</span></a>
      <a href="https://git.tengrikut1923.com/betiklik" class="footer-icons" title="Betiklik"><i class="fa-solid fa-feather-pointed"></i><span class="footer-hidden-text">.</span></a>
      <a href="https://tengrikut1923.com/b/sss" class="footer-icons" title="SSS"><i class="fa-solid fa-bolt-lightning"></i><span class="footer-hidden-text">.</span></a>
      <a href="https://git.tengrikut1923.com/bağış" class="footer-icons" title="Bağış"><i class="fa-regular fa-gem"></i><span class="footer-hidden-text">.</span></a>
      <a href="https://tengrikut1923.com/b/git" class="footer-icons" title="Git"><i class="fa-solid fa-link"></i><span class="footer-hidden-text">.</span></a>
    </div>
    <p class="footer-text"><a href="https://tengrikut1923.com/b/git" title="Mengü Tengri'nin gücüyle... Eskiden beri neysek sonsuza dek oyuz!">:𐰢𐰤𐰏𐰇:𐱅𐰭𐰼𐰃𐰤𐰤:𐰏𐰇𐰲𐰘𐰠𐰀:𐰾𐰚𐰓𐰤:𐰋𐰃𐰼𐰃:𐰤𐰘𐰾𐰚:𐰽𐰆𐰭𐰽𐰔𐰀:𐰓𐰚:𐰆𐰖𐰔</a></p>
  </footer>
`;

document.body.insertAdjacentHTML('beforeend', footerHTML);
