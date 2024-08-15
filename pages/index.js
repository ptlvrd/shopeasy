import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { cartAtom } from './_app'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

export default function Home() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useAtom(cartAtom); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('https://fakestoreapi.com/products')
        .then(response => {
          const favoriteProducts = response.data.slice(0, 6);
          setFavoriteProducts(favoriteProducts);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [isAuthenticated]);

  const handleCardClick = (productId) => {
    axios.get(`https://fakestoreapi.com/products/${productId}`)
      .then(response => {
        const product = response.data;
        setSelectedProduct(product);
      });
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  useEffect(() => {
    if (selectedProduct) {
      const modalElement = document.getElementById('productModal');
      const bootstrap = require('bootstrap');
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false,
      });
      modal.show();
    }
  }, [selectedProduct]);

  return (
    <div className="container mt-4">
      <header className="text-center mb-5">
        <img src="/logo.png" alt="Organization Logo" className="img-fluid mb-3" />
        <h1>Welcome to Our Product Store</h1>
        <p>Your one-stop shop for the best products!</p>
      
      </header>

      {!isAuthenticated ? (
        <p>Please log in to see our products. <Link href="/login">Login!</Link></p>
      ) : (
        <div className="row">
          <h3>Explore Our Favorite Products</h3>
          {favoriteProducts.map(product => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100" onClick={() => handleCardClick(product.id)}>
                <img src={product.image} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">${product.price}</p>
                  <p className="card-text">{product.description.substring(0, 100)}...</p>
                </div>
                <div className="card-footer">
                  <small className="text-muted">Rating: {product.rating.rate} ({product.rating.count} reviews)</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuccessMessage && (
        <div className="alert alert-success fixed-top text-center" role="alert">
          Product successfully added to cart!
        </div>
      )}

      {/* Modal */}
      <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="productModalLabel">
                {selectedProduct ? selectedProduct.title : ''}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedProduct && (
                <>
                  <p><strong>Rating:</strong> {selectedProduct.rating.rate}</p>
                  <img src={selectedProduct.image} alt={selectedProduct.title} className="img-fluid" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '40%' }} />
                  <p><strong>Price:</strong> ${selectedProduct.price}</p>
                  <p><strong>Description:</strong> {selectedProduct.description}</p>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  <p><strong>ID:</strong> {selectedProduct.id}</p>
                  <p><strong>Count:</strong> {selectedProduct.rating.count}</p>
                </>
              )}
            </div>
            <div className="modal-footer">
              {selectedProduct && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addToCart(selectedProduct)}
                >
                  Add to Cart
                </button>
              )}
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
