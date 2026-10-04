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

// ---- New Features Added ----
document.addEventListener('DOMContentLoaded', () => {
  // Wishlist functionality
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const countEl = document.getElementById('wishlist-count');
  
  const updateWishlistUI = () => {
    if(countEl) countEl.textContent = favorites.length;
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const id = btn.dataset.id;
      if (favorites.includes(id)) {
        btn.textContent = '♥';
        btn.style.color = '#dc2626';
      } else {
        btn.textContent = '♡';
        btn.style.color = '#000';
      }
    });
  };
  
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // In case it's inside an <a>
      e.stopPropagation();
      const id = btn.dataset.id;
      if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
      } else {
        favorites.push(id);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
      updateWishlistUI();
    });
  });
  
  updateWishlistUI();

  // FAQ Accordion
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isHidden = content.style.display === 'none' || content.style.display === '';
      content.style.display = isHidden ? 'block' : 'none';
      btn.querySelector('span').textContent = isHidden ? '-' : '+';
    });
  });

  // Collections Filtering & Sorting & Live Search
  const grid = document.querySelector('.product-grid');
  if (grid) {
    const searchInput = document.getElementById('search-input');
    const catFilter = document.getElementById('category-filter');
    const matFilter = document.getElementById('material-filter');
    const priceSort = document.getElementById('price-sort');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    
    let cards = Array.from(grid.querySelectorAll('.product-card'));
    
    const filterAndSort = () => {
      const q = searchInput ? searchInput.value.toLowerCase() : '';
      const cat = catFilter ? catFilter.value : 'all';
      const mat = matFilter ? matFilter.value : 'all';
      const sort = priceSort ? priceSort.value : 'none';
      
      const isFavView = new URLSearchParams(window.location.search).get('favorites') === '1';

      let visibleCards = [];

      cards.forEach(card => {
        const titleEl = card.querySelector('.product-title') || card.querySelector('h3');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const category = card.dataset.category || 'all';
        const material = card.dataset.material || 'all';
        const id = card.dataset.id;
        
        let match = title.includes(q);
        if (cat !== 'all' && category !== cat) match = false;
        if (mat !== 'all' && material !== mat) match = false;
        if (isFavView && !favorites.includes(id)) match = false;
        
        if (match) {
          card.style.display = '';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });
      
      if (sort !== 'none') {
        visibleCards.sort((a, b) => {
          const pa = parseInt(a.dataset.price || '0');
          const pb = parseInt(b.dataset.price || '0');
          return sort === 'low' ? pa - pb : pb - pa;
        });
        visibleCards.forEach(c => grid.appendChild(c));
      }
      
      // Update breadcrumb
      if (breadcrumbCurrent && catFilter) {
          const selectedOption = catFilter.options[catFilter.selectedIndex];
          breadcrumbCurrent.textContent = isFavView ? "Mes Favoris" : selectedOption.textContent;
      }
    };

    if (searchInput) searchInput.addEventListener('input', filterAndSort);
    if (catFilter) catFilter.addEventListener('change', filterAndSort);
    if (matFilter) matFilter.addEventListener('change', filterAndSort);
    if (priceSort) priceSort.addEventListener('change', filterAndSort);

    // Initialize from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category') && catFilter) {
        catFilter.value = urlParams.get('category');
    }
    
    if (urlParams.get('favorites') === '1') {
        const h1 = document.querySelector('h1');
        if (h1) h1.textContent = "Mes Favoris";
    }
    
    filterAndSort();
  }
});

// ---- Product Page Dynamic Data ----
document.addEventListener('DOMContentLoaded', () => {
    const catalog = {
        'p1': {
            title: "Canapé Modulable 'Sahara'",
            price: "120 000 DA",
            desc: "Un canapé spacieux et confortable avec revêtement anti-tâches, parfait pour votre salon. Structure en bois massif, assises en mousse haute résilience.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 240, h: 85, d: 95 }
        },
        'p2': {
            title: "Lit King Size 'Atlas'",
            price: "220 000 DA",
            desc: "Tête de lit en velours et sommier robuste avec rangement intégré.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 200, h: 120, d: 210 }
        },
        'p3': {
            title: "Table À Manger 'Oran'",
            price: "150 000 DA",
            desc: "Table en noyer massif pour 8 personnes avec chaises assorties.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle à manger",
            dims: { w: 220, h: 75, d: 100 }
        },
        'p4': {
            title: "Fauteuil d'Accent 'Zian'",
            price: "35 000 DA",
            desc: "Fauteuil contemporain avec pieds en métal noir.",
            img: "assets/img/salon-2.jpg",
            cat: "Salon",
            dims: { w: 80, h: 90, d: 85 }
        },
        'p5': {
            title: "Commode 'Nocturne'",
            price: "85 000 DA",
            desc: "Commode à 6 tiroirs avec finition mate élégante.",
            img: "assets/img/chambre-2.jpg",
            cat: "Chambre",
            dims: { w: 120, h: 90, d: 45 }
        },
        'p6': {
            title: "Table Basse 'Touareg'",
            price: "45 000 DA",
            desc: "Table basse en bois massif et verre trempé.",
            img: "assets/img/salon-1.jpg", // fallback image
            cat: "Salon",
            dims: { w: 100, h: 45, d: 60 }
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('id');
    
    if (pid && catalog[pid] && window.location.pathname.includes('product.html')) {
        const p = catalog[pid];
        
        // Update title and desc
        const titleEl = document.querySelector('.product-title');
        if (titleEl) titleEl.textContent = p.title;
        document.title = p.title + " | Domicile";
        
        const priceEl = document.querySelector('.product-price');
        if (priceEl) priceEl.textContent = p.price;
        
        // description is usually next sibling of price or just a p tag in the container
        const descEl = document.querySelector('h2.product-title').nextElementSibling.nextElementSibling;
        if (descEl && descEl.tagName.toLowerCase() === 'p') {
            descEl.textContent = p.desc;
        }

        // Update image
        const imgEl = document.getElementById('main-product-img');
        if (imgEl) imgEl.src = p.img;
        
        // Update gallery (just reuse the same img since we don't have multiple real ones)
        const thumbs = document.querySelectorAll('.thumbnail-gallery img');
        if (thumbs.length > 0) thumbs[0].src = p.img;
        
        // Update WhatsApp
        const waBtn = document.querySelector('a.btn[href*="wa.me"]');
        if (waBtn) {
            const msg = encodeURIComponent("Bonjour, je suis intéressé(e) par le " + p.title + ".");
            waBtn.href = "https://wa.me/213555000000?text=" + msg;
        }

        // Update breadcrumb
        const bcSpans = document.querySelectorAll('.breadcrumbs span');
        if (bcSpans.length > 0) {
            bcSpans[bcSpans.length - 1].textContent = p.title;
        }
        
        // Update dimensions table
        const tds = document.querySelectorAll('.dimensions-table td');
        if (tds.length === 3) {
            tds[0].textContent = p.dims.w;
            tds[1].textContent = p.dims.h;
            tds[2].textContent = p.dims.d;
        }
    }
});
