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

window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) { // Adjust the value as needed
      navbar.classList.add('navbar-scrolled');
  } else {
      navbar.classList.remove('navbar-scrolled');
  }
});
