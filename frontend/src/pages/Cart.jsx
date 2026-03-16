import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import PageHeading from '../components/ui/PageHeading';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

export default function Cart() {
  const { items, updateQty, removeFromCart, total } = useCart();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <PageHeading title="Your Cart" subtitle={items.length ? `${items.length} item(s)` : undefined} />
      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty."
          message="Add something cozy from the shop."
          actionLabel="Shop now"
          actionTo="/shop"
        />
      ) : (
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="md:col-span-2">
              <Card className="p-4">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex items-center gap-4 py-3 border-b border-beige/60 last:border-0">
                  <img
                    src={getImageUrl(product.images?.[0]) || 'https://via.placeholder.com/80'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-deep/70">${product.price.toFixed(2)}</div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => updateQty(product._id, Number(e.target.value))}
                    className="w-20 border rounded-xl px-3 py-2"
                  />
                  <button className="text-red-600" onClick={() => removeFromCart(product._id)}>
                    Remove
                  </button>
                  </div>
                ))}
              </Card>
            </div>
            <Card className="p-4 h-fit border border-beige/40">
              <div className="flex items-center justify-between">
                <span className="text-deep/80">Subtotal</span>
                <span className="font-semibold text-deep">${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn w-full mt-4 text-center block">
                Checkout
              </Link>
            </Card>
          </motion.div>
        )}
    </div>
  );
}
