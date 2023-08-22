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

var modal = document.getElementById("imageModal");
var modalImg = document.getElementById("modalImage");
var captionText = document.getElementById("caption");

document.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG' && e.target.id !== 'modalImage') {
        modal.style.display = "block";
        modalImg.src = e.target.src;
        captionText.innerHTML = e.target.alt;
    }
});

var span = document.getElementsByClassName("close")[0];

span.onclick = function() { 
    modal.style.display = "none";
}

modal.onclick = function() {
    modal.style.display = "none";
}

var panZoom = panzoom(document.querySelector('#modalImage'));
