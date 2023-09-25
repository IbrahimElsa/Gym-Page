// Card Animation
AOS.init({
  once: true,
  duration: 1000,
  delay: 200,
});

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
const backdrop = document.getElementById('cart-backdrop');  // get the backdrop element

cart.classList.toggle('show');

if (cart.classList.contains('show')) {
  backdrop.style.display = 'block';
  setTimeout(() => {
      backdrop.style.opacity = '1';  // fade in
  }, 10);
} else {
  backdrop.style.opacity = '0';  // fade out
  setTimeout(() => {
      backdrop.style.display = 'none';
  }, 300);
}

// Fetch items from local storage
const cartItems = getCartItems();

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

$(document).ready(function(){
// Initialize cart count
updateCartCount();

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

// Dynamic fetching and population of product details based on product ID from each card
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    const productId = card.getAttribute('data-product-id');
    fetch(`https://rossthesloth-gym.netlify.app/.netlify/functions/get_product?id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const product = data[0];
                const imgElement = card.querySelector('.card-img-top');
                if (imgElement && product.Images) {
                    const images = product.Images.split(';');
                    imgElement.src = images[0].trim();
                    imgElement.alt = product.Name;
                }

                const nameElement = card.querySelector('.card-title');
                if (nameElement) {
                    nameElement.textContent = product.Name;
                }

                const priceElement = card.querySelector('.card-text');
                if (priceElement) {
                    priceElement.textContent = `Price: $${product.Price}`;
                }
            }
        })
        .catch(err => {
            console.error("Failed to fetch product:", err);
        });
});
});

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
