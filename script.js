// card Animation
AOS.init({
    once: true,
    duration: 1000, 
    delay: 200,  
  });

function changeImage(newSrc) {
    document.getElementById('mainImage').src = newSrc;
}
$(document).ready(function(){
  $('#mainImage').elevateZoom({
      cursor: 'crosshair',
      zoomType: "inner"
  });
});
