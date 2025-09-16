import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/productService";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure?")) {
      await deleteProduct(id);
      loadProducts();
    }
  }

  return (
    <div>
      <h1>Products</h1>
      <Link to="/admin/products/new">+ Add Product</Link>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Main Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>
                {p.images?.[0] && <img src={p.images[0]} alt="" width="50" />}
              </td>
              <td>
                <Link to={`/admin/products/${p._id}`}>Edit</Link>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
