// Card Animation
AOS.init({
  once: true,
  duration: 1000,
  delay: 200,
});

// Function to fetch multiple products based on a list of product IDs
async function fetchProductDetails(productIds) {
  const productDetails = {};
  for (let id of productIds) {
    const response = await fetch(`https://rossthesloth-gym.netlify.app/.netlify/functions/get_product?id=${id}`);
    const data = await response.json();
    if (data && data.length > 0) {
      productDetails[id] = data[0];
    }
  }
  return productDetails;
}


// Function to populate product details
function populateProductDetails() {
  const cards = document.querySelectorAll('.card[data-product-id]');
  cards.forEach(async (card) => {
      const productId = card.getAttribute('data-product-id');
      const productData = await fetchProductDetails([productId]); // Updated to pass an array
      if (productData && productData[productId]) {
          const product = productData[productId];
          if (product.Name && product.Price) {
              const img = card.querySelector('.card-img-top');
              
              // Check if the card has the next sibling which is expected to be h3
              const title = card.nextElementSibling;
              if (!title) return;  // If there's no title, exit the current loop iteration

              const price = title.nextElementSibling; // Get the next element of the h3 which is the p tag for the price

              if (img) img.src = product.Images ? product.Images.split(';')[0].trim() : '';  
              if (title) title.textContent = product.Name;
              if (price) price.textContent = `Price: $${product.Price.toFixed(2)}`;
          }
      }
  });
}




// Function to update the cart count displayed
function updateCartCount() {
  const cart = getCartItems();
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
      cartCountElement.innerText = cart.length;
  }
}

// Makes the navbar transparent/white on scroll
$(document).on('scroll', function() {
  if ($(window).scrollTop() > 50) {
      $('.transparent-nav').addClass('navbar-scrolled');
      $('.cart-icon').removeClass('cart-icon-white').addClass('cart-icon-black');
  } else {
      $('.transparent-nav').removeClass('navbar-scrolled');
      $('.cart-icon').removeClass('cart-icon-black').addClass('cart-icon-white');
  }
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to render the cart
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';  // Clear existing items

  const cartItems = getCartItems();
  cartItems.forEach((item, index) => {
      const productDetails = fetchedProductDetails[item.id];
      if (productDetails) {
          cartItemsDiv.innerHTML += `
          <div class="product-container d-flex align-items-center">
              <div class="product-img-container img-card">
                  <a href="product.html?id=${item.id}">
                      <img src="${productDetails.Images.split(';')[0].trim()}" alt="${productDetails.Name}" class="product-img" />
                  </a>
              </div>
              <div class="product-info ml-3">
                  <div>${productDetails.Name}</div>
                  <div>${capitalizeFirstLetter(item.color)} | ${capitalizeFirstLetter(item.size)}</div>
                  <div>$${productDetails.Price}</div>
              </div>
              <i class="bi bi-x-lg ml-auto" onclick="removeFromCart(${index})" style="cursor:pointer;"></i>
          </div>`;
      }
  });
}

// Function to toggle the slide-in cart
async function toggleCart() {
  const cart = document.getElementById('slide-in-cart');
  const backdrop = document.getElementById('cart-backdrop');

  cart.classList.toggle('show');

  if (cart.classList.contains('show')) {
      document.body.style.overflow = 'hidden';  // Prevent scrolling
      backdrop.style.display = 'block';
      setTimeout(() => {
          backdrop.style.opacity = '1';
      }, 10);
  } else {
      document.body.style.overflow = '';  // Restore scrolling
      backdrop.style.opacity = '0';
      setTimeout(() => {
          backdrop.style.display = 'none';
      }, 300);
  }

  // Fetch items from local storage
  const cartItems = getCartItems();

  // Fetch details for all product IDs in the cart
  const productIds = cartItems.map(item => item.id);
  fetchedProductDetails = await fetchProductDetails(productIds);

  // Render the cart items
  renderCart();
}

// Function to remove an item from the cart by index
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(index, 1); // Remove item at the given index
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update the cart count and re-render the cart directly
  updateCartCount();
  renderCart();
}

// Function to add an item to the cart
function addToCart(product) {
  const selectedSize = document.getElementById('size').value;
  const selectedColor = document.getElementById('color').value;

  product.size = selectedSize;
  product.color = selectedColor;

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Function to get all items from the cart
function getCartItems() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Function to clear the entire cart
function clearCart() {
  localStorage.removeItem('cart');
  updateCartCount();
}


$(document).ready(function(){
  // Initialize cart count
  updateCartCount();

  // Populate product details dynamically
  populateProductDetails();

  // Attach event listeners related to the cart
  document.querySelector('.cart').addEventListener('click', toggleCart);
  document.getElementById('close-cart').addEventListener('click', toggleCart);
  document.getElementById('cart-backdrop').addEventListener('click', toggleCart);
  document.getElementById('cart-count').addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent the parent (cart icon) event from firing again
      toggleCart();
  });
  $("#mainImage").click(function(){
      let imgSrc = $(this).attr("src");
      $("#popupImage").attr("src", imgSrc);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const addToCartButton = document.getElementById('addToCartButton');
  if (addToCartButton) {
      addToCartButton.addEventListener('click', function() {
          const product = {
              id: productId,
              name: 'Product Name based on productId',
              price: 10
          };
  
          addToCart(product);
  
          // Position the popup beneath the cart icon
          const cartIcon = document.querySelector('.cart');
          const rect = cartIcon.getBoundingClientRect();
          const popup = document.getElementById('cartAddedPopup');
          popup.style.top = (rect.bottom + window.scrollY) + 'px';
          popup.style.right = (window.innerWidth - rect.right) + 'px';
  
          // Show the popup
          $('#cartAddedPopup').show();
  
          setTimeout(function() {
              $('#cartAddedPopup').hide();
          }, 2000);
      });
  }
  if (window.location.href.includes('items.html')) {
    populateAllProductCards();
}
});

async function fetchAndPopulateProducts() {
  try {
      const response = await fetch('https://rossthesloth-gym.netlify.app/.netlify/functions/get_product');
      const products = await response.json();
      
      populateAllProductCards(products);

  } catch (err) {
      console.error("Error fetching and populating products:", err);
  }
}

function populateAllProductCards(products) {
  const productsRow = document.getElementById('productsRow');

  products.forEach(product => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'col-12 col-md-3 card-container mb-5';

      const card = document.createElement('div');
      card.className = 'card mb-4 h-100';  
      card.setAttribute('data-product-id', product._id);

      // Adding the click event to the card to redirect to its product detail page
      card.onclick = function() {
          window.location.href = `product.html?id=${product._id}`;
      };

      const img = document.createElement('img');
      img.className = 'card-img-top img-fluid';
      img.alt = 'Product Image';
      img.src = product.Images ? product.Images.split(';')[0].trim() : 'default-image.jpg';
      card.appendChild(img);

      cardContainer.appendChild(card);

      const title = document.createElement('h3');
      title.className = 'card-title text-center';
      title.textContent = product.Name;
      cardContainer.appendChild(title);

      const price = document.createElement('p');
      price.className = 'card-text text-center';
      price.textContent = `Price: $${product.Price.toFixed(2)}`;
      cardContainer.appendChild(price);

      productsRow.appendChild(cardContainer);
  });
}





// Call the function to start the process
fetchAndPopulateProducts();

