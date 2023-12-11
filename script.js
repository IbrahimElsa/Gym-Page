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
// Makes the navbar transparent/white on scroll
$(document).on('scroll', function() {
    if ($(window).scrollTop() > 50) {
        $('.transparent-nav').addClass('navbar-scrolled');
        $('.cart-icon').removeClass('cart-icon-white').addClass('cart-icon-black');
        $('.navbar-toggler').addClass('navbar-toggler-scrolled');
        $('.navbar-background').addClass('navbar-bg');
    } else {
        $('.transparent-nav').removeClass('navbar-scrolled');
        $('.cart-icon').removeClass('cart-icon-black').addClass('cart-icon-white');
        $('.navbar-toggler').removeClass('navbar-toggler-scrolled');
        $('.navbar-background').removeClass('navbar-bg');
    }
  });
  
// Function to populate product details on index.html
function populateProductDetails() {
  const cards = document.querySelectorAll('.card[data-product-id]');
  cards.forEach(async (card) => {
      const productId = card.getAttribute('data-product-id');
      const productData = await fetchProductDetails([productId]);
      if (productData && productData[productId]) {
          const product = productData[productId];
          if (product.Name && product.Price) {
              const img = card.querySelector('.card-img-top');
              const title = card.nextElementSibling;
              const price = title.nextElementSibling;
              if (img) img.src = product.Images ? product.Images.split(';')[0].trim() : '';  
              if (title) title.textContent = product.Name;
              if (price) price.textContent = `Price: $${product.Price.toFixed(2)}`;
          }
      }
  });
}

// ... [remaining cart functions, unchanged] ...

// Function to fetch and populate all products for items.html
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
    productsRow.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        productsRow.innerHTML += `
            <div class="col-6 col-sm-4 col-md-3 mb-5">
                <div class="card mb-4 h-100" data-product-id="${product._id}" onclick="window.location.href='product.html?id=${product._id}'">
                    <img class="card-img-top img-fluid" src="${product.Images.split(';')[0].trim()}" alt="Product Image">
                </div>
                <h3 class="card-title text-center">${product.Name}</h3>
                <p class="card-text text-center">Price: $${product.Price.toFixed(2)}</p>
            </div>
        `;
    });
}



// Function to randomly select a specified number of products
function getRandomProducts(products, count) {
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    return shuffledProducts.slice(0, count);
}

// Function to display products in 'Items You May Like' section for product.html
function displayItemsYouMayLike(products) {
    const container = document.querySelector('.items-you-may-like .row');
    container.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        container.innerHTML += `
            <div class="col-6 col-md-3 card-container mb-5">
                <div class="card mb-4 h-100" data-product-id="${product._id}" onclick="window.location.href='product.html?id=${product._id}'">
                    <img class="card-img-top img-fluid" src="${product.Images.split(';')[0].trim()}" alt="${product.Name}">
                    <h3 class="card-title text-center">${product.Name}</h3>
                    <p class="card-text text-center">Price: $${product.Price.toFixed(2)}</p>
                </div>
            </div>
        `;
    });
}

// Function to fetch all products and populate 'Items You May Like' section for product.html
async function fetchAndDisplayItemsYouMayLike() {
    try {
        const response = await fetch('https://rossthesloth-gym.netlify.app/.netlify/functions/get_product');
        const products = await response.json();
        const selectedProducts = getRandomProducts(products, 4); // Select 4 random products
        displayItemsYouMayLike(selectedProducts);
    } catch (err) {
        console.error("Error fetching products for 'Items You May Like':", err);
    }
}

$(document).ready(function(){
    // Determine the current page
    const pathname = window.location.pathname;

    if (pathname.includes('items.html')) {
        // Populate all products on items.html
        fetchAndPopulateProducts();
    } else if (pathname.includes('product.html')) {
        // Populate 'Items You May Like' on product.html
        fetchAndDisplayItemsYouMayLike();
    } else if (pathname === '/' || pathname.includes('index.html')) {
        // Populate product details on index.html
        populateProductDetails();
    }

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

    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
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
});
