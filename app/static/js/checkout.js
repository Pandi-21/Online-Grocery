// You can validate payment method or show animations here
document.addEventListener('DOMContentLoaded', function () {
  const checkoutForm = document.querySelector('form[action="/checkout"]');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function () {
      alert("🎉 Order Placed Successfully!");
    });
  }
});
