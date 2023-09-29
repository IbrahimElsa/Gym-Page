// Card Animation
AOS.init({
  once: true,
  duration: 1000,
  delay: 200,
});

// Function to fetch product details based on product ID
async function fetchProductDetails(productId) {
  try {
      const response = await fetch(`https://rossthesloth-gym.netlify.app/.netlify/functions/get_product?id=${productId}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("There was a problem with the fetch operation:", error.message);
      return null;
  }
}


function populateProductDetails() {
  const cards = document.querySelectorAll('.card[data-product-id]');
  cards.forEach(async (card) => {
      const productId = card.getAttribute('data-product-id');
      console.log("Fetching product details for ID:", productId); // Debugging line
      const productData = await fetchProductDetails(productId);

      if (productData && productData.length > 0) {
          const product = productData[0];
          
          if (product.Name && product.Price) {
              const img = card.querySelector('.card-img-top');
              const title = card.querySelector('.card-title');
              const price = card.querySelector('.card-text');

              if (img) img.src = product.Images ? product.Images.split(';')[0].trim() : '';  // Defaulting to the first image
              if (title) title.textContent = product.Name;
              if (price) price.textContent = `Price: $${product.Price}`;
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
      backdrop.style.display = 'block';
      setTimeout(() => {
          backdrop.style.opacity = '1';
      }, 10);
  } else {
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

  // Attach addToCart function to "Add to Cart" button
  const addToCartButton = document.getElementById('addToCartButton');
  if (addToCartButton) {
      addToCartButton.addEventListener('click', function() {
          const product = {
              id: productId,
              name: 'Product Name based on productId',
              price: 10
          };

          addToCart(product);
          alert('Product added to cart');
      });
  }
});
