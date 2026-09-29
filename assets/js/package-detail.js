(function renderPackageDetail() {
  const packages = window.MunnarTourPackages || [];
  const page = document.getElementById("packageDetailPage");
  const slug = document.body.dataset.packageSlug;
  const tourPackage = packages.find((item) => item.slug === slug);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

  if (!page || !tourPackage) {
    if (page) page.innerHTML = '<section class="detail-not-found"><h1>Package not found</h1><p>Please return to our packages to choose an experience.</p><a class="detail-primary-button" href="index.html#packages">Explore Packages</a></section>';
    return;
  }

  const bookingMessage = `Hello Munnar Dream Hub, I am interested in booking the ${tourPackage.title} package${tourPackage.price ? ` at ${tourPackage.price} ${tourPackage.priceUnit.toLowerCase()}` : ""}. Please share availability and booking details.`;
  const bookingUrl = `https://wa.me/916369514948?text=${encodeURIComponent(bookingMessage)}`;
  const iconCycle = ["fa-mountain-sun", "fa-car", "fa-leaf", "fa-camera", "fa-person-hiking", "fa-mug-hot"];
  const priceMarkup = tourPackage.price ? `<div class="detail-hero-price"><span>Package price</span><strong>${escapeHtml(tourPackage.price)} <small>${escapeHtml(tourPackage.priceUnit)}</small></strong></div>` : "";
  const quickInfo = [
    tourPackage.price ? { icon: "fa-tags", label: "Price", value: `${tourPackage.price} ${tourPackage.priceUnit}` } : null,
    tourPackage.duration ? { icon: "fa-clock", label: "Duration", value: tourPackage.duration } : null,
    { icon: "fa-location-dot", label: "Location", value: tourPackage.location },
    { icon: "fa-compass", label: "Experience", value: tourPackage.experience },
    { icon: "fa-heart", label: "Best for", value: tourPackage.bestFor }
  ].filter(Boolean);
  const galleryImages = tourPackage.images.slice(0, 3);
  const gallery = galleryImages.map((image, index) => `<button class="detail-gallery-item${index === 0 ? " is-main" : ""}" type="button" data-gallery-index="${index}" aria-label="Open ${escapeHtml(tourPackage.title)} image ${index + 1}"><img src="${escapeHtml(image)}" alt="${escapeHtml(tourPackage.imageAlt)}" loading="${index === 0 ? "eager" : "lazy"}" width="900" height="620"></button>`).join("");
  const highlights = tourPackage.highlights.map((highlight, index) => `<article class="detail-highlight"><i class="fa-solid ${iconCycle[index % iconCycle.length]}"></i><div><h3>${escapeHtml(highlight)}</h3><p>Part of this Munnar experience.</p></div></article>`).join("");
  const itinerary = tourPackage.itinerary?.length ? `<section class="detail-content-section detail-itinerary"><div class="detail-section-heading"><span>Plan your journey</span><h2>Complete Itinerary</h2></div><div class="detail-timeline-grid">${tourPackage.itinerary.map((day) => `<article class="detail-day"><h3>${escapeHtml(day.title)}</h3><ol>${day.activities.map((activity) => `<li>${activity.time ? `<time>${escapeHtml(activity.time)}</time>` : ""}<span>${escapeHtml(activity.text)}</span></li>`).join("")}</ol></article>`).join("")}</div></section>` : "";
  const inclusions = tourPackage.inclusions?.length ? `<section class="detail-content-section detail-inclusions"><div class="detail-section-heading"><span>Included in your experience</span><h2>What's Included</h2></div><ul>${tourPackage.inclusions.map((item) => `<li><i class="fa-solid fa-circle-check"></i>${escapeHtml(item)}</li>`).join("")}</ul></section>` : "";
  const extras = tourPackage.extraCharges?.length ? `<section class="detail-content-section detail-extras"><div class="detail-section-heading"><span>Plan ahead</span><h2>Optional / Extra Charges</h2></div><ul>${tourPackage.extraCharges.map((item) => `<li><i class="fa-solid fa-circle-info"></i>${escapeHtml(item)}</li>`).join("")}</ul></section>` : "";
  const amenities = tourPackage.amenities?.length ? `<section class="detail-content-section detail-amenities"><div class="detail-section-heading"><span>For your stay</span><h2>Stay Amenities</h2></div><ul>${tourPackage.amenities.map((item) => `<li><i class="fa-solid fa-check"></i>${escapeHtml(item)}</li>`).join("")}</ul></section>` : "";
  const related = packages.filter((item) => item.slug !== tourPackage.slug).sort((a, b) => (b.categories.filter((category) => tourPackage.categories.includes(category)).length) - (a.categories.filter((category) => tourPackage.categories.includes(category)).length)).slice(0, 3).map((item) => `<a class="detail-related-card" href="${escapeHtml(item.url)}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt)}" loading="lazy" width="480" height="300"><span>${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3><p>View package <i class="fa-solid fa-arrow-right"></i></p></a>`).join("");
  const branding = tourPackage.branding ? `<p class="detail-branding">${escapeHtml(tourPackage.branding).replace(/\n/g, "<br>")}</p>` : "";

  page.innerHTML = `<section class="detail-hero" style="background-image: linear-gradient(90deg, rgba(0, 48, 37, .9), rgba(0, 54, 40, .52)), url('${escapeHtml(tourPackage.image)}')"><div class="detail-shell"><span class="detail-hero-category"><i class="fa-solid fa-location-dot"></i>${escapeHtml(tourPackage.category)}</span><h1>${escapeHtml(tourPackage.title)}</h1>${tourPackage.subtitle ? `<p class="detail-hero-subtitle">${escapeHtml(tourPackage.subtitle)}</p>` : ""}<p class="detail-hero-description">${escapeHtml(tourPackage.shortDescription)}</p><div class="detail-hero-actions">${priceMarkup}<a class="detail-primary-button" href="${bookingUrl}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Book Now</a></div></div></section><section class="detail-quick-info"><div class="detail-shell">${quickInfo.map((item) => `<div><i class="fa-solid ${item.icon}"></i><p><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></p></div>`).join("")}</div></section><section class="detail-content-section detail-about"><div class="detail-shell detail-reading"><div class="detail-section-heading"><span>About this experience</span><h2>Made for memorable Munnar moments</h2></div><p>${escapeHtml(tourPackage.description)}</p>${branding}</div></section><section class="detail-content-section detail-gallery"><div class="detail-shell"><div class="detail-section-heading"><span>See the journey</span><h2>Experience Gallery</h2></div><div class="detail-gallery-grid">${gallery}</div></div></section><section class="detail-content-section detail-highlights"><div class="detail-shell"><div class="detail-section-heading"><span>What makes it special</span><h2>Package Highlights</h2></div><div class="detail-highlight-grid">${highlights}</div></div></section><div class="detail-shell detail-information-grid">${itinerary}${inclusions}${extras}${amenities}</div><section class="detail-booking"><div class="detail-shell"><div><span>Plan your escape</span><h2>Ready for Your Munnar Adventure?</h2><p>Reserve your package and start planning your Munnar experience with Munnar Surprise Tours.</p></div><div class="detail-booking-actions"><a class="detail-primary-button" href="${bookingUrl}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Book on WhatsApp</a><a class="detail-secondary-button" href="tel:+919495961143"><i class="fa-solid fa-phone"></i> Call for Enquiry</a><p class="detail-contact-line"><i class="fa-brands fa-whatsapp"></i> 6369514948 <span>•</span><i class="fa-solid fa-phone"></i> 94959 61143</p></div></div></section><section class="detail-related"><div class="detail-shell"><div class="detail-section-heading"><span>Keep exploring</span><h2>You May Also Like</h2></div><div class="detail-related-grid">${related}</div></div></section>`;

  const lightbox = document.createElement("div");
  lightbox.className = "detail-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = '<div class="detail-lightbox-backdrop" data-lightbox-close></div><section class="detail-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Package image gallery"><button type="button" class="detail-lightbox-close" data-lightbox-close aria-label="Close gallery"><i class="fa-solid fa-xmark"></i></button><button type="button" class="detail-lightbox-arrow is-prev" data-lightbox-prev aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button><img src="" alt=""><button type="button" class="detail-lightbox-arrow is-next" data-lightbox-next aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button></section>';
  document.body.append(lightbox);
  const lightboxImage = lightbox.querySelector("img");
  let galleryIndex = 0;
  const showImage = (index) => {
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[galleryIndex];
    lightboxImage.alt = `${tourPackage.imageAlt} ${galleryIndex + 1}`;
  };
  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  page.querySelectorAll("[data-gallery-index]").forEach((button) => button.addEventListener("click", () => {
    showImage(Number(button.dataset.galleryIndex));
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }));
  lightbox.addEventListener("click", (event) => {
    if (event.target.closest("[data-lightbox-close]")) closeLightbox();
    if (event.target.closest("[data-lightbox-prev]")) showImage(galleryIndex - 1);
    if (event.target.closest("[data-lightbox-next]")) showImage(galleryIndex + 1);
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(galleryIndex - 1);
    if (event.key === "ArrowRight") showImage(galleryIndex + 1);
  });

}());
