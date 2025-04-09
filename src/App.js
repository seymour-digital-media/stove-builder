import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const WP_API = 'https://www.pacificenergy.net/wp-json/wp/v2/products?per_page=50&orderby=title&order=asc';

  useEffect(() => {
    axios.get(`${WP_API}?per_page=100`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Product Titles</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.title?.rendered || 'Untitled Product'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
