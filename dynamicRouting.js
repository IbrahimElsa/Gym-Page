document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from server when the page loads
    const productId = window.location.pathname.split('/').pop();
    fetch(`/api/get_product?id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Populate the HTML template with product data
                const product = data[0];
                document.querySelector('.product-details h2').innerText = product.Name;
                document.querySelector('.product-details strong').innerText = `Price: $${product.Price}`;
                document.querySelector('.product-description').innerHTML = product.Description.split("\n").map(line => `<li>${line}</li>`).join("");
                document.querySelector('.product-image').src = product['Image 1'];
            } else {
                console.error("No product found.");
            }
        })
        .catch(err => {
            console.error("Failed to fetch product data", err);
        });
});
