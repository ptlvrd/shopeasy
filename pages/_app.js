import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Provider, atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const cartAtom = atom([]);

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Navbar />
      <Component {...pageProps} />
    </Provider>
  );
}

function Navbar() {
  const [cart] = useAtom(cartAtom);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Assignment 4</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">About</Link>
            </li>
            
            {isAuthenticated ? (
              <>
              <li className="nav-item">
              <Link href="/cart" className="nav-link">
                Cart ({cart.length})
              </Link>
               </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link btn btn-link">Logout</button>
                </li>
                </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default MyApp;
