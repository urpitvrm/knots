import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageHeading from '../components/ui/PageHeading';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import OrderTimeline from '../components/ui/OrderTimeline';
import OrderCardSkeleton from '../components/ui/OrderCardSkeleton';
import { getImageUrl } from '../utils/imageUrl';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/user')
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <PageHeading title="My Orders" subtitle="View your order history." />
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet."
          message="Your orders will appear here after checkout."
          actionLabel="Browse shop"
          actionTo="/shop"
        />
      ) : (
        <motion.div
          className="grid gap-4"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
        >
          {orders.map((o) => (
            <motion.div
              key={o._id}
              variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
            >
              <Card className="p-4 border border-beige/40" hover>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-semibold text-deep">Order #{o._id.slice(-6)}</div>
                    <div className="text-sm text-deep/70 capitalize">
                      Status: {o.orderStatus}
                    </div>
                    <div className="text-xs text-deep/50">
                      Placed on {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="font-semibold text-deep">${o.totalPrice.toFixed(2)}</div>
                </div>

                {Array.isArray(o.products) && o.products.length > 0 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {o.products.map((p) => (
                      <div
                        key={p.product?._id || p.product}
                        className="flex items-center gap-3 min-w-[9rem] bg-cream rounded-2xl px-3 py-2"
                      >
                        <img
                          src={
                            getImageUrl(p.product?.images?.[0]) ||
                            'https://via.placeholder.com/60?text=CozyLoops'
                          }
                          alt={p.product?.name || 'Product'}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="text-xs">
                          <div className="font-medium text-deep line-clamp-1">
                            {p.product?.name || 'Product'}
                          </div>
                          <div className="text-deep/70">
                            Qty {p.quantity}
                            {p.product?.price != null && (
                              <> · ${(p.product.price * p.quantity).toFixed(2)}</>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {o.orderStatus !== 'cancelled' && (
                  <div className="mt-4 pt-4 border-t border-beige/40">
                    <OrderTimeline status={o.orderStatus} />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
