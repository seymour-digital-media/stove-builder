import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsDropdown = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  const WP_API_BASE = 'https://pacificenergy.net/wp-json/wp/v2/products';

  // Fetch all products for the dropdown
  useEffect(() => {
    axios.get(`${WP_API_BASE}?per_page=100`)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error("Error fetching products list:", err));
  }, []);

  // Fetch selected product details with featured image and ACF
  useEffect(() => {
    if (!selectedProductId) return;

    axios.get(`${WP_API_BASE}/${selectedProductId}?_embed&acf_format=standard`)
      .then(res => {
        setProductDetails(res.data);
      })
      .catch(err => console.error("Error fetching product details:", err));
  }, [selectedProductId]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Select a Product</h1>

      <select
        onChange={e => setSelectedProductId(e.target.value)}
        value={selectedProductId || ''}
      >
        <option value="" disabled>Select one...</option>
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.title.rendered}
          </option>
        ))}
      </select>

      {productDetails && (
        <div style={{ marginTop: '30px' }}>
          <h2>{productDetails.title.rendered}</h2>
          {productDetails._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
            <img
              src={productDetails._embedded['wp:featuredmedia'][0].source_url}
              alt={productDetails.title.rendered}
              style={{ maxWidth: '100%' }}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: productDetails.content.rendered }} />

          {/* Example ACF fields: adjust according to your actual ACF field names */}
          {productDetails.acf && (
            <div style={{ marginTop: '20px' }}>
              <h3>Custom Fields</h3>
              <ul>
                <li><strong>Price:</strong> {productDetails.acf.price}</li>
                <li><strong>SKU:</strong> {productDetails.acf.sku}</li>
                <li><strong>Available:</strong> {productDetails.acf.available ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsDropdown;
