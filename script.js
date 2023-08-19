// card Animation
AOS.init({
    once: true,
    duration: 1000, 
    delay: 200,  
  });

  function changeButtonColor() {
    const btn = document.querySelector('.btn-primary');
    btn.style.backgroundColor = 'black';
    btn.style.color = 'white';
    btn.removeEventListener('mouseover', hoverEffect);
    btn.removeEventListener('mouseout', hoverEffect);
}

function hoverEffect() {
    const btn = document.querySelector('.btn-primary');
    btn.style.backgroundColor = btn.style.backgroundColor === 'black' ? 'white' : 'black';
    btn.style.color = btn.style.color === 'white' ? 'black' : 'white';
}

document.querySelector('.btn-primary').addEventListener('mouseover', hoverEffect);
document.querySelector('.btn-primary').addEventListener('mouseout', hoverEffect);
