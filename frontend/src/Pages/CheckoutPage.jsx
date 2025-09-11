import React, { useState } from "react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMethod: "online",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // open modal instead of alert
    console.log(formData);
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Delivery Address */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Anytown"
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="CA"
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="12345"
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 555-5555"
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <label
                  className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer ${
                    formData.paymentMethod === "online"
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-gray-500">
                      Pay with your credit or debit card.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer ${
                    formData.paymentMethod === "cod"
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">
                      Pay with cash when your order arrives.
                    </p>
                  </div>
                </label>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 mt-4"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              🎉 Your Order Has Been Placed!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for shopping with us. We’ll notify you when your order is on the way.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
