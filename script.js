// card Animation
AOS.init({
    once: true,
    duration: 1000, 
    delay: 200,  
  });

  function changeImage(newSrc, clickedThumbnail) {
    document.getElementById('mainImage').src = newSrc;

    // Remove the active class from all thumbnails
    var thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(function(thumb) {
        thumb.classList.remove('thumbnail-active');
    });

    // Add the active class to the clicked thumbnail
    clickedThumbnail.classList.add('thumbnail-active');
}

$(document).on('scroll', function() {
  if ($(window).scrollTop() > 50) {
      $('.transparent-nav').addClass('navbar-scrolled');
  } else {
      $('.transparent-nav').removeClass('navbar-scrolled');
  }
});

$(document).ready(function(){
  $("#mainImage").click(function(){
      let imgSrc = $(this).attr("src");
      $("#popupImage").attr("src", imgSrc);
  });
});


let cart = [];  // Initialize cart as an empty array
const addToCartButton = document.getElementById('addToCartButton');  // Capture "Add to Cart" button by its id

if (addToCartButton) {
  addToCartButton.addEventListener('click', function() {
    const selectedSize = document.getElementById('size').value;
    const selectedColor = document.getElementById('color').value;
    
    const productToAdd = {
      id: productId,  // Assuming you have productId from your existing code
      name: document.getElementById('product-title').textContent,
      price: parseFloat(document.getElementById('product-price').textContent.replace('Price: $', '')),
      size: selectedSize,
      color: selectedColor,
      quantity: 1  // Initially set quantity to 1
    };

    // Add to local cart and update cart on the server
    addToLocalCart(productToAdd);
    addToServerCart(productToAdd);
  });
}

// Function to add product to local cart
function addToLocalCart(product) {
  const existingProduct = cart.find(p => p.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push(product);
  }
  // Optionally: Update cart UI here
}

// Function to update cart on the server via Netlify function
function addToServerCart(product) {
  fetch('functions/get_product/cart-handler.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);  // Log server response
  });
}

// Fetching cart from server (assuming you have this function on the server)
fetch('functions/get_product/cart-handler.js', {
  method: 'GET'
})
.then(response => response.json())
.then(data => {
  cart = data;
  updateCartUI();  // Assuming you have this function to update the cart UI
});

// Function to update the cart UI (Placeholder, you would fill this in)
function updateCartUI() {
  const cartListElement = document.getElementById('cartList'); // Reference to the cartList div
  let cartHTML = '<ul>';

  // Loop through each item in the cart to generate HTML
  cart.forEach((item) => {
    cartHTML += `
      <li>
        ${item.name} - Size: ${item.size}, Color: ${item.color} <br>
        Quantity: ${item.quantity}, Price: $${item.price.toFixed(2)}
      </li>
    `;
  });

  cartHTML += '</ul>';
  
  // Update the cart UI
  cartListElement.innerHTML = cartHTML;
  
  // Optionally, you could also update the total price
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  cartListElement.innerHTML += `<p>Total Price: $${totalPrice.toFixed(2)}</p>`;
}