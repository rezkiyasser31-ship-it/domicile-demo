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
    
        const stockFilter = document.getElementById('stock-filter');
    const emptyState = document.getElementById('empty-state');

    const filterAndSort = (pushState = true) => {
      const q = searchInput ? searchInput.value.toLowerCase() : '';
      const cat = catFilter ? catFilter.value : 'all';
      const mat = matFilter ? matFilter.value : 'all';
      const stock = stockFilter ? stockFilter.value : 'all';
      const sort = priceSort ? priceSort.value : 'none';
      
      const params = new URLSearchParams(window.location.search);
      const isFavView = params.get('favorites') === '1';

      if (pushState && !isFavView) {
        const newUrl = new URL(window.location);
        if (cat !== 'all') newUrl.searchParams.set('cat', cat); else newUrl.searchParams.delete('cat');
        if (stock !== 'all') newUrl.searchParams.set('stock', stock); else newUrl.searchParams.delete('stock');
        if (sort !== 'none') newUrl.searchParams.set('sort', sort); else newUrl.searchParams.delete('sort');
        window.history.replaceState({}, '', newUrl);
      }

      let visibleCards = [];

      cards.forEach(card => {
        const titleEl = card.querySelector('.product-title') || card.querySelector('h3');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const category = card.dataset.category || 'all';
        const material = card.dataset.material || 'all';
        const itemStock = parseInt(card.dataset.stock || '0');
        const id = card.dataset.id;
        
        let match = title.includes(q);
        if (cat !== 'all' && category !== cat) match = false;
        if (mat !== 'all' && material !== mat) match = false;
        if (stock === 'in' && itemStock <= 0) match = false;
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
          if (sort === 'name-az') {
             const titleA = a.querySelector('.product-title') ? a.querySelector('.product-title').textContent : '';
             const titleB = b.querySelector('.product-title') ? b.querySelector('.product-title').textContent : '';
             return titleA.localeCompare(titleB);
          }
          const pa = parseInt(a.dataset.price || '0');
          const pb = parseInt(b.dataset.price || '0');
          return sort === 'low' ? pa - pb : pb - pa;
        });
        visibleCards.forEach(c => grid.appendChild(c));
      }
      
      if (emptyState) {
        emptyState.style.display = visibleCards.length === 0 ? 'block' : 'none';
      }

      // Update breadcrumb
      if (breadcrumbCurrent && catFilter) {
          const selectedOption = catFilter.options[catFilter.selectedIndex];
          breadcrumbCurrent.setAttribute('data-i18n', isFavView ? 'nav_favorites' : selectedOption.getAttribute('data-i18n') || 'filter_all_cats');
      }
    };

    if (searchInput) searchInput.addEventListener('input', () => filterAndSort());
    if (catFilter) catFilter.addEventListener('change', () => filterAndSort());
    if (matFilter) matFilter.addEventListener('change', () => filterAndSort());
    if (stockFilter) stockFilter.addEventListener('change', () => filterAndSort());
    if (priceSort) priceSort.addEventListener('change', () => filterAndSort());

    // Initialize from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category') && catFilter) {
        catFilter.value = urlParams.get('category');
    }
    if (urlParams.get('cat') && catFilter) {
        catFilter.value = urlParams.get('cat');
    }
    if (urlParams.get('stock') && stockFilter) {
        stockFilter.value = urlParams.get('stock');
    }
    if (urlParams.get('sort') && priceSort) {
        priceSort.value = urlParams.get('sort');
    }
    
    if (urlParams.get('favorites') === '1') {
        const h1 = document.querySelector('h1');
        if (h1) h1.setAttribute('data-i18n', 'nav_favorites');
    }
    
    window.addEventListener('popstate', () => {
        const p = new URLSearchParams(window.location.search);
        if (catFilter) catFilter.value = p.get('cat') || 'all';
        if (stockFilter) stockFilter.value = p.get('stock') || 'all';
        if (priceSort) priceSort.value = p.get('sort') || 'none';
        filterAndSort(false);
    });

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
            dims: { w: 240, h: 85, d: 95 },
            stock: 3
        }, title_key: "str_20", desc_key: "str_30", price_key: "price_120k",
        'p2': {
            title: "Lit King Size 'Atlas'",
            price: "220 000 DA",
            desc: "Tête de lit en velours et sommier robuste avec rangement intégré.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 200, h: 120, d: 210 },
            stock: 2
        }, title_key: "str_107", desc_key: "str_117", price_key: "price_220k",
        'p3': {
            title: "Table A Manger 'Oran'",
            price: "150 000 DA",
            desc: "Table en noyer massif pour 8 personnes avec chaises assorties.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 220, h: 75, d: 100 },
            stock: 8
        }, title_key: "str_57", desc_key: "str_67", price_key: "price_150k",
        'p4': {
            title: "Fauteuil d'Accent 'Zian'",
            price: "35 000 DA",
            desc: "Fauteuil contemporain avec pieds en métal noir.",
            img: "assets/img/salon-2.jpg",
            cat: "Salon",
            dims: { w: 80, h: 90, d: 85 },
            stock: 12
        }, title_key: "str_38", desc_key: "str_24", price_key: "price_35k",
        'p5': {
            title: "Commode 'Nocturne'",
            price: "85 000 DA",
            desc: "Commode à 6 tiroirs avec finition mate élégante.",
            img: "assets/img/chambre-2.jpg",
            cat: "Chambre",
            dims: { w: 120, h: 90, d: 45 },
            stock: 0
        }, title_key: "str_105", desc_key: "str_88", price_key: "price_85k",
        'p6': {
            title: "Table Basse 'Touareg'",
            price: "45 000 DA",
            desc: "Table basse en bois massif et verre trempé.",
            img: "assets/img/salon-1.jpg", // fallback image
            cat: "Salon",
            dims: { w: 100, h: 45, d: 60 },
            stock: 7
        }, title_key: "str_100", desc_key: "str_125", price_key: "price_95k"
    ,
        'p7': {
            title: "Table Basse Carthage",
            price: "38000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en bois.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 6
        }, title_key: "str_new_7_t", desc_key: "str_new_7_d", price_key: "price_new_7",
        'p8': {
            title: "Meuble TV Andalousie",
            price: "27000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en bois.",
            img: "assets/img/salon-2.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_8_t", desc_key: "str_new_8_d", price_key: "price_new_8",
        'p9': {
            title: "Bibliotheque Byblos",
            price: "55000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en bois.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 2
        }, title_key: "str_new_9_t", desc_key: "str_new_9_d", price_key: "price_new_9",
        'p10': {
            title: "Canape Casablanca",
            price: "79000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en velours.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 3
        }, title_key: "str_new_10_t", desc_key: "str_new_10_d", price_key: "price_new_10",
        'p11': {
            title: "Fauteuil Alger",
            price: "23000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en velours.",
            img: "assets/img/salon-2.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_11_t", desc_key: "str_new_11_d", price_key: "price_new_11",
        'p12': {
            title: "Pouf Tanger",
            price: "58000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en velours.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 19
        }, title_key: "str_new_12_t", desc_key: "str_new_12_d", price_key: "price_new_12",
        'p13': {
            title: "Bout de Canape Fer forge",
            price: "38000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en metal.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 7
        }, title_key: "str_new_13_t", desc_key: "str_new_13_d", price_key: "price_new_13",
        'p14': {
            title: "Table d'Appoint Oran",
            price: "52000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en metal.",
            img: "assets/img/salon-2.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_14_t", desc_key: "str_new_14_d", price_key: "price_new_14",
        'p15': {
            title: "Etagere Constantine",
            price: "25000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en metal.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 10
        }, title_key: "str_new_15_t", desc_key: "str_new_15_d", price_key: "price_new_15",
        'p16': {
            title: "Canape d'Angle Tunis",
            price: "97000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en tissu.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 1
        }, title_key: "str_new_16_t", desc_key: "str_new_16_d", price_key: "price_new_16",
        'p17': {
            title: "Meridienne Tipaza",
            price: "62000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en tissu.",
            img: "assets/img/salon-2.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_17_t", desc_key: "str_new_17_d", price_key: "price_new_17",
        'p18': {
            title: "Fauteuil Club Bejaia",
            price: "65000 DA",
            desc: "Magnifique creation pour votre Salon avec finition en tissu.",
            img: "assets/img/salon-1.jpg",
            cat: "Salon",
            dims: { w: 100, h: 100, d: 100 },
            stock: 13
        }, title_key: "str_new_18_t", desc_key: "str_new_18_d", price_key: "price_new_18",
        'p19': {
            title: "Lit Double Cedre",
            price: "82000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en bois.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 6
        }, title_key: "str_new_19_t", desc_key: "str_new_19_d", price_key: "price_new_19",
        'p20': {
            title: "Armoire Antique",
            price: "69000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en bois.",
            img: "assets/img/chambre-2.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_20_t", desc_key: "str_new_20_d", price_key: "price_new_20",
        'p21': {
            title: "Table de Chevet Atlas",
            price: "24000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en bois.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 2
        }, title_key: "str_new_21_t", desc_key: "str_new_21_d", price_key: "price_new_21",
        'p22': {
            title: "Tete de Lit Velours",
            price: "63000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en velours.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 18
        }, title_key: "str_new_22_t", desc_key: "str_new_22_d", price_key: "price_new_22",
        'p23': {
            title: "Banquette de Lit",
            price: "70000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en velours.",
            img: "assets/img/chambre-2.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_23_t", desc_key: "str_new_23_d", price_key: "price_new_23",
        'p24': {
            title: "Fauteuil de Chambre",
            price: "87000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en velours.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 4
        }, title_key: "str_new_24_t", desc_key: "str_new_24_d", price_key: "price_new_24",
        'p25': {
            title: "Lit Forge Tlemcen",
            price: "81000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en metal.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 19
        }, title_key: "str_new_25_t", desc_key: "str_new_25_d", price_key: "price_new_25",
        'p26': {
            title: "Porte-Vetements Cuivre",
            price: "93000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en metal.",
            img: "assets/img/chambre-2.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_26_t", desc_key: "str_new_26_d", price_key: "price_new_26",
        'p27': {
            title: "Miroir sur Pied",
            price: "32000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en metal.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 18
        }, title_key: "str_new_27_t", desc_key: "str_new_27_d", price_key: "price_new_27",
        'p28': {
            title: "Lit Tapissier",
            price: "23000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en tissu.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 6
        }, title_key: "str_new_28_t", desc_key: "str_new_28_d", price_key: "price_new_28",
        'p29': {
            title: "Bout de Lit Tissu",
            price: "90000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en tissu.",
            img: "assets/img/chambre-2.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_29_t", desc_key: "str_new_29_d", price_key: "price_new_29",
        'p30': {
            title: "Fauteuil Relax",
            price: "87000 DA",
            desc: "Magnifique creation pour votre Chambre avec finition en tissu.",
            img: "assets/img/chambre-1.jpg",
            cat: "Chambre",
            dims: { w: 100, h: 100, d: 100 },
            stock: 7
        }, title_key: "str_new_30_t", desc_key: "str_new_30_d", price_key: "price_new_30",
        'p31': {
            title: "Table Rustique Noyer",
            price: "78000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en bois.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 14
        }, title_key: "str_new_31_t", desc_key: "str_new_31_d", price_key: "price_new_31",
        'p32': {
            title: "Chaise Bistrot",
            price: "25000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en bois.",
            img: "assets/img/salle-a-manger-2.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_32_t", desc_key: "str_new_32_d", price_key: "price_new_32",
        'p33': {
            title: "Vaisselier Massif",
            price: "36000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en bois.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 4
        }, title_key: "str_new_33_t", desc_key: "str_new_33_d", price_key: "price_new_33",
        'p34': {
            title: "Chaise Velours Royal",
            price: "91000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en velours.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 5
        }, title_key: "str_new_34_t", desc_key: "str_new_34_d", price_key: "price_new_34",
        'p35': {
            title: "Fauteuil de Table",
            price: "45000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en velours.",
            img: "assets/img/salle-a-manger-2.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_35_t", desc_key: "str_new_35_d", price_key: "price_new_35",
        'p36': {
            title: "Banquette Capitonnee",
            price: "54000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en velours.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 3
        }, title_key: "str_new_36_t", desc_key: "str_new_36_d", price_key: "price_new_36",
        'p37': {
            title: "Table Industrielle",
            price: "28000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en metal.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 13
        }, title_key: "str_new_37_t", desc_key: "str_new_37_d", price_key: "price_new_37",
        'p38': {
            title: "Chaise Metal Noir",
            price: "45000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en metal.",
            img: "assets/img/salle-a-manger-2.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_38_t", desc_key: "str_new_38_d", price_key: "price_new_38",
        'p39': {
            title: "Desserte Roulante",
            price: "80000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en metal.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 18
        }, title_key: "str_new_39_t", desc_key: "str_new_39_d", price_key: "price_new_39",
        'p40': {
            title: "Chaise Tissu Lin",
            price: "82000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en tissu.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 1
        }, title_key: "str_new_40_t", desc_key: "str_new_40_d", price_key: "price_new_40",
        'p41': {
            title: "Fauteuil Repas",
            price: "97000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en tissu.",
            img: "assets/img/salle-a-manger-2.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 0
        }, title_key: "str_new_41_t", desc_key: "str_new_41_d", price_key: "price_new_41",
        'p42': {
            title: "Housse de Chaise",
            price: "45000 DA",
            desc: "Magnifique creation pour votre Salle A manger avec finition en tissu.",
            img: "assets/img/salle-a-manger-1.jpg",
            cat: "Salle A manger",
            dims: { w: 100, h: 100, d: 100 },
            stock: 4
        }, title_key: "str_new_42_t", desc_key: "str_new_42_d", price_key: "price_new_42"};

    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('id');
    
    if (pid && catalog[pid] && window.location.pathname.includes('product.html')) {
        const p = catalog[pid];
        
        // Update title and desc
        const titleEl = document.querySelector('.product-title');
        if (titleEl) titleEl.setAttribute('data-i18n', p.title_key);
        document.title = ""; document.documentElement.setAttribute('data-dynamic-title', p.title_key);
        
        const priceEl = document.querySelector('.product-price');
        if (priceEl) priceEl.setAttribute('data-i18n', p.price_key);
        
        // description is usually next sibling of price or just a p tag in the container
        const descEl = document.querySelector('h2.product-title').nextElementSibling.nextElementSibling;
        if (descEl && descEl.tagName.toLowerCase() === 'p') {
            descEl.setAttribute('data-i18n', p.desc_key);
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
            const updateWaLink = () => {
                const lang = localStorage.getItem('site_lang') || 'fr';
                const msgTemplate = (typeof dictionary !== 'undefined' && dictionary['wa_prefill_msg']) ? dictionary['wa_prefill_msg'][lang] : "Bonjour, je suis intéressé(e) par le produit {name} ({price}).";
                const pName = (typeof dictionary !== 'undefined' && dictionary[p.title_key]) ? dictionary[p.title_key][lang] : p.title;
                const pPrice = (typeof dictionary !== 'undefined' && dictionary[p.price_key]) ? dictionary[p.price_key][lang] : p.price;
                const msg = msgTemplate.replace('{name}', pName).replace('{price}', pPrice);
                waBtn.href = "https://wa.me/213555000000?text=" + encodeURIComponent(msg);
                waBtn.setAttribute('data-wa-dynamic', 'true');
            };
            updateWaLink();
            document.addEventListener('retranslate', updateWaLink);
        }

        // Update breadcrumb
        const bcSpans = document.querySelectorAll('.breadcrumbs span');
        if (bcSpans.length > 0) {
            bcSpans[bcSpans.length - 1].setAttribute('data-i18n', p.title_key);
        }
        
        // Update dimensions table
        const tds = document.querySelectorAll('.dimensions-table td');
        if (tds.length === 3) {
            tds[0].setAttribute('data-dynamic-val', p.dims.w); tds[0].textContent = p.dims.w;
            tds[1].setAttribute('data-dynamic-val', p.dims.h); tds[1].textContent = p.dims.h;
            tds[2].setAttribute('data-dynamic-val', p.dims.d); tds[2].textContent = p.dims.d;
        }
    }
});
