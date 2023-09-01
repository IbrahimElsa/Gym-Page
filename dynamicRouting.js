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
            console.log("Fetched data:", data);  // Add this line for debugging

            const titleElement = document.getElementById('product-title');
            const priceElement = document.getElementById('product-price');
            const descriptionElement = document.getElementById('product-description');

            // Debugging: Log the elements to make sure they are found
            console.log('Title Element:', titleElement);
            console.log('Price Element:', priceElement);
            console.log('Description Element:', descriptionElement);

            if (titleElement && priceElement && descriptionElement) {
                titleElement.textContent = data.Name;
                priceElement.textContent = `Price: $${data.Price}`;
                descriptionElement.innerHTML = data.Description;
            } else {
                console.error("One of the elements could not be found.");
            }
        })
        .catch(error => {
            console.error('Failed to fetch product data', error);
        });
});
