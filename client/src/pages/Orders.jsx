import React from 'react';

const Orders = ({ orders = [] }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">📦 My Order History & Tracking</h2>
        <p className="text-sm text-gray-500 mb-6">Track your active eco-friendly deliveries and past purchases.</p>

        {orders.length === 0 ? (
          // Fallback example matching your screenshot when no orders array is passed yet
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order #ORD-878055
                  </h3>
                  <span className="text-sm text-gray-500">
                    Placed on: {new Date('2026-10-28T11:50:00').toLocaleString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {/* Estimated Delivery Date Display */}
                <div className="text-sm text-emerald-700 font-medium mt-1">
                  Estimated Delivery: {
                    (() => {
                      const orderDate = new Date('2026-10-28T11:50:00');
                      orderDate.setDate(orderDate.getDate() + 3);
                      return orderDate.toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      });
                    })()
                  }
                </div>
              </div>

              <div className="mt-2 md:mt-0">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                  Processing
                </span>
              </div>
            </div>

            {/* Shipping & Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm text-gray-600 border-b border-gray-100">
              <div>
                <p><strong className="text-gray-700">Shipping Address:</strong> kkv, tvm</p>
                <p><strong className="text-gray-700">Phone:</strong> 6554332445</p>
              </div>
              <div>
                <p><strong className="text-gray-700">Payment:</strong> Credit Card</p>
                <p><strong className="text-gray-700">Total Amount:</strong> <span className="text-emerald-600 font-bold">₹299.00</span></p>
              </div>
            </div>

            {/* Items List */}
            <div className="pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Items in this order:</h4>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Img</div>
                  <span className="text-sm font-medium text-gray-800">Bamboo Toothbrush (4-Pack) (Qty: 1)</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">₹299.00</span>
              </div>
            </div>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={order._id || index} className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      Order #{order.orderId || order._id?.slice(-6).toUpperCase()}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Placed on: {new Date(order.createdAt || order.date).toLocaleString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {/* Estimated Delivery Date Display */}
                  <div className="text-sm text-emerald-700 font-medium mt-1">
                    Estimated Delivery: {
                      (() => {
                        const orderDate = new Date(order.createdAt || order.date || Date.now());
                        orderDate.setDate(orderDate.getDate() + 3);
                        return orderDate.toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric'
                        });
                      })()
                    }
                  </div>
                </div>

                <div className="mt-2 md:mt-0">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                    {order.status || 'Processing'}
                  </span>
                </div>
              </div>

              {/* Shipping & Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm text-gray-600 border-b border-gray-100">
                <div>
                  <p><strong className="text-gray-700">Shipping Address:</strong> {order.shippingAddress}</p>
                  <p><strong className="text-gray-700">Phone:</strong> {order.phone}</p>
                </div>
                <div>
                  <p><strong className="text-gray-700">Payment:</strong> {order.paymentMethod || 'Credit Card'}</p>
                  <p><strong className="text-gray-700">Total Amount:</strong> <span className="text-emerald-600 font-bold">₹{order.totalAmount}</span></p>
                </div>
              </div>

              {/* Items List */}
              <div className="pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Items in this order:</h4>
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <img src={item.image || '/placeholder.png'} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      <span className="text-sm font-medium text-gray-800">{item.name} (Qty: {item.quantity})</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;