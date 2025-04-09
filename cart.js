/**
 * Virtual Herbal Garden - Shopping Cart JavaScript
 * This file contains functionality for the shopping cart
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize cart
  initCart()

  // Initialize add to cart buttons
  initAddToCartButtons()

  // Update cart count
  updateCartCount()
})

/**
 * Initialize cart
 */
function initCart() {
  // Check if we're on the cart page
  const cartPage = document.querySelector(".cart-page")

  if (cartPage) {
    // Load cart items
    loadCartItems()

    // Initialize cart functionality
    initCartFunctionality()
  }
}

/**
 * Initialize add to cart buttons
 */
function initAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart")

  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id")
        const name = this.getAttribute("data-name")
        const price = Number.parseFloat(this.getAttribute("data-price"))

        // Add item to cart
        addToCart(id, name, price, 1)

        // Show success message
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

      // Add animation class
      element.classList.add("pulse")

      // Remove animation class after animation completes
      setTimeout(() => {
        element.classList.remove("pulse")
      }, 1000)
    })
  }
}

/**
 * Load cart items on cart page
 */
function loadCartItems() {
  const cartItemsContainer = document.querySelector(".cart-items")
  const cartSummaryContainer = document.querySelector(".cart-summary")
  const emptyCartMessage = document.querySelector(".empty-cart-message")

  if (cartItemsContainer && cartSummaryContainer) {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    if (cart.length === 0) {
      // Show empty cart message
      if (emptyCartMessage) {
        emptyCartMessage.style.display = "block"
      }

      cartItemsContainer.innerHTML = ""
      updateCartSummary(0, 0, 0)
    } else {
      // Hide empty cart message
      if (emptyCartMessage) {
        emptyCartMessage.style.display = "none"
      }

      // Generate cart items HTML
      let cartItemsHTML = ""
      let subtotal = 0

      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity
        subtotal += itemTotal

        cartItemsHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="images/placeholder-product.svg" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h3 class="cart-item-name">${item.name}</h3>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-decrease">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input">
                            <button class="quantity-increase">+</button>
                        </div>
                        <div class="cart-item-total">
                            <p>$${itemTotal.toFixed(2)}</p>
                        </div>
                        <button class="remove-item-btn">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `
      })

      // Update cart items container
      cartItemsContainer.innerHTML = cartItemsHTML

      // Calculate summary values
      const shipping = subtotal > 50 ? 0 : 5.99
      const total = subtotal + shipping

      // Update cart summary
      updateCartSummary(subtotal, shipping, total)
    }
  }
}

/**
 * Update cart summary
 * @param {number} subtotal - Cart subtotal
 * @param {number} shipping - Shipping cost
 * @param {number} total - Total cost
 */
function updateCartSummary(subtotal, shipping, total) {
  const subtotalElement = document.querySelector(".cart-subtotal .summary-value")
  const shippingElement = document.querySelector(".cart-shipping .summary-value")
  const totalElement = document.querySelector(".cart-total .summary-value")

  if (subtotalElement && shippingElement && totalElement) {
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`

    if (shipping === 0) {
      shippingElement.innerHTML = '<span class="free-shipping">FREE</span>'
    } else {
      shippingElement.textContent = `$${shipping.toFixed(2)}`
    }

    totalElement.textContent = `$${total.toFixed(2)}`
  }
}

/**
 * Initialize cart functionality
 */
function initCartFunctionality() {
  const cartItemsContainer = document.querySelector(".cart-items")
  const clearCartBtn = document.querySelector(".clear-cart-btn")
  const checkoutBtn = document.querySelector(".checkout-btn")

  if (cartItemsContainer) {
    // Quantity change
    cartItemsContainer.addEventListener("click", (event) => {
      const target = event.target

      // Decrease quantity
      if (target.classList.contains("quantity-decrease")) {
        const input = target.nextElementSibling
        const currentValue = Number.parseInt(input.value)

        if (currentValue > 1) {
          input.value = currentValue - 1
          updateCartItem(input)
        }
      }

      // Increase quantity
      if (target.classList.contains("quantity-increase")) {
        const input = target.previousElementSibling
        const currentValue = Number.parseInt(input.value)

        if (currentValue < 10) {
          input.value = currentValue + 1
          updateCartItem(input)
        }
      }

      // Remove item
      if (target.classList.contains("remove-item-btn") || target.closest(".remove-item-btn")) {
        const cartItem = target.closest(".cart-item")
        const itemId = cartItem.getAttribute("data-id")

        removeCartItem(itemId)
      }
    })

    // Quantity input change
    cartItemsContainer.addEventListener("change", (event) => {
      const target = event.target

      if (target.classList.contains("quantity-input")) {
        updateCartItem(target)
      }
    })
  }

  // Clear cart button
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      // Confirm before clearing
      if (confirm("Are you sure you want to clear your cart?")) {
        clearCart()
      }
    })
  }

  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // In a real app, this would redirect to checkout page
      alert("Proceeding to checkout...")
      // window.location.href = 'checkout.html';
    })
  }
}

/**
 * Update cart item
 * @param {HTMLElement} input - Quantity input element
 */
function updateCartItem(input) {
  const cartItem = input.closest(".cart-item")
  const itemId = cartItem.getAttribute("data-id")
  const quantity = Number.parseInt(input.value)

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Find item in cart
  const itemIndex = cart.findIndex((item) => item.id === itemId)

  if (itemIndex !== -1) {
    // Update quantity
    cart[itemIndex].quantity = quantity

    // Update item total in UI
    const itemPrice = cart[itemIndex].price
    const itemTotal = itemPrice * quantity
    const itemTotalElement = cartItem.querySelector(".cart-item-total p")

    if (itemTotalElement) {
      itemTotalElement.textContent = `$${itemTotal.toFixed(2)}`
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count and summary
    updateCartCount()
    updateCartSummary()
  }
}

/**
 * Remove item from cart
 * @param {string} itemId - Item ID to remove
 */
function removeCartItem(itemId) {
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Find item in cart
  const itemIndex = cart.findIndex((item) => item.id === itemId)

  if (itemIndex !== -1) {
    // Get item name for notification
    const itemName = cart[itemIndex].name

    // Remove item from cart
    cart.splice(itemIndex, 1)

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Show notification
    showNotification(`${itemName} removed from cart.`, "info")

    // Reload cart items
    loadCartItems()

    // Update cart count
    updateCartCount()
  }
}

/**
 * Clear cart
 */
function clearCart() {
  // Clear cart in localStorage
  localStorage.removeItem("cart")

  // Show notification
  showNotification("Your cart has been cleared.", "info")

  // Reload cart items
  loadCartItems()

  // Update cart count
  updateCartCount()
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

