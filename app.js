const API_URL = '/api/api.php';
const GOOGLE_CLIENT_ID = '904489350740-g3ih4bvl3k06ikrspdtnltm2oj17nj8k.apps.googleusercontent.com';

let state = {
  lang: localStorage.getItem('charly_lang') || 'en',
  user: JSON.parse(localStorage.getItem('charly_user')) || null,
  products: [],
  adminProducts: [],
  adminUsers: [],
  adminOrders: [],
  categories: [
    { slug: 'electronics', name_en: 'Electronics', name_fr: 'Électronique' },
    { slug: 'fashion', name_en: 'Fashion', name_fr: 'Mode & Vêtements' },
    { slug: 'vehicles', name_en: 'Vehicles', name_fr: 'Véhicules' }
  ],
  userNotifications: [],
  cart: JSON.parse(localStorage.getItem('charly_cart')) || [],
  selectedCategory: 'all',
  activeAdminTab: 'orders'
};

const flagsSVG = {
  en: `<svg viewBox="0 0 60 30" class="w-full h-full object-cover"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`,
  fr: `<svg viewBox="0 0 3 2" class="w-full h-full object-cover"><rect width="1" height="2" x="0" fill="#002395"/><rect width="1" height="2" x="1" fill="#fff"/><rect width="1" height="2" x="2" fill="#ED2939"/></svg>`
};

