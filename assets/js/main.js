document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
    });
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.product-card, section h1, section h2, .category-link');
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Product Filtering logic (index & collections)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const categoryLinks = document.querySelectorAll('.category-link');

  function applyFilter(filterValue) {
    // Update filter buttons if any
    filterBtns.forEach(b => {
      if (b.getAttribute('data-filter') === filterValue) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Update category links if any
    categoryLinks.forEach(link => {
      if (link.getAttribute('data-category') === filterValue) link.classList.add('active');
      else link.classList.remove('active');
    });

    let hasVisible = false;
    productCards.forEach(card => {
      // smooth fade out/in
      card.style.opacity = '0';
      setTimeout(() => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
          hasVisible = true;
        } else {
          card.style.display = 'none';
        }
      }, 300);
    });
  }

  // Initialize filter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category');
  if (initialCategory) {
    applyFilter(initialCategory);
  }

  // Filter Buttons (index.html)
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      applyFilter(filterValue);
      window.history.pushState({}, '', '?category=' + filterValue);
    });
  });

  // Category Links (collections.html)
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const filterValue = link.getAttribute('data-category');
      applyFilter(filterValue);
      window.history.pushState({}, '', '?category=' + filterValue);
      
      const grid = document.querySelector('.product-grid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || 'all';
    applyFilter(category);
  });

  // Language Switcher Placeholder
  const langBtns = document.querySelectorAll('.lang-switcher button');
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!btn.classList.contains('active')) {
        alert('Language switching is coming soon!');
      }
    });
  });
});