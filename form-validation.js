// Form validation script for Virtual Herbal Garden contact form
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const formFields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
  };

  // Create error message elements
  function createErrorElements() {
    for (const field in formFields) {
      if (formFields[field]) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.id = `${field}-error`;
        formFields[field].insertAdjacentElement('afterend', errorElement);
      }
    }
  }
  createErrorElements();

  // Add CSS for error styling
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .error-message {
      color: #ff3333;
      font-size: 0.9rem;
      margin-top: 5px;
      font-family: 'VT323', monospace;
      border-left: 4px solid #ff3333;
      padding-left: 10px;
      display: none;
    }
    
    .form-group.error input, 
    .form-group.error select, 
    .form-group.error textarea {
      border-color: #ff3333;
      background-color: rgba(255, 51, 51, 0.05);
    }
    
    .form-group.success input, 
    .form-group.success select, 
    .form-group.success textarea {
      border-color: #629554;
      background-color: rgba(98, 149, 84, 0.05);
    }
    
    .shake {
      animation: shake 0.5s;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(styleElement);

  // Validation functions
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    },
    
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      // Email regex pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) return 'Please enter a valid email address';
      return '';
    },
    
    phone: (value) => {
      if (!value.trim()) return ''; // Phone is optional
      // Phone regex pattern (accepts various formats)
      const phonePattern = /^(\+\d{1,3}[- ]?)?$$?(\d{3})$$?[- ]?(\d{3})[- ]?(\d{4})$/;
      if (!phonePattern.test(value)) return 'Please enter a valid phone number';
      return '';
    },
    
    subject: (value) => {
      if (!value || value === '') return 'Please select a subject';
      return '';
    },
    
    message: (value) => {
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      return '';
    }
  };

  // Validate a single field
  function validateField(field, showError = true) {
    const value = formFields[field].value;
    const errorMessage = validators[field](value);
    const errorElement = document.getElementById(`${field}-error`);
    const formGroup = formFields[field].closest('.form-group');
    
    if (errorMessage && showError) {
      formGroup.classList.add('error');
      formGroup.classList.remove('success');
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
      return false;
    } else {
      formGroup.classList.remove('error');
      if (value.trim()) {
        formGroup.classList.add('success');
      } else {
        formGroup.classList.remove('success');
      }
      errorElement.style.display = 'none';
      return true;
    }
  }

  // Validate all fields
  function validateForm() {
    let isValid = true;
    
    for (const field in formFields) {
      if (!validateField(field)) {
        isValid = false;
        // Add shake animation to invalid fields
        formFields[field].closest('.form-group').classList.add('shake');
        setTimeout(() => {
          formFields[field].closest('.form-group').classList.remove('shake');
        }, 500);
      }
    }
    
    return isValid;
  }

  // Real-time validation on input/change
  for (const field in formFields) {
    if (formFields[field]) {
      // Validate on blur (when user leaves the field)
      formFields[field].addEventListener('blur', () => {
        validateField(field);
      });
      
      // Validate on input (as user types) but don't show errors immediately
      formFields[field].addEventListener('input', () => {
        if (formFields[field].closest('.form-group').classList.contains('error')) {
          validateField(field);
        }
      });
    }
  }

  // Form submission handler
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Create success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.style.cssText = `
        background-color: var(--primary-color);
        color: white;
        padding: 15px;
        margin-top: 20px;
        border: 4px solid #000;
        box-shadow: 4px 4px 0px #000;
        text-align: center;
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
      `;
      successMessage.textContent = 'MESSAGE SENT SUCCESSFULLY! WE\'LL GET BACK TO YOU SOON.';
      
      // Show success message
      contactForm.appendChild(successMessage);
      
      // Reset form
      contactForm.reset();
      
      // Remove success classes
      for (const field in formFields) {
        if (formFields[field]) {
          formFields[field].closest('.form-group').classList.remove('success');
        }
      }
      
      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    }
  });
});