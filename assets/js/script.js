const tourPackages = window.MunnarTourPackages || [];
const packageGrid = document.getElementById("packageGrid");
let activePackageFilter = "all";

const packageEscapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

function packageBookingMessage(tourPackage) {
  const priceDetail = tourPackage.price ? ` at ${tourPackage.price} ${tourPackage.priceUnit.toLowerCase()}` : "";
  return `Hello Munnar Dream Hub, I am interested in booking the ${tourPackage.title} package${priceDetail}. Please share availability and booking details.`;
}

function packageCardMarkup(tourPackage, index) {
  const price = tourPackage.price
    ? `<div><span class="mp-price-label">Package price</span><strong class="mp-price">${packageEscapeHtml(tourPackage.price)} <small>${packageEscapeHtml(tourPackage.priceUnit)}</small></strong></div>`
    : `<span class="mp-price-unavailable">Price on enquiry</span>`;
  const imageSummaryPrice = tourPackage.price
    ? `<span class="mp-summary-price">${packageEscapeHtml(tourPackage.price)} <small>${packageEscapeHtml(tourPackage.priceUnit)}</small></span>`
    : `<span class="mp-summary-price">Price on enquiry</span>`;
  const whatsappUrl = `https://wa.me/916369514948?text=${encodeURIComponent(packageBookingMessage(tourPackage))}`;

  return `<article class="mp-card" style="transition-delay: ${index * 55}ms">
    <div class="mp-image-wrap" role="button" tabindex="0" aria-expanded="false" aria-label="Toggle ${packageEscapeHtml(tourPackage.title)} details"><img class="mp-image" src="${packageEscapeHtml(tourPackage.image)}" alt="${packageEscapeHtml(tourPackage.imageAlt)}" loading="lazy" width="720" height="460"><span class="mp-badge"><i class="fa-solid fa-location-dot"></i> ${packageEscapeHtml(tourPackage.category)}</span><div class="mp-image-summary" aria-hidden="true"><p>${packageEscapeHtml(tourPackage.title)}</p>${imageSummaryPrice}<span class="mp-summary-hint">View details <i class="fa-solid fa-arrow-up-right-from-square"></i></span></div></div>
    <div class="mp-card-content">
      <div class="mp-title-row"><h3>${packageEscapeHtml(tourPackage.title)}</h3>${tourPackage.duration ? `<span class="mp-duration">${packageEscapeHtml(tourPackage.duration)}</span>` : ""}</div>
      ${tourPackage.subtitle ? `<p class="mp-subtitle">${packageEscapeHtml(tourPackage.subtitle)}</p>` : ""}
      <p class="mp-description">${packageEscapeHtml(tourPackage.shortDescription)}</p>
      <div class="mp-price-row">${price}</div>
      <div class="mp-card-actions"><a class="mp-action mp-details-action" href="${packageEscapeHtml(tourPackage.url)}"><i class="fa-regular fa-file-lines"></i> View Details</a><a class="mp-action mp-book-action" href="${whatsappUrl}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Book Now</a></div>
    </div>
  </article>`;
}

function revealPackageCards() {
  const cards = packageGrid?.querySelectorAll(".mp-card") || [];
  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-revealed"));
    return;
  }
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach((card) => cardObserver.observe(card));
}

function renderPackages() {
  if (!packageGrid) return;
  const visiblePackages = activePackageFilter === "all"
    ? [
      ...tourPackages.filter((tourPackage) => tourPackage.categories.includes("kolukkumalai")),
      ...tourPackages.filter((tourPackage) => !tourPackage.categories.includes("kolukkumalai"))
    ]
    : tourPackages.filter((tourPackage) => tourPackage.categories.includes(activePackageFilter));
  packageGrid.innerHTML = visiblePackages.map(packageCardMarkup).join("");
  revealPackageCards();
}

if (packageGrid) renderPackages();

function togglePackageDetails(imageWrap) {
  const card = imageWrap.closest(".mp-card");
  const isExpanded = card.classList.toggle("is-active");
  imageWrap.setAttribute("aria-expanded", String(isExpanded));
  packageGrid.querySelectorAll(".mp-card.is-active").forEach((activeCard) => {
    if (activeCard !== card) {
      activeCard.classList.remove("is-active");
      activeCard.querySelector(".mp-image-wrap")?.setAttribute("aria-expanded", "false");
    }
  });
}

packageGrid?.addEventListener("click", (event) => {
  const card = event.target.closest(".mp-card");
  if (!card || event.target.closest(".mp-action")) return;
  const imageWrap = card.querySelector(".mp-image-wrap");
  if (imageWrap) togglePackageDetails(imageWrap);
});

packageGrid?.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".mp-image-wrap")) {
    event.preventDefault();
    togglePackageDetails(event.target);
  }
});

document.querySelectorAll(".mp-filter-button").forEach((button) => button.addEventListener("click", () => {
  activePackageFilter = button.dataset.filter;
  document.querySelectorAll(".mp-filter-button").forEach((filterButton) => filterButton.classList.toggle("is-active", filterButton === button));
  renderPackages();
}));

const navLinks = [...document.querySelectorAll(".desktop-nav a, .mobile-nav a")];
const sections = [...document.querySelectorAll("main > section[id]")];

function setActiveNavigation(id) {
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
}

if (sections.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    const visibleSection = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visibleSection) setActiveNavigation(visibleSection.target.id);
  }, { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.2, 0.5] });
  sections.forEach((section) => observer.observe(section));
}

document.getElementById("contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get("name");
  const packageName = form.get("package") || "a Munnar package";
  const message = `Hello Munnar Dream Hub, I am ${name}. I would like an enquiry about ${packageName}.`;
  window.open(`https://wa.me/916369514948?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});
