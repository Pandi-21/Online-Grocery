document.addEventListener('DOMContentLoaded', function () {
   const form = document.getElementById('multi-cart-form');
    if (form) {
      form.addEventListener('submit', function (e) {
          const selected = document.querySelectorAll('input[name="selected_products[]"]:checked');
          if (selected.length === 0) {
            e.preventDefault(); 
             alert('❗ Please select at least one product to add to cart.');
            } else {
              alert('✅ Selected items added to cart!');
            }
          });
        }
      });
