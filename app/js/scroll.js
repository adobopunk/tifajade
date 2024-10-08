<script>
  document.querySelector('.back').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default anchor behavior
    window.scrollTo({
      top: 0, 
      behavior: 'smooth' // Enables smooth scrolling
    });
  });
</script>