const i18n = {
  en: {
    signIn: "Sign In",
    signUp: "Sign Up",
    sell: "Sell Item",
    catalogTitle: "Explore Marketplace",
    catalogSubtitle: "Verified product listings across Cameroon",
    catAll: "All Items",
    createAccount: "Create an Account",
    signUpRequired: "Sign up required to buy or sell products.",
    emailLabel: "Email Address",
    phoneLabel: "Cameroon Phone (+237)",
    passwordLabel: "Password",
    signUpBtn: "Sign Up Now",
    signInTitle: "Sign In",
    signInSubtitle: "Enter your credentials to continue.",
    loginInputLabel: "Email, Phone (+2376...), or Username",
    signInBtn: "Sign In",
    addProductTitle: "Post a New Product",
    addProductSubtitle: "Products will pass through Admin validation before listing.",
    prodTitleLabel: "Product Title",
    priceLabelFCFA: "Price (FCFA)",
    quantity: "Quantity",
    categoryLabel: "Category",
    descriptionLabel: "Description",
    addToCart: "Add to Cart",
    yourCart: "Your Shopping Cart",
    cartSubtitle: "Review items, set location, and choose mobile money payment.",
    totalAmount: "Total Amount:",
    selectPayment: "Payment Method:",
    paymentPhoneLabel: "Mobile Money Phone Number (+237)",
    emptyCart: "Your cart is currently empty.",
    loginPrompt: "Please sign in or sign up to buy or sell products!",
    adminDashboard: "Admin Executive Dashboard",
    adminSub: "System oversight, customer orders, and category management",
    manageCategories: "Manage Categories",
    addProductBtn: "Add Product",
    registeredUsers: "Registered Users",
    customerOrders: "Customer Orders",
    pendingApprovals: "Pending Approvals",
    inventoryVal: "Total Inventory Value",
    tabOrders: "Customer Orders",
    tabUsers: "User Management",
    tabPending: "Pending Approvals",
    tabInventory: "Live Inventory",
    incomingOrders: "Incoming Customer Orders",
    verifyDispatch: "Verify payment and confirm dispatch",
    userRegistry: "Platform User Registry",
    thUser: "User / ID",
    thContact: "Contact & Address",
    thRole: "Role",
    thListings: "Listings",
    thActions: "Actions",
    noPending: "All clear! No pending submissions.",
    addNewCategory: "Add New Category",
    catSub: "Create a category for English and French marketplaces.",
    catNameEn: "Category Name (English)",
    catNameFr: "Category Name (French)",
    saveCategory: "Save Category",
    notificationCenter: "Notification Center",
    notifSub: "Updates regarding your product listings and orders.",
    townCity: "Town / City",
    quarterNeighborhood: "Quarter / Neighborhood",
    whatsappLabel: "WhatsApp Number (+237)",
    confirmOrderBtn: "Confirm Payment & Order",
    adminAddTitle: "Add New Product (Direct Publish)",
    adminAddSub: "Products added by Admin are published immediately without review.",
    publishImmediate: "Publish Product Immediately",
    updateProductDetails: "Update Product Details & Gallery",
    updateSub: "Modify stock quantity, title, price, category, description, or update pictures.",
    stockQty: "Stock Quantity",
    updateProductBtn: "Update Product & Gallery",
    submitReviewBtn: "Submit Product for Review",
    rights: "© 2026 Charly Express Cameroon. All rights reserved.",
    cameroonMarket: "Cameroon Market"
  },
  fr: {
    signIn: "Se Connecter",
    signUp: "S'inscrire",
    sell: "Vendre",
    catalogTitle: "Explorer le Marché",
    catalogSubtitle: "Annonces vérifiées à travers le Cameroun",
    catAll: "Tous les articles",
    createAccount: "Créer un Compte",
    signUpRequired: "Inscription obligatoire pour acheter ou vendre.",
    emailLabel: "Adresse Email",
    phoneLabel: "Téléphone (+237)",
    passwordLabel: "Mot de passe",
    signUpBtn: "S'inscrire Maintenant",
    signInTitle: "Connexion au Compte",
    signInSubtitle: "Entrez vos identifiants pour continuer.",
    loginInputLabel: "Email, Téléphone (+2376...) ou Nom d'utilisateur",
    signInBtn: "Se Connecter",
    addProductTitle: "Publier un Nouveau Produit",
    addProductSubtitle: "Les produits seront validés par l'admin avant publication.",
    prodTitleLabel: "Nom du Produit",
    priceLabelFCFA: "Prix (FCFA)",
    quantity: "Quantité",
    categoryLabel: "Catégorie",
    descriptionLabel: "Description",
    addToCart: "Ajouter au Panier",
    yourCart: "Votre Panier d'Achat",
    cartSubtitle: "Vérifiez vos articles, définissez l'adresse et payez.",
    totalAmount: "Montant Total :",
    selectPayment: "Mode de Paiement :",
    paymentPhoneLabel: "Numéro Mobile Money (+237)",
    emptyCart: "Votre panier est actuellement vide.",
    loginPrompt: "Veuillez vous connecter pour acheter ou vendre !",
    adminDashboard: "Tableau de Bord Exécutif Admin",
    adminSub: "Supervision du système, commandes clients et catégories",
    manageCategories: "Gérer les Catégories",
    addProductBtn: "Ajouter un Produit",
    registeredUsers: "Utilisateurs Inscrits",
    customerOrders: "Commandes Clients",
    pendingApprovals: "Approbations en Attente",
    inventoryVal: "Valeur Totale du Stock",
    tabOrders: "Commandes Clients",
    tabUsers: "Gestion des Utilisateurs",
    tabPending: "Approbations en Attente",
    tabInventory: "Stock en Ligne",
    incomingOrders: "Commandes Clients Reçues",
    verifyDispatch: "Vérifiez le paiement et confirmez l'expédition",
    userRegistry: "Registre des Utilisateurs",
    thUser: "Utilisateur / ID",
    thContact: "Contact & Address",
    thRole: "Rôle",
    thListings: "Annonces",
    thActions: "Actions",
    noPending: "Tout est propre ! Aucune soumission en attente.",
    addNewCategory: "Ajouter une Nouvelle Catégorie",
    catSub: "Créez une catégorie pour les marchés anglais et français.",
    catNameEn: "Nom de Catégorie (Anglais)",
    catNameFr: "Nom de Catégorie (Français)",
    saveCategory: "Enregistrer la Catégorie",
    notificationCenter: "Centre de Notifications",
    notifSub: "Mises à jour concernant vos annonces et commandes.",
    townCity: "Ville",
    quarterNeighborhood: "Quartier",
    whatsappLabel: "Numéro WhatsApp (+237)",
    confirmOrderBtn: "Confirmer le Paiement et la Commande",
    adminAddTitle: "Ajouter un Produit (Publication Directe)",
    adminAddSub: "Les produits ajoutés par l'admin sont publiés immédiatement.",
    publishImmediate: "Publier le Produit Immédiatement",
    updateProductDetails: "Modifier les Détails & Galerie",
    updateSub: "Modifiez le stock, le titre, le prix, la catégorie ou la galerie d'images.",
    stockQty: "Quantité en Stock",
    updateProductBtn: "Mettre à Jour le Produit & Galerie",
    submitReviewBtn: "Soumettre pour Vérification",
    rights: "© 2026 Charly Express Cameroun. Tous droits réservés.",
    cameroonMarket: "Marché Cameroun"
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('charly_lang')) {
    openModal('language-modal');
  } else {
    closeModal('language-modal');
  }
  await fetchCategories();
  updateUI();
  fetchProducts();
});

function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('charly_lang', lang);
  closeModal('language-modal');
  updateUI();
  renderCategoriesFilter();
  renderCategoriesDropdowns();
}

