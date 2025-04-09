/**
 * Virtual Herbal Garden - Animations JavaScript
 * This file contains animation-related functionality
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize scroll reveal animations
  initScrollReveal()

  // Initialize parallax effects
  initParallax()

  // Initialize sliders
  initSliders()
})

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
  // Get all elements with data-aos attribute
  const elements = document.querySelectorAll("[data-aos]")

  if (elements.length > 0) {
    // Function to check if element is in viewport
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect()
      return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 && rect.bottom >= 0
    }

    // Function to handle scroll animation
    function handleScrollAnimation() {
      elements.forEach((element) => {
        if (isElementInViewport(element)) {
          // Add animation class
          element.classList.add("aos-animate")

          // Apply delay if specified
          if (element.getAttribute("data-aos-delay")) {
            const delay = Number.parseInt(element.getAttribute("data-aos-delay"))
            element.style.transitionDelay = delay + "ms"
          }
        }
      })
    }

    // Initial check
    handleScrollAnimation()

    // Check on scroll (throttled)
    window.addEventListener("scroll", throttle(handleScrollAnimation, 100))
  }
}

/**
 * Initialize parallax effects
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll(".parallax")

  if (parallaxElements.length > 0) {
    // Function to update parallax position
    function updateParallax() {
      const scrollTop = window.pageYOffset

      parallaxElements.forEach((element) => {
        const speed = element.getAttribute("data-parallax-speed") || 0.5
        const offset = scrollTop * speed
        element.style.transform = `translateY(${offset}px)`
      })
    }

    // Initial update
    updateParallax()

    // Update on scroll (throttled)
    window.addEventListener("scroll", throttle(updateParallax, 10))
  }
}

/**
 * Initialize sliders
 */
function initSliders() {
  // Herbs slider
  initHerbsSlider()

  // Testimonials slider
  initTestimonialsSlider()
}

/**
 * Initialize herbs slider
 */
function initHerbsSlider() {
  const herbsSlider = document.querySelector(".herbs-slider")

  if (herbsSlider) {
    const track = herbsSlider.querySelector(".herbs-track")
    const prevBtn = herbsSlider.querySelector(".slider-prev")
    const nextBtn = herbsSlider.querySelector(".slider-next")

    if (track && prevBtn && nextBtn) {
      let position = 0
      const slideWidth = 300 // Width of each slide including gap
      const slidesPerView = getSlidesPerView()
      const totalSlides = track.children.length

      // Function to get slides per view based on screen width
      function getSlidesPerView() {
        if (window.innerWidth < 576) {
          return 1
        } else if (window.innerWidth < 992) {
          return 2
        } else {
          return 3
        }
      }

      // Function to update slider position
      function updateSliderPosition() {
        track.style.transform = `translateX(${-position * slideWidth}px)`
      }

      // Event listeners for navigation buttons
      prevBtn.addEventListener("click", () => {
        position = Math.max(position - 1, 0)
        updateSliderPosition()
        updateButtonState()
      })

      nextBtn.addEventListener("click", () => {
        position = Math.min(position + 1, totalSlides - slidesPerView)
        updateSliderPosition()
        updateButtonState()
      })

      // Function to update button state (disabled/enabled)
      function updateButtonState() {
        prevBtn.disabled = position === 0
        nextBtn.disabled = position >= totalSlides - slidesPerView

        prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1"
        nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1"
      }

      // Handle window resize
      window.addEventListener(
        "resize",
        debounce(() => {
          const newSlidesPerView = getSlidesPerView()
          if (newSlidesPerView !== slidesPerView) {
            position = 0
            updateSliderPosition()
            updateButtonState()
          }
        }),
      )

      // Initial button state update
      updateButtonState()
    }
  }
}

/**
 * Initialize testimonials slider
 */
function initTestimonialsSlider() {
  const testimonialCards = document.querySelectorAll(".testimonial-card")

  if (testimonialCards.length > 0) {
    // Add animation classes with staggered delay
    testimonialCards.forEach((card, index) => {
      card.style.transitionDelay = index * 0.1 + "s"
    })
  }
}

/**
 * Helper function to throttle function calls
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

/**
 * Helper function to debounce function calls
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

