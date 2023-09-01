document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    console.log("Product ID:", productId);

    if (productId === null) {
        console.error("No product ID provided in the URL.");
        return;
    }

    fetch(`https://rossthesloth-gym.netlify.app/.netlify/functions/get_product?id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const product = data[0];
                titleElement.textContent = product.Name;
                priceElement.textContent = `Price: $${product.Price}`;
                descriptionElement.innerHTML = product.Description;
            } else {
                console.error("No data found for this product ID.");
            }
        })
        
});