document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from server when the page loads
// Fetching data (simplified example)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

fetch(`https://your-domain/.netlify/functions/get_product?id=${productId}`)
    .then(response => response.json())
    .then(data => {
        // Assuming 'data' is an object containing your product's information
        document.getElementById('product-title').textContent = data.Name;
        document.getElementById('product-price').textContent = `Price: $${data.Price}`;
        document.getElementById('product-description').innerHTML = data.Description;
        // ... populate other elements ...
    })
    .catch(error => {
        console.error('Failed to fetch product data', error);
    });

});
