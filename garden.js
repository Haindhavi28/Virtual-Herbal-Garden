/**
 * Virtual Herbal Garden - Garden Page JavaScript
 * Pixel art style interactive garden
 */

// Declare addToCart function (assuming it's defined elsewhere or will be)
let addToCart;

document.addEventListener("DOMContentLoaded", () => {
    // Initialize herb filtering
    initHerbFiltering();

    // Initialize herb search
    initHerbSearch();

    // Initialize herb modal
    initHerbModal();

    // Initialize garden map interactions
    initGardenMap();
});

/**
 * Initialize herb filtering
 */
function initHerbFiltering() {
    const filterSelect = document.getElementById("herb-filter");
    const herbPoints = document.querySelectorAll(".herb-point");

    if (filterSelect && herbPoints.length > 0) {
        filterSelect.addEventListener("change", function() {
            const selectedCategory = this.value;

            herbPoints.forEach((point) => {
                if (selectedCategory === "all") {
                    point.style.display = "block";
                } else {
                    const herbType = point.getAttribute("data-herb");

                    if (herbType === selectedCategory) {
                        point.style.display = "block";
                    } else {
                        point.style.display = "none";
                    }
                }
            });
        });
    }
}

/**
 * Initialize herb search
 */
function initHerbSearch() {
    const searchInput = document.getElementById("herb-search");
    const searchButton = document.getElementById("search-btn");
    const herbPoints = document.querySelectorAll(".herb-point");

    if (searchInput && searchButton && herbPoints.length > 0) {
        // Function to perform search
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();

            if (searchTerm === "") {
                // If search is empty, show all herbs
                herbPoints.forEach((point) => {
                    point.style.display = "block";
                });
            } else {
                // Filter herbs based on search term
                herbPoints.forEach((point) => {
                    const herbName = point.querySelector("h4").textContent.toLowerCase();

                    if (herbName.includes(searchTerm)) {
                        point.style.display = "block";
                    } else {
                        point.style.display = "none";
                    }
                });
            }
        }

        // Search on button click
        searchButton.addEventListener("click", performSearch);

        // Search on Enter key press
        searchInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                performSearch();
            }
        });
    }
}

/**
 * Initialize herb modal
 */
/**
 * Initialize herb modal
 */
function initHerbModal() {
  const modal = document.getElementById("herb-modal");
  const modalBody = modal ? modal.querySelector(".herb-modal-body") : null;
  const closeButton = modal ? modal.querySelector(".close-modal") : null;
  const herbPoints = document.querySelectorAll(".herb-point");

  if (modal && modalBody && closeButton && herbPoints.length > 0) {
      // Open modal when herb point is clicked
      herbPoints.forEach((point) => {
          point.addEventListener("click", function() {
              const herbType = this.getAttribute("data-herb");

              // Load herb data
              const herbData = getHerbData(herbType);

              if (herbData) {
                  // Populate modal with herb data, REMOVING PRICE AND ADD TO CART
                  modalBody.innerHTML = `
                      <div class="herb-modal-header">
                          <h2>${herbData.name}</h2>
                          <p class="herb-scientific">${herbData.family}</p>
                      </div>
                      <div class="herb-modal-grid">
                          <div class="herb-modal-image">
                              <img src="${herbData.image}" alt="${herbData.name}" style="image-rendering: pixelated;">
                          </div>
                          <div class="herb-modal-info">
                              <div class="herb-info-section">
                                  <h3>DESCRIPTION</h3>
                                  <p>${herbData.description}</p>
                              </div>
                              <div class="herb-info-section">
                                  <h3>MEDICINAL USES</h3>
                                  <ul>
                                      ${herbData.medicinalUses.map((use) => `<li>${use}</li>`).join("")}
                                  </ul>
                              </div>
                              <div class="herb-info-section">
                                  <h3>GROWING INFORMATION</h3>
                                  <div class="growing-info-grid">
                                      <div class="growing-info-item">
                                          <span class="info-label">DIFFICULTY:</span>
                                          <span class="info-value">${herbData.growingInfo.difficulty}</span>
                                      </div>
                                      <div class="growing-info-item">
                                          <span class="info-label">LIGHT:</span>
                                          <span class="info-value">${herbData.growingInfo.light}</span>
                                      </div>
                                      <div class="growing-info-item">
                                          <span class="info-label">WATER:</span>
                                          <span class="info-value">${herbData.growingInfo.water}</span>
                                      </div>
                                      <div class="growing-info-item">
                                          <span class="info-label">SOIL:</span>
                                          <span class="info-value">${herbData.growingInfo.soil}</span>
                                      </div>
                                  </div>
                                  <p>${herbData.growingInfo.tips}</p>
                              </div>
                          </div>
                      </div>
                      `;

                  // Show modal
                  modal.style.display = "flex";
                  document.body.style.overflow = "hidden";
              }
          });
      });

      // Close modal when close button is clicked
      closeButton.addEventListener("click", () => {
          modal.style.display = "none";
          document.body.style.overflow = "";
      });

      // Close modal when clicking outside of modal content
      modal.addEventListener("click", (event) => {
          if (event.target === modal) {
              modal.style.display = "none";
              document.body.style.overflow = "";
          }
      });

      // Close modal when Escape key is pressed
      document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && modal.style.display === "flex") {
              modal.style.display = "none";
              document.body.style.overflow = "";
          }
      });
  }
}
/**
 * Initialize garden map interactions
 */
