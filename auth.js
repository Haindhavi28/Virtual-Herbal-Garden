/**
 * Virtual Herbal Garden - Authentication JavaScript
 * This file contains functionality for login and registration
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize auth tabs
    initAuthTabs()
  
    // Initialize password toggle
    initPasswordToggle()
  
    // Initialize password strength meter
    initPasswordStrengthMeter()
  
    // Initialize form validation
    initFormValidation()
  })
  
  /**
   * Initialize authentication tabs
   */
  function initAuthTabs() {
    const authTabs = document.querySelectorAll(".auth-tab")
    const authForms = document.querySelectorAll(".auth-form")
  
    if (authTabs.length > 0 && authForms.length > 0) {
      authTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          // Get tab type (login or register)
          const tabType = this.getAttribute("data-tab")
  
          // Remove active class from all tabs and forms
          authTabs.forEach((t) => t.classList.remove("active"))
          authForms.forEach((f) => f.classList.remove("active"))
  
          // Add active class to clicked tab and corresponding form
          this.classList.add("active")
          document.querySelector(`.${tabType}-form`).classList.add("active")
        })
      })
    }
  }
  
  /**
   * Initialize password toggle
   */
  function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll(".toggle-password")
  
    if (toggleButtons.length > 0) {
      toggleButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const passwordInput = this.parentElement.querySelector("input")
          const icon = this.querySelector("i")
  
          // Toggle password visibility
          if (passwordInput.type === "password") {
            passwordInput.type = "text"
            icon.classList.remove("fa-eye")
            icon.classList.add("fa-eye-slash")
          } else {
            passwordInput.type = "password"
            icon.classList.remove("fa-eye-slash")
            icon.classList.add("fa-eye")
          }
        })
      })
    }
  }
  
  /**
   * Initialize password strength meter
   */
  function initPasswordStrengthMeter() {
    const passwordInput = document.getElementById("register-password")
    const strengthMeter = document.querySelector(".strength-meter span")
    const strengthText = document.querySelector(".strength-text span")
  
    if (passwordInput && strengthMeter && strengthText) {
      passwordInput.addEventListener("input", function () {
        const password = this.value
        const strength = calculatePasswordStrength(password)
  
        // Update strength meter width and color
        strengthMeter.style.width = `${strength.score * 25}%`
  
        // Update strength meter color
        if (strength.score === 0) {
          strengthMeter.style.backgroundColor = "#dc3545" // Red
        } else if (strength.score === 1) {
          strengthMeter.style.backgroundColor = "#ffc107" // Yellow
        } else if (strength.score === 2) {
          strengthMeter.style.backgroundColor = "#fd7e14" // Orange
        } else if (strength.score === 3) {
          strengthMeter.style.backgroundColor = "#20c997" // Teal
        } else {
          strengthMeter.style.backgroundColor = "#28a745" // Green
        }
  
        // Update strength text
        strengthText.textContent = strength.message
      })
    }
  }
  
  /**
   * Calculate password strength
   * @param {string} password - The password to check
   * @returns {Object} Strength object with score and message
   */
  function calculatePasswordStrength(password) {
    // Initialize score
    let score = 0
  
    // Return early if password is empty
    if (password.length === 0) {
      return { score: 0, message: "Weak" }
    }
  
    // Check password length
    if (password.length >= 8) {
      score += 1
    }
  
    // Check for numbers
    if (/\d/.test(password)) {
      score += 1
    }
  
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    }
  
    // Check for uppercase and lowercase letters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 1
    }
  
    // Determine message based on score
    let message = ""
  
    switch (score) {
      case 0:
      case 1:
        message = "Weak"
        break
      case 2:
        message = "Fair"
        break
      case 3:
        message = "Good"
        break
      case 4:
        message = "Strong"
        break
      default:
        message = "Weak"
    }
  
    return { score, message }
  }
  
  /**
   * Initialize form validation
   */
  function initFormValidation() {
    const loginForm = document.getElementById("login-form")
    const registerForm = document.getElementById("register-form")
  
    // Login form validation
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault()
  
        // Get form inputs
        const email = document.getElementById("login-email").value
        const password = document.getElementById("login-password").value
  
        // Validate email
        if (!isValidEmail(email)) {
          showNotification("Please enter a valid email address.", "error")
          return
        }
  
        // Validate password
        if (password.length < 6) {
          showNotification("Password must be at least 6 characters.", "error")
          return
        }
  
        // In a real app, this would send a login request to the server
        // For demo purposes, we'll just show a success message
        showNotification("Login successful! Redirecting...", "success")
  
        // Simulate redirect after login
        setTimeout(() => {
          window.location.href = "index.html"
        }, 2000)
      })
    }
  
    // Register form validation
    if (registerForm) {
      registerForm.addEventListener("submit", (event) => {
        event.preventDefault()
  
        // Get form inputs
        const name = document.getElementById("register-name").value
        const email = document.getElementById("register-email").value
        const password = document.getElementById("register-password").value
        const confirmPassword = document.getElementById("register-confirm-password").value
        const termsAgreement = document.getElementById("terms-agreement").checked
  
        // Validate name
        if (name.trim() === "") {
          showNotification("Please enter your name.", "error")
          return
        }
  
        // Validate email
        if (!isValidEmail(email)) {
          showNotification("Please enter a valid email address.", "error")
          return
        }
  
        // Validate password
        if (password.length < 8) {
          showNotification("Password must be at least 8 characters.", "error")
          return
        }
  
        // Validate password strength
        const strength = calculatePasswordStrength(password)
        if (strength.score < 3) {
          showNotification("Please choose a stronger password.", "error")
          return
        }
  
        // Validate password confirmation
        if (password !== confirmPassword) {
          showNotification("Passwords do not match.", "error")
          return
        }
  
        // Validate terms agreement
        if (!termsAgreement) {
          showNotification("Please agree to the Terms of Service and Privacy Policy.", "error")
          return
        }
  
        // In a real app, this would send a registration request to the server
        // For demo purposes, we'll just show a success message
        showNotification("Registration successful! Redirecting...", "success")
  
        // Simulate redirect after registration
        setTimeout(() => {
          window.location.href = "index.html"
        }, 2000)
      })
    }
  }
  
  /**
   * Validate email format
   * @param {string} email - The email to validate
   * @returns {boolean} Whether the email is valid
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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
  
  