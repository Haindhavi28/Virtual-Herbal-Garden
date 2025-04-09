/**
 * Virtual Herbal Garden - Shop Page JavaScript
 * This file contains functionality specific to the shop page
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Update cart count on page load
  updateCartCount()

  // Initialize shop filters
  initShopFilters()

  // Initialize price range slider
  initPriceRangeSlider()

  // Initialize product sorting
  initProductSorting()

  // Initialize product modal
  initProductModal()

  // Initialize pagination
  initPagination()

  // Initialize add to cart buttons
  initAddToCartButtons()
})

/**
 * Initialize add to cart buttons
 */
function initAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")

  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()

        const id = this.getAttribute("data-id")
        const name = this.getAttribute("data-name")
        const price = Number.parseFloat(this.getAttribute("data-price"))

        addToCart(id, name, price, 1)
        showNotification(`${name} added to cart!`, "success")
      })
    })
  }
}

/**
 * Add item to cart
 * @param {string} id - Product ID
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {number} quantity - Quantity to add
 */
function addToCart(id, name, price, quantity) {
  // Get current cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex((item) => item.id === id)

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item if it doesn't exist
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: quantity,
    })
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()
}

/**
 * Update cart count in header
 */
function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count")

  if (cartCountElements.length > 0) {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    // Calculate total quantity
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0)

    // Update all cart count elements
    cartCountElements.forEach((element) => {
      element.textContent = totalQuantity
    })
  }
}

/**
 * Initialize shop filters
 */
function initShopFilters() {
  const filterToggleBtn = document.getElementById("filter-toggle-btn")
  const shopSidebar = document.querySelector(".shop-sidebar")
  const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]')
  const activeFilterTags = document.getElementById("active-filter-tags")
  const clearFiltersBtn = document.getElementById("clear-filters")

  // Toggle sidebar on mobile
  if (filterToggleBtn && shopSidebar) {
    filterToggleBtn.addEventListener("click", () => {
      shopSidebar.classList.toggle("active")
      document.body.style.overflow = shopSidebar.classList.contains("active") ? "hidden" : ""
    })
  }

  // Handle filter checkboxes
  if (filterCheckboxes.length > 0) {
    filterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        updateActiveFilters()
        filterProducts()
      })
    })
  }

  // Clear all filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      filterCheckboxes.forEach((checkbox) => {
        checkbox.checked = false
      })
      updateActiveFilters()
      filterProducts()
    })
  }

  // Function to update active filter tags
  function updateActiveFilters() {
    if (activeFilterTags) {
      activeFilterTags.innerHTML = ""
      let hasActiveFilters = false

      filterCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          hasActiveFilters = true
          const filterName = checkbox.parentElement.querySelector(".filter-label").textContent
          const filterTag = document.createElement("span")
          filterTag.className = "filter-tag"
          filterTag.innerHTML = `${filterName} <button class="remove-filter" data-filter="${checkbox.name}" data-value="${checkbox.value}"><i class="fas fa-times"></i></button>`
          activeFilterTags.appendChild(filterTag)

          // Add event listener to remove button
          const removeBtn = filterTag.querySelector(".remove-filter")
          removeBtn.addEventListener("click", function () {
            const filterName = this.getAttribute("data-filter")
            const filterValue = this.getAttribute("data-value")
            const checkbox = document.querySelector(`input[name="${filterName}"][value="${filterValue}"]`)
            if (checkbox) {
              checkbox.checked = false
              updateActiveFilters()
              filterProducts()
            }
          })
        }
      })

      // Show/hide clear all button
      if (clearFiltersBtn) {
        clearFiltersBtn.style.display = hasActiveFilters ? "block" : "none"
      }
    }
  }

  // Function to filter products
  function filterProducts() {
    const productCards = document.querySelectorAll(".product-card")

    if (productCards.length > 0) {
      // Get selected filters
      const selectedFilters = {
        category: [],
        difficulty: [],
        light: [],
      }

      filterCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          selectedFilters[checkbox.name].push(checkbox.value)
        }
      })

      // Get price range
      const minPrice = Number.parseFloat(document.getElementById("min-price").value) || 0
      const maxPrice = Number.parseFloat(document.getElementById("max-price").value) || 100

      // Filter products
      let visibleCount = 0

      productCards.forEach((card) => {
        let shouldShow = true

        // Check category filter
        if (selectedFilters.category.length > 0) {
          const productCategory = card.querySelector(".product-category").textContent.toLowerCase()
          const categoryMatch = selectedFilters.category.some((category) =>
            productCategory.includes(category.toLowerCase()),
          )

          if (!categoryMatch) {
            shouldShow = false
          }
        }

        // Check difficulty filter
        if (selectedFilters.difficulty.length > 0 && shouldShow) {
          const productDifficulty = card.getAttribute("data-difficulty") || ""

          if (productDifficulty) {
            const difficultyMatch = selectedFilters.difficulty.some(
              (difficulty) => productDifficulty.toLowerCase() === difficulty.toLowerCase(),
            )

            if (!difficultyMatch) {
              shouldShow = false
            }
          }
        }

        // Check light requirements filter
        if (selectedFilters.light.length > 0 && shouldShow) {
          const productLight = card.getAttribute("data-light") || ""

          if (productLight) {
            const lightMatch = selectedFilters.light.some((light) => productLight.toLowerCase() === light.toLowerCase())

            if (!lightMatch) {
              shouldShow = false
            }
          }
        }

        // Check price filter
        if (shouldShow) {
          const priceText = card.querySelector(".product-price").textContent
          const price = Number.parseFloat(priceText.replace(/[^0-9.]/g, ""))

          if (price < minPrice || price > maxPrice) {
            shouldShow = false
          }
        }

        // Update visibility
        card.style.display = shouldShow ? "block" : "none"

        if (shouldShow) {
          visibleCount++
        }
      })

      // Update product count
      const productCount = document.getElementById("product-count")
      if (productCount) {
        productCount.textContent = visibleCount
      }
    }
  }

  // Initial update
  updateActiveFilters()
}

