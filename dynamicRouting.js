document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const titleElement = document.getElementById('product-title');
    const priceElement = document.getElementById('product-price');
    const descriptionElement = document.getElementById('product-description');
    const sizeElement = document.getElementById('size');  
    const colorElement = document.getElementById('color');  
    const mainImageElement = document.getElementById('mainImage');
    const thumbnailsElement = document.getElementById('thumbnails');

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
                
                // Populate Description
                if (product.Description) {
                    const descriptionItems = product.Description.split('\n');
                    const descriptionList = document.createElement('ul');
                    descriptionItems.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.textContent = item.trim();
                        descriptionList.appendChild(listItem);
                    });
                    descriptionElement.innerHTML = '';
                    descriptionElement.appendChild(descriptionList);
                } else {
                    console.warn("Description not available for this product.");
                }

                // Populate Sizes
                if (product.size) {
                    const sizes = product.size.split(';');
                    sizes.forEach(size => {
                        const option = document.createElement('option');
                        option.value = size.toLowerCase().trim();
                        option.textContent = size.trim();
                        sizeElement.appendChild(option);
                    });
                } else {
                    console.warn("Sizes not available for this product.");
                }

                // Populate Colors
                if (product.color) {
                    const colors = product.color.split(';');
                    colors.forEach(color => {
                        const option = document.createElement('option');
                        option.value = color.toLowerCase().trim();
                        option.textContent = color.trim();
                        colorElement.appendChild(option);
                    });
                } else {
                    console.warn("Colors not available for this product.");
                }

                // Populate Main Image
                if (product.MainImage) {
                    mainImageElement.src = product.MainImage;
                } else {
                    console.warn("Main image not available for this product.");
                }

                // Populate Thumbnails
                if (product.Thumbnails) {
                    const thumbnails = product.Thumbnails.split(';');
                    thumbnailsElement.innerHTML = '';  // Clear existing thumbnails
                    thumbnails.forEach(thumbnail => {
                        const img = document.createElement('img');
                        img.src = thumbnail.trim();
                        img.className = 'img-fluid thumbnail';
                        img.alt = 'Thumbnail';
                        img.onclick = function() { changeImage(thumbnail.trim(), this); };
                        thumbnailsElement.appendChild(img);
                    });
                } else {
                    console.warn("Thumbnails not available for this product.");
                }
            } else {
                console.error("No data found for this product ID.");
            }
        })
        .catch(err => {
            console.error("Failed to fetch product:", err);
        });
});
