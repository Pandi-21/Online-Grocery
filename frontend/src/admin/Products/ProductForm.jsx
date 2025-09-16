import { useState, useEffect } from "react";
import api from "../api/api";

export default function ProductForm({ productId }) {
  const [form, setForm] = useState({
    images: [null, null, null],
    category: "",
    subcategory: "",
    item: "",
    name: "",
    price: "",
    description: "",
    sizes: [],
    colors: [],
    quantity_options: [],
    specifications: {}, // 👈 default object
    reviews: [],
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);

  // Fetch categories
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (form.category) {
      api.get(`/subcategories/${form.category}`).then((res) =>
        setSubcategories(res.data)
      );
      setForm((prev) => ({ ...prev, subcategory: "", item: "" }));
      setItems([]);
    }
  }, [form.category]);

  // Fetch items
  useEffect(() => {
    if (form.subcategory) {
      api.get(`/items/${form.subcategory}`).then((res) => setItems(res.data));
      setForm((prev) => ({ ...prev, item: "" }));
    }
  }, [form.subcategory]);

  // Load existing product for editing
  useEffect(() => {
    if (productId) {
      api.get(`/products/${productId}`).then((res) => setForm(res.data));
    }
  }, [productId]);

  // Image Handlers
  const handleImageChange = (i, file) => {
    const imgs = [...form.images];
    imgs[i] = file;
    setForm({ ...form, images: imgs });
  };

  const removeImage = (i) => {
    const imgs = [...form.images];
    imgs[i] = null;
    setForm({ ...form, images: imgs });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("category", form.category);
    data.append("subcategory", form.subcategory);
    data.append("item", form.item);
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);

    form.sizes.forEach((s) => data.append("sizes[]", s));
    form.colors.forEach((c) => data.append("colors[]", c));
    form.quantity_options.forEach((q) =>
      data.append("quantity_options[]", q)
    );
    data.append("specifications", JSON.stringify(form.specifications));

    form.images.forEach((img, i) => {
      if (img) data.append(`image_${i}`, img);
    });

    try {
      if (productId) {
        await api.put(`/products/${productId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated ✅");
      } else {
        await api.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product created ✅");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg space-y-8"
    >
      <h2 className="text-2xl font-bold text-gray-700">
        {productId ? "Edit Product" : "Add New Product"}
      </h2>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Category</label>
        <select
          className="mt-1 border p-2 w-full rounded-md"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Subcategory</label>
        <select
          className="mt-1 border p-2 w-full rounded-md"
          value={form.subcategory}
          onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
          disabled={!form.category}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Item */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Item</label>
        <select
          className="mt-1 border p-2 w-full rounded-md"
          value={form.item}
          onChange={(e) => setForm({ ...form, item: e.target.value })}
          disabled={!form.subcategory}
        >
          <option value="">Select Item</option>
          {items.map((i) => (
            <option key={i._id} value={i._id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Product Name</label>
          <input
            type="text"
            className="mt-1 border p-2 w-full rounded-md"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Price</label>
          <input
            type="number"
            className="mt-1 border p-2 w-full rounded-md"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        {/* Sizes */}
        <DynamicList
          label="Sizes"
          values={form.sizes}
          onAdd={(val) => setForm({ ...form, sizes: [...form.sizes, val] })}
          onRemove={(idx) =>
            setForm({
              ...form,
              sizes: form.sizes.filter((_, i) => i !== idx),
            })
          }
        />

        {/* Colors */}
        <DynamicList
          label="Colors"
          values={form.colors}
          onAdd={(val) => setForm({ ...form, colors: [...form.colors, val] })}
          onRemove={(idx) =>
            setForm({
              ...form,
              colors: form.colors.filter((_, i) => i !== idx),
            })
          }
        />

        {/* Quantity */}
        <DynamicList
          label="Quantity Options"
          values={form.quantity_options}
          onAdd={(val) =>
            setForm({
              ...form,
              quantity_options: [...form.quantity_options, val],
            })
          }
          onRemove={(idx) =>
            setForm({
              ...form,
              quantity_options: form.quantity_options.filter((_, i) => i !== idx),
            })
          }
        />
      </div>

      {/* Description & Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <textarea
            className="mt-1 border p-2 w-full rounded-md"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* ✅ Specifications with key-value inputs */}
        <DynamicKeyValueList
          label="Specifications"
          values={form.specifications}
          onAdd={(key, value) =>
            setForm({
              ...form,
              specifications: { ...form.specifications, [key]: value },
            })
          }
          onRemove={(key) => {
            const newSpecs = { ...form.specifications };
            delete newSpecs[key];
            setForm({ ...form, specifications: newSpecs });
          }}
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Product Images</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {form.images.map((img, i) => (
            <div
              key={i}
              className="relative border rounded-md p-2 flex flex-col items-center"
            >
              <input
                type="file"
                onChange={(e) => handleImageChange(i, e.target.files[0])}
              />
              {img && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 text-red-500 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {productId ? "Update" : "Save"} Product
        </button>
      </div>
    </form>
  );
}

// Reusable DynamicList component (for sizes, colors, quantity)
function DynamicList({ label, values, onAdd, onRemove }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          className="border p-2 flex-1 rounded-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Add ${label}`}
        />
        <button
          type="button"
          onClick={() => {
            if (input.trim() !== "") {
              onAdd(input.trim());
              setInput("");
            }
          }}
          className="bg-green-500 text-white px-3 rounded"
        >
          Add
        </button>
      </div>
      <ul className="mt-2">
        {values.map((val, idx) => (
          <li
            key={idx}
            className="flex justify-between border p-1 rounded mt-1 bg-gray-50"
          >
            {val}
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ✅ Reusable DynamicKeyValueList component (for specifications)
function DynamicKeyValueList({ label, values, onAdd, onRemove }) {
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          className="border p-2 flex-1 rounded-md"
          placeholder="Key"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 flex-1 rounded-md"
          placeholder="Value"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
        />
        <button
          type="button"
          className="bg-green-500 text-white px-3 rounded"
          onClick={() => {
            if (keyInput.trim() && valueInput.trim()) {
              onAdd(keyInput.trim(), valueInput.trim());
              setKeyInput("");
              setValueInput("");
            }
          }}
        >
          Add
        </button>
      </div>

      <ul className="mt-2">
        {Object.entries(values).map(([k, v], idx) => (
          <li
            key={idx}
            className="flex justify-between border p-1 rounded mt-1 bg-gray-50"
          >
            <span>
              <strong>{k}</strong>: {v}
            </span>
            <button
              type="button"
              onClick={() => onRemove(k)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
