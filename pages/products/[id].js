import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '../../atoms/cartAtom';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useAtom(cartAtom);

  useEffect(() => {
    if (id) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data));
    }
  }, [id]);

  const addToCart = () => {
    setCart((prevCart) => [...prevCart, product]);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} className="img-fluid" style={{ display: 'block', margin: 'auto', width: '40%' }} />
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Rating:</strong> {product.rating.rate} (based on {product.rating.count} reviews)</p>
      <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
    </div>
  );
}
