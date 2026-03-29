import React, { useState } from 'react';
import { products } from '../data/productsData';
import { Heart, Star, ShoppingCart } from 'lucide-react';

function Shop() {
  const [wishlist, setWishlist] = useState([]);
  const [filter, setFilter] = useState('all');

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const calculateDiscount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="w-full py-12 theme-aurora-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Women Safety Shop</h1>
          <p className="text-xl text-slate-200">Discover essential safety products to protect yourself</p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-slate-100 border border-white/20 hover:border-cyan-300'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter('alarm')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'alarm'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-slate-100 border border-white/20 hover:border-cyan-300'
            }`}
          >
            Alarms
          </button>
          <button
            onClick={() => setFilter('tracking')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'tracking'
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-slate-100 border border-white/20 hover:border-cyan-300'
            }`}
          >
            Tracking Devices
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="theme-card rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-64 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.originalPrice > product.price && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{calculateDiscount(product.price, product.originalPrice)}%
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md hover:bg-pink-500 hover:text-white transition-all"
                >
                  <Heart
                    size={20}
                    fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Name */}
                <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 h-10">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.floor(product.rating) ? '#EC4899' : '#E5E7EB'}
                        className="text-pink-500"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">({product.reviews})</span>
                </div>

                {/* Features */}
                <div className="mb-3 space-y-1">
                  {product.features.slice(0, 2).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                  {product.features.length > 2 && (
                    <span className="text-xs text-gray-500 italic">
                      +{product.features.length - 2} more features
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Buy Button */}
                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <ShoppingCart size={18} />
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Why Shop Section */}
        <div className="mt-16 theme-card rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Why Choose Our Products?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Products</h3>
              <p className="text-gray-600">
                All products are thoroughly tested and verified for quality and effectiveness
              </p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">
                Designed specifically for women's safety with easy activation and reliable performance
              </p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Compare prices across trusted retailers and get the best deals on safety gadgets
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-lg p-8 text-white text-center shadow-2xl">
          <h3 className="text-2xl font-bold mb-3">Combine with Our App</h3>
          <p className="text-lg mb-4">
            Use these products along with our RAKSHA app for maximum safety coverage and instant SOS alerts
          </p>
          <button className="bg-white text-pink-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all">
            Download App Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Shop;
