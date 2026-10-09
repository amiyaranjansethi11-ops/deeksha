const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

const menuToggle = $(".menu-toggle");
const nav = $(".nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
$$(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Gallery lightbox
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
$$(".gallery-photo").forEach(button => button.addEventListener("click", () => {
  lightboxImage.src = button.dataset.full;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}));
function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}
$("#closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

// Product category filtering
$$(".category-chip").forEach(chip => chip.addEventListener("click", () => {
  $$(".category-chip").forEach(item => item.classList.remove("selected"));
  chip.classList.add("selected");
  const filter = chip.dataset.filter;
  $$(".product-card").forEach(card => {
    card.hidden = filter !== "all" && card.dataset.category !== filter;
  });
}));

// Wishlist (stored only in this browser)
let wishlist = [];
const wishlistModal = $("#wishlistModal");
const wishlistItems = $("#wishlistItems");
const wishlistCount = $("#wishlistCount");
const toast = $("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function renderWishlist() {
  wishlistCount.textContent = wishlist.length;
  $$(".heart-btn").forEach(btn => {
    const saved = wishlist.includes(btn.dataset.product);
    btn.classList.toggle("saved", saved);
    btn.textContent = saved ? "♥" : "♡";
  });
  if (!wishlist.length) {
    wishlistItems.innerHTML = '<p class="empty-wishlist">Tap a heart on any gift idea to save it here.</p>';
    return;
  }
  wishlistItems.innerHTML = wishlist.map(name =>
    `<div class="wishlist-item"><span>${escapeHtml(name)}</span><button data-remove="${escapeHtml(name)}">Remove</button></div>`
  ).join("");
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
$$(".heart-btn").forEach(btn => btn.addEventListener("click", () => {
  const name = btn.dataset.product;
  if (wishlist.includes(name)) {
    wishlist = wishlist.filter(item => item !== name);
    showToast("Removed from her wishlist");
  } else {
    wishlist.push(name);
    showToast("Saved a little sparkle ♡");
  }
  renderWishlist();
}));
wishlistItems.addEventListener("click", e => {
  const name = e.target.dataset.remove;
  if (!name) return;
  wishlist = wishlist.filter(item => item !== name);
  renderWishlist();
});
$("#openWishlist").addEventListener("click", () => { wishlistModal.hidden = false; });
$("#closeWishlist").addEventListener("click", () => { wishlistModal.hidden = true; });
wishlistModal.addEventListener("click", e => { if (e.target === wishlistModal) wishlistModal.hidden = true; });

// Little surprise
$("#surpriseButton").addEventListener("click", () => {
  const message = $("#surpriseMessage");
  message.hidden = !message.hidden;
  $("#surpriseButton").innerHTML = message.hidden ? 'One tiny surprise <span>✧</span>' : 'A little more love <span>♡</span>';
  if (!message.hidden) showToast("This one's only for you, Deeksha ♡");
});

// Keyboard close support
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeLightbox();
    wishlistModal.hidden = true;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }
});
renderWishlist();
