document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "../header.html", initHeader);
  loadComponent("footer", "../footer.html");
});

/**
 * Loads an HTML fragment into a target element
 */
async function loadComponent(elementId, url, callback) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    
    const html = await response.text();
    element.innerHTML = html;

    // Adjust paths for legal pages (if we are in /legal/ folder)
    if (window.location.pathname.includes("/legal/")) {
      fixRelativeLinks(element);
    }

    if (callback) callback();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Initialize Header logic (Mobile Menu & Active Link)
 */
function initHeader() {
  const navbar = document.querySelector(".navbar");
  
  // 1. Inject Hamburger Button if not present
  if (!document.querySelector(".menu-toggle")) {
    const btn = document.createElement("button");
    btn.className = "menu-toggle";
    btn.innerHTML = "&#9776;"; // Hamburger icon
    btn.setAttribute("aria-label", "Abrir menú");
    
    // Insert before the links
    const links = navbar.querySelector(".nav-links");
    navbar.insertBefore(btn, links);

    // Click Event
    btn.addEventListener("click", () => {
      links.classList.toggle("active");
    });
  }

  // 2. Highlight Active Link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-links a");
  
  links.forEach(link => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
}


/**
 * Fix relative links and images when inside subfolders (like /legal/)
 */
function fixRelativeLinks(container) {
  // 1. Arreglar Enlaces (a href) - Esto ya lo tenías
  const links = container.querySelectorAll("a");
  links.forEach(link => {
    const href = link.getAttribute("href");
    // Si no es absoluto, ni mailto, ni id, agregamos "../"
    if (href && !href.startsWith("http") && !href.startsWith("mailto") && !href.startsWith("/") && !href.startsWith("#")) {
      link.setAttribute("href", "../" + href);
    }
  });

  // 2. NUEVO: Arreglar Imágenes (img src) - Esto arregla el logo
  const images = container.querySelectorAll("img");
  images.forEach(img => {
    const src = img.getAttribute("src");
    // Si la ruta no empieza con http, / o data, le agregamos "../"
    if (src && !src.startsWith("http") && !src.startsWith("/") && !src.startsWith("data:")) {
      img.setAttribute("src", "../" + src);
    }
  });
}

/* =========================================
   LÓGICA BOTONES FLOTANTES (SCROLL)
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const socialButtons = document.getElementById("floatingSocials");

  // Solo ejecutamos si los botones existen en la página
  if (socialButtons) {
    window.addEventListener("scroll", () => {
      // Si bajamos más de 300px, mostrar botones
      if (window.scrollY > 300) {
        socialButtons.classList.add("is-visible");
      } else {
        // Si subimos al inicio, ocultarlos
        socialButtons.classList.remove("is-visible");
      }
    });
  }
});