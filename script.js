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

document.addEventListener('DOMContentLoaded', function() {
  var zoomImage = document.getElementById('mainImage');

  zoomImage.addEventListener('mousemove', function(e) {
      var x = e.offsetX;
      var y = e.offsetY;
      var xPercent = (x / this.offsetWidth) * 100;
      var yPercent = (y / this.offsetHeight) * 100;
      this.style.backgroundPosition = xPercent + '% ' + yPercent + '%';
  });

  zoomImage.addEventListener('mouseleave', function() {
      this.style.backgroundPosition = 'center';
  });
});
