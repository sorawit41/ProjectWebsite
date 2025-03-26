import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes, FaShoppingCart, FaTrash } from 'react-icons/fa'; // Import icons

// Import product images
import Product1 from '../assets/menu/blackneko-icon.png';
import Product2 from '../assets/menu/blackneko-icon.png';
import Product3 from '../assets/menu/blackneko-icon.png';
import Product4 from '../assets/menu/blackneko-icon.png';
import Product5 from '../assets/menu/blackneko-icon.png';

// Define your product data
const myProducts = [
  { id: 1, image: Product1, name: 'Cheki Photo 1', type: 'Cheki', price: 10 },
  { id: 2, image: Product2, name: 'Tapestry A', type: 'Tapestry', price: 25 },
  { id: 3, image: Product3, name: 'Picture 4x6 - Set A', type: '4x6picture', price: 15 },
  { id: 4, image: Product4, name: 'Picture 8x12 - B', type: '8x12picture', price: 20 },
  { id: 5, image: Product5, name: 'Special Set 1', type: 'Set', price: 30 },
  { id: 6, image: Product1, name: 'Cheki Photo 2', type: 'Cheki', price: 10 },
  { id: 7, image: Product2, name: 'Promotion Bundle', type: 'Promotion', price: 40 },
  { id: 8, image: Product3, name: 'Picture 4x6 - Set B', type: '4x6picture', price: 15 },
  { id: 9, image: Product4, name: 'Tapestry B', type: 'Tapestry', price: 25 },
  { id: 10, image: Product5, name: 'Picture 8x12 - C', type: '8x12picture', price: 20 },
];

const Shop = () => {
  const [productType, setProductType] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [cart, setCart] = useState([]); // Shopping cart state
  const [isCartOpen, setIsCartOpen] = useState(false); // State to control cart visibility

  const availableTypes = ['All', 'Cheki', 'Tapestry', '4x6picture', '8x12picture', 'Set', 'Promotion'];

  useEffect(() => {
    let filtered = myProducts.filter(product => {
      const matchesType = productType === 'All' || product.type === productType;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [productType, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const clearFilter = () => {
    setProductType('All');
    setIsFilterOpen(false);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (productId) => {
    setCart(cart.map(item =>
      item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  return (
    <div>
      <div className="py-10">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="mb-6 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search product name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-full md:w-1/2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={toggleCart}
              className="bg-gray-100 text-gray-500 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center shadow-sm"
            >
              <FaShoppingCart className="mr-2" />
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </button>
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-2">
              <button
                onClick={toggleFilter}
                className="bg-gray-100 text-gray-500 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center shadow-sm"
              >
                <FaFilter className="mr-2" />
                Filter by Type
                {isFilterOpen ? ' ▲' : ' ▼'}
              </button>
              {productType !== 'All' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Filtered by: <span className="font-semibold">{productType}</span>
                  </span>
                  <button
                    onClick={clearFilter}
                    className="text-sm text-red-500 hover:text-red-700 focus:outline-none flex items-center"
                  >
                    <FaTimes className="mr-1" /> Clear
                  </button>
                </div>
              )}
            </div>
            {isFilterOpen && (
              <div className="bg-white rounded-md shadow-md p-4 mt-2 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setProductType(type);
                        toggleFilter();
                      }}
                      className={`block py-2 px-4 text-sm text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300 ${productType === type ? 'font-semibold text-gray-700' : ''}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative w-full h-[200px] overflow-hidden mb-4">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="p-4 flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{product.name}</h3>
                  <p className="text-gray-600 text-sm text-center">Type: {product.type}</p>
                  <p className="text-gray-600 text-sm text-center">Price: ${product.price}</p>
                  <div className="mt-4 w-full">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none flex items-center justify-center w-full"
                    >
                      <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping Cart Overlay */}
      {isCartOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full md:w-1/2 lg:w-1/3 p-6 relative">
            <button
              onClick={toggleCart}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cart.map(item => (
                  <li key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                      <div>
                        <h4 className="font-semibold flex items-center">
                          <FaShoppingCart className="mr-2 text-green-500" />
                          {item.name}
                        </h4>
                        <p className="text-gray-600">Price: ${item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => decreaseQuantity(item.id)} className="text-gray-500 hover:text-gray-700">-</button>
                      <span className="mx-2">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)} className="text-gray-500 hover:text-gray-700">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-2">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {cart.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold">Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
                <button
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 w-full"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;