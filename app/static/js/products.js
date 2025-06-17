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

  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const card = checkbox.closest('.card');
      if (checkbox.checked) {
        card.classList.add('border-success');
      } else {
        card.classList.remove('border-success');
      }
    });
  });
});
