/**
 * Virtual Herbal Garden - Main JavaScript
 * This file contains core functionality for the entire website
 */

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize loader
  initLoader()

  // Initialize mobile menu
  initMobileMenu()

  // Initialize back to top button
  initBackToTop()

  // Initialize scroll animations
  initScrollAnimations()

  // Initialize fade-in animations
  initFadeInAnimations()
})

/**
 * Initialize page loader
 */
function initLoader() {
  const loader = document.querySelector(".loader-container")

  if (loader) {
    // Hide loader after page is loaded
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.style.opacity = "0"
        setTimeout(() => {
          loader.style.display = "none"
        }, 300)
      }, 500)
    })
  }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const mainNav = document.querySelector(".main-nav")

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener("click", function () {
      // Toggle active class on menu button
      this.classList.toggle("active")

      // Toggle mobile menu visibility
      if (mainNav.classList.contains("active")) {
        mainNav.style.height = "0"
        setTimeout(() => {
          mainNav.classList.remove("active")
          mainNav.style.height = ""
        }, 300)
      } else {
        mainNav.classList.add("active")
        const height = mainNav.scrollHeight
        mainNav.style.height = height + "px"
      }

      // Animate hamburger icon
      const spans = this.querySelectorAll("span")
      if (this.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("active") &&
        !mainNav.contains(event.target) &&
        !mobileMenuToggle.contains(event.target)
      ) {
        mobileMenuToggle.click()
      }
    })

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && mainNav.classList.contains("active")) {
        mainNav.classList.remove("active")
        mainNav.style.height = ""
        mobileMenuToggle.classList.remove("active")

        const spans = mobileMenuToggle.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })
  }
}

/**
 * Initialize back to top button functionality
 */
function initBackToTop() {
  const backToTopButton = document.getElementById("back-to-top")

  if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible")
      } else {
        backToTopButton.classList.remove("visible")
      }
    })

    // Scroll to top when button is clicked
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-aos]")

  if (animatedElements.length > 0) {
    // Check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect()
      return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 && rect.bottom >= 0
    }

    // Add animation class when element is in viewport
    function checkAnimations() {
      animatedElements.forEach((element) => {
        if (isInViewport(element)) {
          element.classList.add("aos-animate")
        }
      })
    }

    // Initial check
    checkAnimations()

    // Check on scroll
    window.addEventListener("scroll", checkAnimations)
  }
}

/**
 * Initialize fade-in animations
 */
function initFadeInAnimations() {
  const fadeElements = document.querySelectorAll(".fade-in")

  if (fadeElements.length > 0) {
    // Add active class to fade-in elements
    setTimeout(() => {
      fadeElements.forEach((element) => {
        element.classList.add("active")
      })
    }, 100)
  }
}

/**
 * Helper function to format currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  return "$" + amount.toFixed(2)
}

/**
 * Helper function to create a debounced function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeout
  return function () {
    
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * Helper function to create a throttled function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle
  return function () {
    
    const args = arguments
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

