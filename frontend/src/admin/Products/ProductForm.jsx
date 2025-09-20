import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const BACKEND_URL = "http://127.0.0.1:5000";

/* ⬇️ Reusable ImageUploader component */
function ImageUploader({ image, index, onChange, onRemove }) {
  const isString = typeof image === "string";

  return (
    <div className="relative rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center h-40 w-full hover:border-blue-400 transition">
      {image ? (
        <>
          <img
            src={isString ? `${BACKEND_URL}/${image}` : URL.createObjectURL(image)}
            alt={`product-${index}`}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ✕
          </button>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
          <span className="text-4xl text-gray-400">+</span>
          <span className="text-sm text-gray-500">Add Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onChange(index, e.target.files[0])}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

export default function ProductForm() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

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
    specifications: {},
    reviews: [],
    tags: [], // ⬅️ added tags
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);

  // fetch categories
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // fetch subcategories
  useEffect(() => {
    if (form.category) {
      api.get(`/subcategories/${form.category}`).then((res) =>
        setSubcategories(res.data)
      );
      setForm((prev) => ({ ...prev, subcategory: "", item: "" }));
      setItems([]);
    }
  }, [form.category]);

  // fetch items
  useEffect(() => {
    if (form.subcategory) {
      api.get(`/items/${form.subcategory}`).then((res) => setItems(res.data));
      setForm((prev) => ({ ...prev, item: "" }));
    }
  }, [form.subcategory]);

  // load product for editing
  useEffect(() => {
    if (productId) {
      api.get(`/products/${productId}`).then((res) => {
        const data = res.data;
        setForm((prev) => ({
          ...prev,
          ...data,
          category: data.category?._id || data.category || "",
          subcategory: data.subcategory?._id || data.subcategory || "",
          item: data.item?._id || data.item || "",
          images: data.images?.length ? data.images : [null, null, null],
          sizes: data.sizes || [],
          colors: data.colors || [],
          quantity_options: data.quantity_options || [],
          specifications: data.specifications || {},
          reviews: data.reviews || [],
          tags: data.tags || [], // ⬅️ load existing tags
        }));

        // fetch subcategories & items for edit
        if (data.category) {
          api.get(`/subcategories/${data.category}`).then((res2) => {
            setSubcategories(res2.data);
          });
        }
        if (data.subcategory) {
          api.get(`/items/${data.subcategory}`).then((res3) => {
            setItems(res3.data);
          });
        }
      });
    }
  }, [productId]);

  // image handlers
  const handleImageChange = (index, file) => {
    const newImages = [...form.images];
    newImages[index] = file;
    setForm({ ...form, images: newImages });
  };

  const removeImage = (i) => {
    const imgs = [...form.images];
    imgs[i] = null;
    setForm({ ...form, images: imgs });
  };

  // submit
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
    form.quantity_options.forEach((q) => data.append("quantity_options[]", q));
    form.tags.forEach((t) => data.append("tags[]", t)); // ⬅️ send tags
    data.append("specifications", JSON.stringify(form.specifications));

    form.images.forEach((img, i) => {
      if (img instanceof File) {
        data.append(`image_${i}`, img);
      } else if (typeof img === "string") {
        data.append("existingImages[]", img);
      }
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
      navigate("/admin/products");
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
        <label className="block text-sm font-medium text-gray-600">
          Category
        </label>
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
        <label className="block text-sm font-medium text-gray-600">
          Subcategory
        </label>
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
          <label className="block text-sm font-medium text-gray-600">
            Product Name
          </label>
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
      </div>

      {/* Lists */}
      <DynamicList
        label="Sizes"
        values={form.sizes}
        onAdd={(val) => setForm({ ...form, sizes: [...form.sizes, val] })}
        onRemove={(idx) =>
          setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== idx) })
        }
      />
      <DynamicList
        label="Colors"
        values={form.colors}
        onAdd={(val) => setForm({ ...form, colors: [...form.colors, val] })}
        onRemove={(idx) =>
          setForm({ ...form, colors: form.colors.filter((_, i) => i !== idx) })
        }
      />
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

      {/* Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tags</label>
          {["deals", "top_deals", "todays_offer"].map((tag) => (
            <label key={tag} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={tag}
                checked={form.tags.includes(tag)}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    tags: prev.tags.includes(val)
                      ? prev.tags.filter((t) => t !== val)
                      : [...prev.tags, val],
                  }));
                }}
              />
              {tag === "deals"
                ? "Deals"
                : tag === "top_deals"
                ? "Top Deals"
                : "Today's Offer"}
            </label>
          ))}
        </div>
      </div>

      {/* Description & Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            className="mt-1 border p-2 w-full rounded-md"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
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
        <label className="block text-sm font-medium text-gray-600">
          Product Images
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {form.images.map((img, i) => (
            <ImageUploader
              key={i}
              image={img}
              index={i}
              onChange={handleImageChange}
              onRemove={removeImage}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="text-right space-x-3">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
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

/* ⬇️ Reusable List Components */
function DynamicList({ label, values, onAdd, onRemove }) {
  const [input, setInput] = useState("");
  return (
    <div className="mt-4">
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
