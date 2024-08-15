import { useAtom } from 'jotai';
import { cartAtom } from './_app';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Cart() {
  const [cart, setCart] = useAtom(cartAtom);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return null;
  }
  const handleRemove = (productId) => {
    setCart(cart.filter(product => product.id !== productId));
  };

  const totalPrice = cart.reduce((total, product) => total + product.price, 0);

  return (
    <div className="container mt-4">
      <header className="text-center mb-5">
        <img src="/logo.png" alt="Organization Logo" className="img-fluid mb-3" />
        <h1>Your Shopping Cart</h1>
        {cart.length > 0 ? (
          <p>You have {cart.length} {cart.length > 1 ? 'items' : 'item'} in your cart.</p>
        ) : (
          <p>Your cart is empty. <Link href="/">Go back to shop</Link></p>
        )}
      </header>

      {cart.length > 0 && (
        <>
          <div className="row">
            {cart.map(product => (
              <div className="col-md-4 mb-4" key={product.id}>
                <div className="card h-100">
                  <img src={product.image} className="card-img-top" alt={product.title} />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">${product.price}</p>
                    <p className="card-text">{product.description.substring(0, 100)}...</p>
                  </div>
                  <div className="card-footer">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(product.id)}
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
          </div>
        </>
      )}
    </div>
  );
}