function initGardenMap() {
    const mapContainer = document.querySelector(".garden-map-container");
    const map = mapContainer ? mapContainer.querySelector(".garden-map") : null;
    const zoomInBtn = mapContainer ? mapContainer.querySelector(".map-zoom-in") : null;
    const zoomOutBtn = mapContainer ? mapContainer.querySelector(".map-zoom-out") : null;
    const resetBtn = mapContainer ? mapContainer.querySelector(".map-reset") : null;

    if (map && zoomInBtn && zoomOutBtn && resetBtn) {
        let scale = 1;
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let startX, startY, initialTranslateX, initialTranslateY;

        // Function to update map transform
        function updateMapTransform() {
            map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }

        // Zoom in button
        zoomInBtn.addEventListener("click", () => {
            scale = Math.min(scale + 0.2, 3);
            updateMapTransform();
        });

        // Zoom out button
        zoomOutBtn.addEventListener("click", () => {
            scale = Math.max(scale - 0.2, 1);
            updateMapTransform();
        });

        // Reset button
        resetBtn.addEventListener("click", () => {
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateMapTransform();
        });

        // Map dragging
        mapContainer.addEventListener("mousedown", (event) => {
            if (event.target === mapContainer || event.target === map) {
                isDragging = true;
                startX = event.clientX;
                startY = event.clientY;
                initialTranslateX = translateX;
                initialTranslateY = translateY;
                mapContainer.style.cursor = "grabbing";
            }
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                translateX = initialTranslateX + dx;
                translateY = initialTranslateY + dy;
                updateMapTransform();
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            mapContainer.style.cursor = "default";
        });
    }
}

/**
 * Get herb data (mock data)
 */
