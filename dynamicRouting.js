document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const titleElement = document.getElementById('product-title');
    const priceElement = document.getElementById('product-price');
    const descriptionElement = document.getElementById('product-description');

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
                
                // Create an unordered list for the product description
                const descriptionList = document.createElement('ul');
                product.Description.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = item;
                    descriptionList.appendChild(listItem);
                });

                // Clear out any previous content and append the new list
                descriptionElement.innerHTML = '';
                descriptionElement.appendChild(descriptionList);
            } else {
                console.error("No data found for this product ID.");
            }
        })
        .catch(err => {
            console.error("Failed to fetch product:", err);
        });
});