function toggleLanguage() {
  state.lang = state.lang === 'en' ? 'fr' : 'en';
  localStorage.setItem('charly_lang', state.lang);
  updateUI();
  renderCategoriesFilter();
  renderCategoriesDropdowns();
}

function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input || !icon) return;

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

function updateUI() {
  document.getElementById('lang-display').textContent = state.lang.toUpperCase();
  document.getElementById('lang-flag').innerHTML = flagsSVG[state.lang];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[state.lang][key]) {
      el.textContent = i18n[state.lang][key];
    }
  });

  const authBtns = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-menu');
  const adminAddBtn = document.getElementById('admin-add-btn');
  const userSellBtn = document.getElementById('user-sell-btn');
  const cartNavBtn = document.getElementById('cart-nav-btn');
  
  const userMarketplaceView = document.getElementById('user-marketplace-view');
  const adminDashboardView = document.getElementById('admin-dashboard-view');
  const portalSubtitle = document.getElementById('portal-subtitle');

  if (state.user) {
    authBtns.classList.add('hidden');
    userMenu.classList.remove('hidden');
    document.getElementById('nav-username').textContent = state.user.username;

    if (state.user.role === 'admin') {
      portalSubtitle.textContent = state.lang === 'en' ? 'Admin Control Panel' : 'Panneau de Contrôle Admin';
      if (adminAddBtn) adminAddBtn.classList.remove('hidden');
      if (userSellBtn) userSellBtn.classList.add('hidden');
      if (cartNavBtn) cartNavBtn.classList.add('hidden');

      userMarketplaceView.classList.add('hidden');
      adminDashboardView.classList.remove('hidden');
    } else {
      portalSubtitle.textContent = state.lang === 'en' ? 'Cameroon Market' : 'Marché Cameroun';
      if (adminAddBtn) adminAddBtn.classList.add('hidden');
      if (userSellBtn) userSellBtn.classList.remove('hidden');
      if (cartNavBtn) cartNavBtn.classList.remove('hidden');

      userMarketplaceView.classList.remove('hidden');
      adminDashboardView.classList.add('hidden');

      if (state.user.town) document.getElementById('checkout-town').value = state.user.town;
      if (state.user.quarter) document.getElementById('checkout-quarter').value = state.user.quarter;
      if (state.user.phone) {
        let cleanPhone = state.user.phone.replace('+237', '');
        document.getElementById('checkout-whatsapp').value = cleanPhone;
      }
    }
  } else {
    authBtns.classList.remove('hidden');
    userMenu.classList.add('hidden');
    if (cartNavBtn) cartNavBtn.classList.remove('hidden');

    portalSubtitle.textContent = state.lang === 'en' ? 'Cameroon Market' : 'Marché Cameroun';
    userMarketplaceView.classList.remove('hidden');
    adminDashboardView.classList.add('hidden');
  }
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function openAddProductModal() {
  if (!state.user) {
    showToast(i18n[state.lang].loginPrompt, 'warning');
    openModal('login-modal');
    return;
  }
  openModal('product-modal');
}

function openAdminAddModal() {
  openModal('admin-add-modal');
}

function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !msgEl) return;
  msgEl.textContent = msg;

  toast.className = 'fixed top-6 right-6 z-[99999] p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border-2 transition-all duration-300';

  if (type === 'error') {
    toast.classList.add('bg-slate-900', 'border-rose-500', 'text-rose-300');
    if (iconEl) iconEl.className = 'fa-solid fa-circle-exclamation text-rose-500 text-xl';
  } else if (type === 'warning') {
    toast.classList.add('bg-slate-900', 'border-amber-500', 'text-amber-300');
    if (iconEl) iconEl.className = 'fa-solid fa-triangle-exclamation text-amber-500 text-xl';
  } else if (type === 'success') {
    toast.classList.add('bg-slate-900', 'border-emerald-500', 'text-emerald-300');
    if (iconEl) iconEl.className = 'fa-solid fa-circle-check text-emerald-500 text-xl';
  } else {
    toast.classList.add('bg-slate-900', 'border-blue-500', 'text-blue-300');
    if (iconEl) iconEl.className = 'fa-solid fa-circle-info text-blue-500 text-xl';
  }

  toast.classList.remove('hidden');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
}

// ==================== CATEGORIES ====================