/**
 * Initialize price range slider
 */
function initPriceRangeSlider() {
  const minPriceInput = document.getElementById("min-price")
  const maxPriceInput = document.getElementById("max-price")
  const minPriceRange = document.getElementById("price-range-min")
  const maxPriceRange = document.getElementById("price-range-max")
  const sliderRange = document.querySelector(".slider-range")

  if (minPriceInput && maxPriceInput && minPriceRange && maxPriceRange) {
    // Function to update slider UI
    function updateSliderUI() {
      if (sliderRange) {
        const minVal = Number.parseInt(minPriceRange.value)
        const maxVal = Number.parseInt(maxPriceRange.value)
        const minPercent = (minVal / Number.parseInt(minPriceRange.max)) * 100
        const maxPercent = (maxVal / Number.parseInt(maxPriceRange.max)) * 100

        sliderRange.style.left = minPercent + "%"
        sliderRange.style.width = maxPercent - minPercent + "%"
      }
    }

    // Function to handle min range input change
    function handleMinRangeChange() {
      const minVal = Number.parseInt(minPriceRange.value)
      const maxVal = Number.parseInt(maxPriceRange.value)

      if (minVal > maxVal - 5) {
        minPriceRange.value = maxVal - 5
      }

      minPriceInput.value = minPriceRange.value
      updateSliderUI()
      filterProducts()
    }

    // Function to handle max range input change
    function handleMaxRangeChange() {
      const minVal = Number.parseInt(minPriceRange.value)
      const maxVal = Number.parseInt(maxPriceRange.value)

      if (maxVal < minVal + 5) {
        maxPriceRange.value = minVal + 5
      }

      maxPriceInput.value = maxPriceRange.value
      updateSliderUI()
      filterProducts()
    }

    // Function to handle min price input change
    function handleMinPriceChange() {
      let minVal = Number.parseInt(minPriceInput.value)
      const maxVal = Number.parseInt(maxPriceInput.value)

      if (isNaN(minVal)) {
        minVal = 0
      }

      if (minVal > maxVal - 5) {
        minVal = maxVal - 5
      }

      if (minVal < 0) {
        minVal = 0
      }

      minPriceInput.value = minVal
      minPriceRange.value = minVal
      updateSliderUI()
      filterProducts()
    }

    // Function to handle max price input change
    function handleMaxPriceChange() {
      let maxVal = Number.parseInt(maxPriceInput.value)
      const minVal = Number.parseInt(minPriceInput.value)

      if (isNaN(maxVal)) {
        maxVal = 100
      }

      if (maxVal < minVal + 5) {
        maxVal = minVal + 5
      }

      if (maxVal > Number.parseInt(maxPriceRange.max)) {
        maxVal = Number.parseInt(maxPriceRange.max)
      }

      maxPriceInput.value = maxVal
      maxPriceRange.value = maxVal
      updateSliderUI()
      filterProducts()
    }

    // Add event listeners
    minPriceRange.addEventListener("input", handleMinRangeChange)
    maxPriceRange.addEventListener("input", handleMaxRangeChange)
    minPriceInput.addEventListener("change", handleMinPriceChange)
    maxPriceInput.addEventListener("change", handleMaxPriceChange)

    // Initialize slider UI
    updateSliderUI()
  }

  // Function to filter products based on current filters
  function filterProducts() {
    const productCards = document.querySelectorAll(".product-card")
    const minPrice = Number.parseFloat(minPriceInput.value) || 0
    const maxPrice = Number.parseFloat(maxPriceInput.value) || 100

    let visibleCount = 0

    productCards.forEach((card) => {
      const priceText = card.querySelector(".product-price").textContent
      const price = Number.parseFloat(priceText.replace(/[^0-9.]/g, ""))
      const currentDisplay = card.style.display

      // Only update display if it's currently visible or if it should be visible based on price
      if (currentDisplay !== "none" || (price >= minPrice && price <= maxPrice)) {
        if (price >= minPrice && price <= maxPrice) {
          // Check other active filters before showing
          const categoryFilters = document.querySelectorAll('input[name="category"]:checked')
          const difficultyFilters = document.querySelectorAll('input[name="difficulty"]:checked')
          const lightFilters = document.querySelectorAll('input[name="light"]:checked')

          let shouldShow = true

          // Check category filters
          if (categoryFilters.length > 0) {
            const productCategory = card.querySelector(".product-category").textContent.toLowerCase()
            const categoryMatch = Array.from(categoryFilters).some((filter) =>
              productCategory.includes(filter.value.toLowerCase()),
            )

            if (!categoryMatch) {
              shouldShow = false
            }
          }

          // Check difficulty filters
          if (difficultyFilters.length > 0 && shouldShow) {
            const productDifficulty = card.getAttribute("data-difficulty") || ""

            if (productDifficulty) {
              const difficultyMatch = Array.from(difficultyFilters).some(
                (filter) => productDifficulty.toLowerCase() === filter.value.toLowerCase(),
              )

              if (!difficultyMatch) {
                shouldShow = false
              }
            }
          }

          // Check light filters
          if (lightFilters.length > 0 && shouldShow) {
            const productLight = card.getAttribute("data-light") || ""

            if (productLight) {
              const lightMatch = Array.from(lightFilters).some(
                (filter) => productLight.toLowerCase() === filter.value.toLowerCase(),
              )

              if (!lightMatch) {
                shouldShow = false
              }
            }
          }

          card.style.display = shouldShow ? "block" : "none"

          if (shouldShow) {
            visibleCount++
          }
        } else {
          card.style.display = "none"
        }
      }
    })

    // Update product count
    const productCount = document.getElementById("product-count")
    if (productCount) {
      productCount.textContent = visibleCount
    }
  }
}

