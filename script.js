// Card Animation
AOS.init({
    once: true,
    duration: 1000,
    delay: 200,
});

function changeImage(newSrc, clickedThumbnail) {
    document.getElementById('mainImage').src = newSrc;
    var thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(function(thumb) {
        thumb.classList.remove('thumbnail-active');
    });
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

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Attach addToCart function to "Add to Cart" button
    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            // Fetch the product details you have. This is just an example.
            const product = {
                id: productId,
                name: 'Product Name based on productId',
                price: 10 // price based on productId
            };

            addToCart(product);
            alert('Product added to cart');  // You can replace this with a better UI update
        });
    }
});

// Function to add an item to the cart
function addToCart(product) {
  // Retrieve existing cart from local storage
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Add the new product to the cart
  cart.push(product);

  // Save the updated cart back to local storage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to get all items from the cart
function getCartItems() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Function to remove an item from the cart by id
function removeFromCart(productId) {
  // Retrieve existing cart from local storage
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Remove the product with the given id
  const updatedCart = cart.filter(item => item.id !== productId);

  // Save the updated cart back to local storage
  localStorage.setItem('cart', JSON.stringify(updatedCart));
}

// Function to clear the entire cart
function clearCart() {
  localStorage.removeItem('cart');
}
