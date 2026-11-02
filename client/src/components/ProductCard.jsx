import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div>
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          height: '180px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#9ca3af',
          position: 'relative'
        }}>
          <span style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#059669',
            color: 'white',
            padding: '2px 8px',
            fontSize: '0.75rem',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            ECO SCORE: {product.ecoScore || '8/10'}
          </span>
          {/* Fallback box if image is missing */}
          <span>{product.name} Image</span>
        </div>

        <div style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '12px', minHeight: '36px' }}>
            {product.description}
          </p>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#059669' }}>
            ${product.price}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px 16px' }}>
        <button
          onClick={() => onAddToCart(product)}
          style={{
            width: '100%',
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;