/**
 * Initialize product sorting
 */
function initProductSorting() {
  const sortSelect = document.getElementById("sort-select")
  const productGrid = document.querySelector(".product-grid")

  if (sortSelect && productGrid) {
    sortSelect.addEventListener("change", function () {
      const sortValue = this.value
      const productCards = Array.from(productGrid.querySelectorAll(".product-card"))

      // Sort products based on selected option
      productCards.sort((a, b) => {
        if (sortValue === "price-low") {
          const priceA = Number.parseFloat(a.querySelector(".product-price").textContent.replace(/[^0-9.]/g, ""))
          const priceB = Number.parseFloat(b.querySelector(".product-price").textContent.replace(/[^0-9.]/g, ""))
          return priceA - priceB
        } else if (sortValue === "price-high") {
          const priceA = Number.parseFloat(a.querySelector(".product-price").textContent.replace(/[^0-9.]/g, ""))
          const priceB = Number.parseFloat(b.querySelector(".product-price").textContent.replace(/[^0-9.]/g, ""))
          return priceB - priceA
        } else if (sortValue === "name-asc") {
          const nameA = a.querySelector(".product-title").textContent
          const nameB = b.querySelector(".product-title").textContent
          return nameA.localeCompare(nameB)
        } else if (sortValue === "name-desc") {
          const nameA = a.querySelector(".product-title").textContent
          const nameB = b.querySelector(".product-title").textContent
          return nameB.localeCompare(nameA)
        } else if (sortValue === "newest") {
          // For demo purposes, we'll use the product ID as a proxy for "newness"
          const idA = Number.parseInt(a.querySelector(".add-to-cart-btn").getAttribute("data-id"))
          const idB = Number.parseInt(b.querySelector(".add-to-cart-btn").getAttribute("data-id"))
          return idB - idA
        } else {
          // Featured (default)
          const isBestsellerA = a.querySelector(".bestseller") !== null
          const isBestsellerB = b.querySelector(".bestseller") !== null

          if (isBestsellerA && !isBestsellerB) return -1
          if (!isBestsellerA && isBestsellerB) return 1
          return 0
        }
      })

      // Reorder products in the DOM
      productCards.forEach((card) => {
        productGrid.appendChild(card)
      })
    })
  }
}