async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}?action=get_categories`);
    const data = await res.json();
    if (data.success && data.categories.length > 0) {
      state.categories = data.categories;
    }
  } catch (err) {
    console.warn("Using default category fallbacks:", err);
  }
  renderCategoriesFilter();
  renderCategoriesDropdowns();
}

function renderCategoriesFilter() {
  const bar = document.getElementById('category-filter-bar');
  if (!bar) return;

  const allLabel = i18n[state.lang].catAll;
  let html = `<button onclick="filterCategory('all')" class="cat-btn ${state.selectedCategory === 'all' ? 'active' : ''} px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap" data-category="all">${allLabel}</button>`;

  state.categories.forEach(c => {
    const name = state.lang === 'fr' ? c.name_fr : c.name_en;
    const isActive = state.selectedCategory === c.slug ? 'active' : '';
    html += `<button onclick="filterCategory('${c.slug}')" class="cat-btn ${isActive} px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap" data-category="${c.slug}">${name}</button>`;
  });

  bar.innerHTML = html;
}

function renderCategoriesDropdowns() {
  const selectIds = ['prod-category', 'admin-prod-category', 'edit-prod-category'];

  selectIds.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;

    const currentVal = sel.value;
    sel.innerHTML = '';

    if (state.categories.length === 0) {
      sel.innerHTML = `
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="vehicles">Vehicles</option>
      `;
      return;
    }

    state.categories.forEach(c => {
      const name = state.lang === 'fr' ? c.name_fr : c.name_en;
      sel.innerHTML += `<option value="${c.slug}">${name}</option>`;
    });

    if (currentVal) sel.value = currentVal;
  });
}

function filterCategory(category) {
  state.selectedCategory = category;
  renderCategoriesFilter();
  renderProducts();
}

async function fetchProducts() {
  try {
    const roleParam = state.user ? state.user.role : 'user';
    const res = await fetch(`${API_URL}?action=get_products&role=${roleParam}`);
    const data = await res.json();
    if (data.success) {
      state.products = data.products;
      renderProducts();
    }
  } catch (err) {
    console.error("Failed to fetch products.", err);
  }
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';

  state.products.forEach(p => {
    const inStock = parseInt(p.quantity) > 0;
    if (p.status === 'approved' && inStock && (state.selectedCategory === 'all' || p.category === state.selectedCategory)) {
      grid.innerHTML += `
        <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm p-4">
          <h3 class="font-black text-slate-900 text-lg mb-1">${p.title}</h3>
          <p class="text-emerald-600 font-black text-base">${parseInt(p.price).toLocaleString()} FCFA</p>
        </div>
      `;
    }
  });
}

// ==================== DIRECT REGISTRATION & AUTH ====================

async function handleRegisterDirect(e) {
  e.preventDefault();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const town = document.getElementById('reg-town').value.trim();
  const quarter = document.getElementById('reg-quarter').value.trim();
  const password = document.getElementById('reg-password').value;

  try {
    const res = await fetch(`${API_URL}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, town, quarter, password })
    });
    const data = await res.json();

    if (data.success) {
      state.user = data.user;
      localStorage.setItem('charly_user', JSON.stringify(data.user));
      closeModal('register-modal');
      updateUI();
      showToast("Account created successfully!", 'success');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast("Server connection error during registration.", 'error');
  }
}

function triggerGoogleLogin() {
  if (typeof google === 'undefined' || !google.accounts) {
    showToast("Google Services are loading. Please try again.", "warning");
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleSignIn
  });
  
  google.accounts.id.prompt();
}

async function handleGoogleSignIn(response) {
  if (!response || !response.credential) {
    showToast("Google Sign-In failed.", "error");
    return;
  }

  showToast("Signing in with Google...", "info");

  try {
    const res = await fetch(`${API_URL}?action=google_auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    });
    const data = await res.json();

    if (data.success) {
      state.user = data.user;
      localStorage.setItem('charly_user', JSON.stringify(data.user));
      closeModal('login-modal');
      closeModal('register-modal');
      updateUI();
      showToast(data.message || "Successfully signed in with Google!", 'success');
    } else {
      showToast(data.message || "Google authentication failed on server.", 'error');
    }
  } catch (err) {
    showToast("Server connection error during Google Sign-In.", 'error');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const loginInput = document.getElementById('login-input').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginInput, password })
    });
    const data = await res.json();
    if (data.success) {
      state.user = data.user;
      localStorage.setItem('charly_user', JSON.stringify(data.user));
      closeModal('login-modal');
      updateUI();
      showToast("Welcome back!", 'success');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast("Server connection error.", 'error');
  }
}

function logout() {
  state.user = null;
  localStorage.removeItem('charly_user');
  updateUI();
  fetchProducts();
  showToast("Logged out successfully.");
}