function getHerbData(herbType) {
    const herbsData = {
        nightshade: {
            id: 1,
            name: "NIGHTSHADE FAMILY",
            family: "Solanaceae",
            image: "nightshade family.jpg",
            description: "The nightshade family includes many important medicinal and culinary plants like tomatoes, potatoes, eggplants, and peppers. These plants often contain alkaloids that can have powerful effects on the human body, both beneficial and potentially harmful.",
            medicinalUses: [
                "Pain relief and anti-inflammatory properties",
                "Used in treatment of digestive disorders",
                "Some species have sedative effects",
                "Source of important pharmaceutical compounds",
                "Used in traditional medicine for various ailments"
            ],
            growingInfo: {
                difficulty: "Moderate",
                light: "Full Sun to Partial Shade",
                water: "Moderate",
                soil: "Well-draining, fertile soil",
                tips: "Nightshades prefer warm temperatures and are sensitive to frost. Rotate crops annually to prevent disease buildup in the soil."
            },
            price: 12.99
        },
        mint: {
            id: 2,
            name: "MINT FAMILY",
            family: "Lamiaceae",
            image: "Mint family .webp",
            description: "The mint family is known for its aromatic leaves and square stems. These plants are widely used in cooking, medicine, and aromatherapy due to their refreshing scents and flavors. Includes peppermint, spearmint, basil, and rosemary.",
            medicinalUses: [
                "Aids digestion and relieves nausea",
                "Natural decongestant for colds",
                "Headache relief when applied topically",
                "Antiseptic properties for minor wounds",
                "Calming effects for stress and anxiety"
            ],
            growingInfo: {
                difficulty: "Easy",
                light: "Partial to Full Sun",
                water: "Moderate to High",
                soil: "Rich, moist soil",
                tips: "Mint spreads aggressively through runners. Plant in containers or use barriers to control its growth. Harvest leaves regularly to promote bushier plants."
            },
            price: 9.99
        },
        daisy: {
            id: 3,
            name: "DAISY FAMILY",
            family: "Asteraceae",
            image: "daisy family.webp",
            description: "The daisy family is one of the largest plant families, characterized by composite flowers. Many species have medicinal properties and are used in herbal remedies. Includes chamomile, echinacea, calendula, and dandelion.",
            medicinalUses: [
                "Anti-inflammatory properties",
                "Skin soothing for irritations",
                "Digestive aid and mild sedative",
                "Immune system support",
                "Wound healing properties"
            ],
            growingInfo: {
                difficulty: "Easy to Moderate",
                light: "Full Sun",
                water: "Moderate",
                soil: "Well-draining soil",
                tips: "Deadhead flowers regularly to encourage more blooms. Many daisy family plants are drought-tolerant once established."
            },
            price: 11.49
        },
        grass: {
            id: 4,
            name: "GRASS FAMILY",
            family: "Poaceae",
            image: "grass family.png",
            description: "The grass family includes many important cereal crops as well as medicinal grasses. These plants are fundamental to human agriculture and nutrition. Includes wheat, rice, corn, bamboo, and lemongrass.",
            medicinalUses: [
                "Source of nutritious grains and fibers",
                "Some species have diuretic properties",
                "Used in traditional wound care",
                "Source of antioxidant-rich young shoots",
                "Bamboo has various medicinal applications"
            ],
            growingInfo: {
                difficulty: "Easy",
                light: "Full Sun",
                water: "Varies by species",
                soil: "Adaptable to many soil types",
                tips: "Grasses generally prefer well-drained soil. Many are drought-tolerant once established. Divide clumping grasses every few years to maintain vigor."
            },
            price: 8.99
        },
        parsley: {
            id: 5,
            name: "PARSLEY FAMILY",
            family: "Apiaceae",
            image: "parsley family.png",
            description: "The parsley family includes many culinary herbs and vegetables. These plants are characterized by their umbrella-shaped flower clusters and often contain beneficial essential oils. Includes parsley, dill, cilantro, fennel, and carrots.",
            medicinalUses: [
                "Digestive aids and carminatives",
                "Some species have anti-inflammatory effects",
                "Source of important nutrients",
                "Used in detoxification remedies",
                "Some have antimicrobial properties"
            ],
            growingInfo: {
                difficulty: "Moderate",
                light: "Full Sun to Partial Shade",
                water: "Regular watering",
                soil: "Rich, well-draining soil",
                tips: "Many parsley family plants are biennials. Allow some plants to go to seed for continuous harvest. Watch for pests like carrot flies."
            },
            price: 10.99
        },
        ginger: {
            id: 6,
            name: "GINGER FAMILY",
            family: "Zingiberaceae",
            image: "ginger family.png",
            description: "The ginger family includes many tropical plants with aromatic rhizomes. These plants are valued for their culinary, medicinal, and ornamental qualities. Includes ginger, turmeric, cardamom, and galangal.",
            medicinalUses: [
                "Anti-nausea and digestive aid",
                "Anti-inflammatory properties",
                "Pain relief for arthritis",
                "Immune system support",
                "Circulation improvement"
            ],
            growingInfo: {
                difficulty: "Moderate to Hard",
                light: "Partial Shade",
                water: "Keep consistently moist",
                soil: "Rich, organic, well-draining",
                tips: "Ginger family plants prefer warm, humid conditions. In cooler climates, grow in containers that can be brought indoors. Mulch heavily to retain moisture."
            },
            price: 14.99
        }
    };

    return herbsData[herbType] || null;
}

/**
 * Show notification
 */
function showNotification(message, type = "info") {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector(".notification-container");

    if (!notificationContainer) {
        notificationContainer = document.createElement("div");
        notificationContainer.className = "notification-container";
        document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Add notification to container
    notificationContainer.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    // Set up close button
    const closeButton = notification.querySelector(".notification-close");
    closeButton.addEventListener("click", () => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove("show");
            setTimeout(() => {
                notification.remove();
            }, 300);
        }   
    }, 5000);
}