/**
 * Initialize product modal
 */
function initProductModal() {
  const modal = document.getElementById("product-modal")
  const modalBody = modal ? modal.querySelector(".product-modal-body") : null
  const closeButton = modal ? modal.querySelector(".close-modal") : null
  const quickViewButtons = document.querySelectorAll(".quick-view-btn")

  if (modal && modalBody && closeButton && quickViewButtons.length > 0) {
    // Open modal when quick view button is clicked
    quickViewButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()

        const productName = this.getAttribute("data-product")
        const productCard = this.closest(".product-card")
        const productImage = productCard.querySelector(".product-image img")
        const imageSrc = productImage.getAttribute("src")

        // Load product data
        const productData = getProductData(productName)

        if (productData) {
          // Populate modal with product data
          modalBody.innerHTML = `
            <div class="product-modal-grid">
              <div class="product-modal-gallery">
                <div class="product-main-image">
                  <img src="${imageSrc}" alt="${productData.name}">
                </div>
                <div class="product-thumbnails">
                  <div class="thumbnail active">
                    <img src="${imageSrc}" alt="${productData.name} - Main">
                  </div>
                </div>
              </div>
              <div class="product-modal-info">
                <h2>${productData.name.toUpperCase()}</h2>
                <p class="product-scientific">${productData.scientific}</p>
                
                <div class="product-rating">
                  ${generateRatingStars(productData.rating)}
                  <span>(${productData.reviews} reviews)</span>
                </div>
                
                <div class="product-price-container">
                  ${
                    productData.salePrice
                      ? `<p class="product-price"><span class="original-price">$${productData.price.toFixed(2)}</span> $${productData.salePrice.toFixed(2)}</p>`
                      : `<p class="product-price">$${productData.price.toFixed(2)}</p>`
                  }
                </div>
                
                <div class="product-description">
                  <p>${productData.description}</p>
                </div>
                
                <div class="product-features">
                  <h3>Features</h3>
                  <ul>
                    ${productData.features.map((feature) => `<li>${feature}</li>`).join("")}
                  </ul>
                </div>
                
                <div class="product-quantity">
                  <label for="product-quantity-input">Quantity</label>
                  <div class="quantity-input">
                    <button class="quantity-decrease">-</button>
                    <input type="number" id="product-quantity-input" value="1" min="1" max="10">
                    <button class="quantity-increase">+</button>
                  </div>
                </div>
                
                <div class="product-actions">
                  <button class="btn btn-primary add-to-cart-btn-modal" data-id="${productData.id}" data-name="${productData.name}" data-price="${productData.salePrice || productData.price}">
                    <i class="fas fa-shopping-basket"></i> ADD TO CART
                  </button>
                  <button class="btn btn-outline wishlist-btn">
                    <i class="far fa-heart"></i> ADD TO WISHLIST
                  </button>
                </div>
                
                <div class="product-meta">
                  <p><strong>Categories:</strong> ${productData.categories.join(", ")}</p>
                  <p><strong>Growing Difficulty:</strong> ${productData.difficulty}</p>
                  <p><strong>Light Requirements:</strong> ${productData.light}</p>
                </div>
              </div>
            </div>
          `

          // Show modal
          modal.classList.add("active")
          document.body.style.overflow = "hidden"

          // Initialize quantity input
          const quantityInput = modalBody.querySelector("#product-quantity-input")
          const decreaseBtn = modalBody.querySelector(".quantity-decrease")
          const increaseBtn = modalBody.querySelector(".quantity-increase")

          if (quantityInput && decreaseBtn && increaseBtn) {
            decreaseBtn.addEventListener("click", () => {
              const currentValue = Number.parseInt(quantityInput.value)
              if (currentValue > 1) {
                quantityInput.value = currentValue - 1
              }
            })

            increaseBtn.addEventListener("click", () => {
              const currentValue = Number.parseInt(quantityInput.value)
              if (currentValue < 10) {
                quantityInput.value = currentValue + 1
              }
            })
          }

          // Initialize add to cart button
          const addToCartBtn = modalBody.querySelector(".add-to-cart-btn-modal")
          if (addToCartBtn) {
            addToCartBtn.addEventListener("click", function () {
              const id = this.getAttribute("data-id")
              const name = this.getAttribute("data-name")
              const price = Number.parseFloat(this.getAttribute("data-price"))
              const quantity = Number.parseInt(quantityInput.value)

              addToCart(id, name, price, quantity)
              showNotification(`${name} added to cart!`, "success")

              // Close modal
              modal.classList.remove("active")
              document.body.style.overflow = ""
            })
          }

          // Initialize wishlist button
          const wishlistBtn = modalBody.querySelector(".wishlist-btn")
          if (wishlistBtn) {
            wishlistBtn.addEventListener("click", function () {
              // Toggle heart icon
              const heartIcon = this.querySelector("i")
              heartIcon.classList.toggle("far")
              heartIcon.classList.toggle("fas")

              // Show notification
              if (heartIcon.classList.contains("fas")) {
                showNotification(`${productData.name} added to wishlist!`, "success")
              } else {
                showNotification(`${productData.name} removed from wishlist!`, "info")
              }
            })
          }
        }
      })
    })

    // Close modal when close button is clicked
    closeButton.addEventListener("click", () => {
      modal.classList.remove("active")
      document.body.style.overflow = ""
    })

    // Close modal when clicking outside of modal content
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("active")
        document.body.style.overflow = ""
      }
    })

    // Close modal when Escape key is pressed
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("active")) {
        modal.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  }
}

