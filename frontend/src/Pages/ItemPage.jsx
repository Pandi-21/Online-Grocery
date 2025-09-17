// src/pages/ItemPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../admin/api/api"; // உங்கள் axios instance

export default function ItemPage() {
  const { categorySlug, subCategorySlug, itemSlugAndId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itemSlugAndId) return;

    // split at last dash to allow slugs that contain dashes
    const lastDash = itemSlugAndId.lastIndexOf("-");
    let itemId;
    let itemSlugFromUrl = "";

    if (lastDash > -1) {
      itemSlugFromUrl = itemSlugAndId.substring(0, lastDash);
      itemId = itemSlugAndId.substring(lastDash + 1);
    } else {
      // fallback: if no dash, treat whole param as id
      itemId = itemSlugAndId;
    }

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        // adjust endpoint to your backend
        const res = await api.get(`/items/${itemId}`);
        const prod = res.data;
        if (!prod) {
          setError("Product not found");
          setLoading(false);
          return;
        }
        setProduct(prod);

        // OPTIONAL: if product has canonical slug and it differs, redirect to canonical url
        // (good for SEO & consistent URLs)
        if (prod.slug && prod.slug !== itemSlugFromUrl) {
          const canonical = `/${categorySlug}/${subCategorySlug}/${prod.slug}-${prod._id}`;
          navigate(canonical, { replace: true });
          return; // avoid further rendering until navigation
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error loading product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [itemSlugAndId, categorySlug, subCategorySlug, navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{String(error)}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      
      <p className="text-sm text-gray-600 mb-4">{product.description}</p>
      {/* render images, price, add-to-cart etc. */}
    </div>
  );
}
