// CHANGE BOOKING EMAIL HERE if needed
const bookingEmail = "CANINC9681159@hotmail.com";

// LANGUAGE SWITCHING
const languageSwitcher = document.getElementById(
  "language-switcher"
);

const translatedElements = document.querySelectorAll(
  "[data-fr]"
);

// Save the English text already written in the HTML.
translatedElements.forEach((element) => {
  element.dataset.en = element.textContent.trim();
});

let currentLanguage = "en";

try {
  currentLanguage =
    localStorage.getItem("site-language") === "fr"
      ? "fr"
      : "en";
} catch {
  currentLanguage = "en";
}

function changeLanguage(language) {
  currentLanguage = language;

  document.documentElement.lang =
    language === "fr" ? "fr-CA" : "en-CA";

  translatedElements.forEach((element) => {
    element.textContent =
      language === "fr"
        ? element.dataset.fr
        : element.dataset.en;
  });

  document.querySelectorAll(".site-nav").forEach((nav) => {
    nav.setAttribute(
      "aria-label",
      language === "fr"
        ? "Navigation principale"
        : "Main navigation"
    );
  });

  if (languageSwitcher) {
    languageSwitcher.value = language;
  }

  try {
    localStorage.setItem("site-language", language);
  } catch {
    // Translation works even without browser storage.
  }
}

changeLanguage(currentLanguage);

if (languageSwitcher) {
  languageSwitcher.addEventListener("change", (event) => {
    changeLanguage(event.target.value);
  });
}

// BOOKING FORM
const bookingForm = document.getElementById("booking-form");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const french = currentLanguage === "fr";

    const serviceSelect = document.getElementById("service");

    const selectedService =
      serviceSelect.options[serviceSelect.selectedIndex]
        .textContent.trim();

    const headings = french
      ? {
          subject: "Demande de service",
          name: "Nom",
          email: "Courriel",
          phone: "Téléphone",
          service: "Service",
          date: "Date souhaitée",
          location: "Lieu ou adresse",
          details: "Détails",
          unspecified: "Non précisé"
        }
      : {
          subject: "Service request",
          name: "Name",
          email: "Email",
          phone: "Phone",
          service: "Service",
          date: "Preferred date",
          location: "Location or address",
          details: "Details",
          unspecified: "Not specified"
        };

    const subject =
      `${headings.subject} - ${selectedService}`;

    const message = [
      `${headings.name}: ${formData.get("customerName")}`,
      `${headings.email}: ${formData.get("customerEmail")}`,
      `${headings.phone}: ${formData.get("customerPhone")}`,
      `${headings.service}: ${selectedService}`,
      `${headings.date}: ${
        formData.get("preferredDate") || headings.unspecified
      }`,
      `${headings.location}: ${
        formData.get("location") || headings.unspecified
      }`,
      "",
      `${headings.details}:`,
      formData.get("details")
    ].join("\n");

    window.location.href =
      `mailto:${bookingEmail}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(message)}`;
  });
}