/**
 * Initialize pagination
 */
function initPagination() {
  const paginationButtons = document.querySelectorAll(".pagination-btn")

  if (paginationButtons.length > 0) {
    paginationButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        paginationButtons.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // In a real app, this would load the next page of products
        // For demo purposes, we'll just scroll to the top of the product grid
        const productGrid = document.querySelector(".product-grid")
        if (productGrid) {
          window.scrollTo({
            top: productGrid.offsetTop - 100,
            behavior: "smooth",
          })
        }
      })
    })
  }
}

/**
 * Generate rating stars HTML
 * @param {number} rating - The product rating (0-5)
 * @returns {string} HTML for rating stars
 */
function generateRatingStars(rating) {
  let starsHtml = ""

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      starsHtml += '<i class="fas fa-star"></i>'
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>'
    } else {
      starsHtml += '<i class="far fa-star"></i>'
    }
  }

  return starsHtml
}

/**
 * Get product data (mock data - in a real app, this would come from an API)
 * @param {string} productName - The name of the product
 * @returns {Object|null} Product data object or null if not found
 */
function getProductData(productName) {
  const productsData = {
    lavender: {
      id: 1,
      name: "Lavender Plant",
      scientific: "Lavandula angustifolia",
      description:
        "Lavender is a fragrant herb known for its beautiful purple flowers and calming aroma. This plant is perfect for gardens, containers, and even indoor growing with proper care.",
      features: [
        "Drought-tolerant once established",
        "Attracts pollinators like bees and butterflies",
        "Deer and rabbit resistant",
        "Fragrant flowers and foliage",
        "Can be used fresh or dried for various purposes",
      ],
      categories: ["Medicinal", "Aromatic"],
      difficulty: "Easy",
      light: "Full Sun",
      price: 12.99,
      salePrice: null,
      rating: 4.5,
      reviews: 42,
    },
    mint: {
      id: 2,
      name: "Mint Plant",
      scientific: "Mentha",
      description:
        "Mint is a versatile and aromatic herb with bright green leaves. It's known for its refreshing flavor and cooling sensation, making it popular in culinary and medicinal applications.",
      features: [
        "Vigorous grower, perfect for containers",
        "Fragrant leaves with cooling flavor",
        "Attracts beneficial insects",
        "Perennial in most climates",
        "Multiple culinary and medicinal uses",
      ],
      categories: ["Culinary", "Medicinal"],
      difficulty: "Easy",
      light: "Partial to Full Sun",
      price: 9.99,
      salePrice: null,
      rating: 4.0,
      reviews: 28,
    },
    chamomile: {
      id: 3,
      name: "Chamomile Plant",
      scientific: "Matricaria chamomilla",
      description:
        "Chamomile is a daisy-like herb with small white flowers and feathery leaves. It has a pleasant apple-like scent and is widely used for its calming and medicinal properties.",
      features: [
        "Delicate, daisy-like flowers",
        "Pleasant apple-like fragrance",
        "Self-seeding annual",
        "Attracts beneficial insects",
        "Excellent for teas and medicinal uses",
      ],
      categories: ["Medicinal"],
      difficulty: "Moderate",
      light: "Full Sun to Partial Shade",
      price: 14.99,
      salePrice: 11.49,
      rating: 5.0,
      reviews: 36,
    },
    basil: {
      id: 4,
      name: "Basil Plant",
      scientific: "Ocimum basilicum",
      description:
        "Basil is a culinary herb with aromatic leaves that come in various sizes and colors. It's a staple in many cuisines and has a distinctive sweet, slightly peppery flavor.",
      features: [
        "Aromatic leaves with distinctive flavor",
        "Annual herb that grows quickly",
        "Available in many varieties",
        "Perfect for containers and gardens",
        "Essential ingredient in many cuisines",
      ],
      categories: ["Culinary"],
      difficulty: "Easy",
      light: "Full Sun",
      price: 8.99,
      salePrice: null,
      rating: 4.0,
      reviews: 31,
    },
    rosemary: {
      id: 5,
      name: "Rosemary Plant",
      scientific: "Rosmarinus officinalis",
      description:
        "Rosemary is an aromatic evergreen herb with needle-like leaves and blue flowers. It has a distinctive pine-like fragrance and is used in cooking, medicine, and aromatherapy.",
      features: [
        "Evergreen perennial with woody stems",
        "Drought-tolerant once established",
        "Aromatic needle-like leaves",
        "Attractive blue flowers",
        "Versatile culinary and medicinal herb",
      ],
      categories: ["Culinary", "Medicinal"],
      difficulty: "Moderate",
      light: "Full Sun",
      price: 10.99,
      salePrice: null,
      rating: 3.5,
      reviews: 19,
    },
    sage: {
      id: 6,
      name: "Sage Plant",
      scientific: "Salvia officinalis",
      description:
        "Sage is an evergreen shrub with grayish-green leaves and purple-blue flowers. It has a savory, slightly peppery flavor and is used in cooking, medicine, and as an ornamental plant.",
      features: [
        "Evergreen perennial with soft, fuzzy leaves",
        "Drought-tolerant once established",
        "Attractive purple-blue flowers",
        "Culinary and medicinal applications",
        "Deer resistant",
      ],
      categories: ["Medicinal", "Aromatic"],
      difficulty: "Easy",
      light: "Full Sun",
      price: 9.49,
      salePrice: null,
      rating: 4.0,
      reviews: 24,
    },
  }

  return productsData[productName] || null
}

/**
 * Show notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = "info") {
  // Check if notification container exists, create if not
  let notificationContainer = document.querySelector(".notification-container")

  if (!notificationContainer) {
    notificationContainer = document.createElement("div")
    notificationContainer.className = "notification-container"
    document.body.appendChild(notificationContainer)
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="notification-icon fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
      <p>${message}</p>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `

  // Add notification to container
  notificationContainer.appendChild(notification)

  // Show notification with animation
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Set up close button
  const closeButton = notification.querySelector(".notification-close")
  closeButton.addEventListener("click", () => {
    notification.classList.remove("show")
    setTimeout(() => {
      notification.remove()
    }, 300)
  })

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }
  }, 5000)
}

