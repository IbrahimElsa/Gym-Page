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


let cart = [];
const addToCartButton = document.getElementById('addToCartButton');

if (addToCartButton) {
    addToCartButton.addEventListener('click', function () {
        const selectedSize = document.getElementById('size').value;
        const selectedColor = document.getElementById('color').value;

        const productToAdd = {
            // id: productId,  // Define productId appropriately
            name: document.getElementById('product-title').textContent,
            price: parseFloat(document.getElementById('product-price').textContent.replace('Price: $', '')),
            size: selectedSize,
            color: selectedColor,
            quantity: 1,
        };

        addToLocalCart(productToAdd);
        addToServerCart(productToAdd);
    });
}

function addToLocalCart(product) {
    const existingProduct = cart.find(p => p.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }
}

function addToServerCart(product) {
    fetch('functions/get_product/cart-handler.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => Promise.reject(text));
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

// Fetching cart from server
fetch('functions/get_product/cart-handler.js', {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    cart = data;
    updateCartUI();
});

function updateCartUI() {
    const cartListElement = document.getElementById('cartList');
    let cartHTML = '<ul>';

    cart.forEach((item) => {
        cartHTML += `
          <li>
            ${item.name} - Size: ${item.size}, Color: ${item.color} <br>
            Quantity: ${item.quantity}, Price: $${item.price.toFixed(2)}
          </li>
        `;
    });

    cartHTML += '</ul>';
    cartListElement.innerHTML = cartHTML;

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartListElement.innerHTML += `<p>Total Price: $${totalPrice.toFixed(2)}</p>`;
}