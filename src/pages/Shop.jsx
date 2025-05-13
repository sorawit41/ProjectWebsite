import React, { useState, useEffect, useRef } from 'react';
import { FaFilter, FaTimes, FaShoppingCart, FaTrash } from 'react-icons/fa'; // Import icons
import { CSSTransition } from 'react-transition-group'; // Import CSSTransition for animations
import { FaFacebook } from 'react-icons/fa';  // นำเข้าไอคอน Facebook
// Import product images
import Product1 from '../assets/menu/blackneko-icon.png';
import Product2 from '../assets/menu/blackneko-icon.png';
import Product3 from '../assets/menu/blackneko-icon.png';
import Product4 from '../assets/menu/blackneko-icon.png';
import Product5 from '../assets/menu/blackneko-icon.png';

// Define your product data
const myProducts = [
  { id: 1, image: Product1, name: 'Cheki Photo 1', type: 'Cheki', price: 200, cast: 'Narin BlackNeko' },
  { id: 2, image: Product2, name: 'Tapestry A', type: 'Tapestry', price: 3180, cast: 'Narin BlackNeko' },
  { id: 3, image: Product3, name: 'Picture 4x6 - Set A', type: '4x6picture', price: 300, cast: 'Narin BlackNeko' },
  { id: 4, image: Product4, name: 'Picture 8x12 - B', type: '8x12picture', price: 400, cast: 'Narin BlackNeko' },
  { id: 5, image: Product5, name: 'Special Set 1', type: 'Set', price: 800, cast: 'Narin BlackNeko' },
  { id: 1, image: Product1, name: 'Cheki Photo 1', type: 'Cheki', price: 200, cast: 'Icezu BlackNeko' },
  { id: 2, image: Product2, name: 'Tapestry A', type: 'Tapestry', price: 3180, cast: 'Icezu BlackNeko' },
  { id: 3, image: Product3, name: 'Picture 4x6 - Set A', type: '4x6picture', price: 300, cast: 'Icezu BlackNeko' },
  { id: 4, image: Product4, name: 'Picture 8x12 - B', type: '8x12picture', price: 300, cast: 'Icezu BlackNeko' },
  { id: 5, image: Product5, name: 'Special Set 1', type: 'Set', price: 800, cast: 'Icezu BlackNeko' },
];

const Shop = () => {
  const [productType, setProductType] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [cart, setCart] = useState([]); // Shopping cart state
  const [isCartOpen, setIsCartOpen] = useState(false); // State to control cart visibility
  const [castFilter, setCastFilter] = useState('All'); // State for cast filter

  const availableTypes = ['All', 'Cheki', 'Tapestry', '4x6picture', '8x12picture', 'Set', 'Promotion'];
  const availableCasts = ['All', ...new Set(myProducts.map(product => product.cast))]; // Get unique casts

  const filterRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    let filtered = myProducts.filter(product => {
      const matchesType = productType === 'All' || product.type === productType;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cast.toLowerCase().includes(searchTerm.toLowerCase()); // Include cast in search
      const matchesCast = castFilter === 'All' || product.cast === castFilter; // Filter by cast
      return matchesType && matchesSearch && matchesCast;
    });
    setFilteredProducts(filtered);
  }, [productType, searchTerm, castFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const [notification, setNotification] = useState(null);

  const clearFilter = () => {
    setProductType('All');
    setCastFilter('All');
    setIsFilterOpen(false);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setNotification(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว!`);
  setTimeout(() => setNotification(null), 3000)
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart(
      cart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  const handleCheckout = () => {
    // แสดงข้อมูลการสั่งซื้อ เช่น รายการสินค้า รวมไปถึงราคา
    alert("การสั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ.");
    setCart([]); // เคลียร์ตะกร้าหลังจากทำการสั่งซื้อ
    setNotification("การสั่งซื้อของคุณสำเร็จแล้ว! ขอบคุณที่ใช้บริการ.");
  };
  
  const decreaseQuantity = (productId) => {
    setCart(
      cart.map(item =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Function to calculate total price including VAT and credit
  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const vat = subtotal * 0.07;  // 7% VAT
    const credit = subtotal * 0.13; // 13% Credit
    const total = subtotal + vat + credit;
    return {
      subtotal: subtotal.toFixed(2),
      vat: vat.toFixed(2),
      credit: credit.toFixed(2),
      total: total.toFixed(2)
    };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
  {notification && (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-md z-50 transition duration-300">
      {notification}
    </div>
  )}

  <div className="py-10 pt-20">
    <div className="container mx-auto">
      {/* Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between ">
        <input
          type="text"
          placeholder="Search product name, type, or cast..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-3 w-full md:w-1/2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:border-black dark:focus:border-white mb-4 md:mb-0 md:mr-4 bg-white dark:bg-black text-black dark:text-white"
        />
        <button
          onClick={toggleCart}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center shadow-sm"
        >
          <FaShoppingCart className="mr-2" />
          ตะกร้าสินค้า ({cart.reduce((total, item) => total + item.quantity, 0)})
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 md:mb-2">
          <button
            onClick={toggleFilter}
            className="bg-white dark:bg-black text-black dark:text-white py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center shadow-sm"
          >
            <FaFilter className="mr-2" />
            Filter
            {isFilterOpen ? ' ▲' : ' ▼'}
          </button>
          {(productType !== 'All' || castFilter !== 'All') && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-black dark:text-white">
                Filtered by:{' '}
                {productType !== 'All' && (
                  <span className="font-semibold">{productType}</span>
                )}
                {productType !== 'All' && castFilter !== 'All' && ', '}
                {castFilter !== 'All' && (
                  <span className="font-semibold">{castFilter}</span>
                )}
              </span>
              <button
                onClick={clearFilter}
                className="text-sm text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none"
              >
                <FaTimes className="mr-1" /> Clear
              </button>
            </div>
          )}
        </div>
        <CSSTransition
          in={isFilterOpen}
          timeout={300}
          classNames="filter-animation"
          unmountOnExit
          nodeRef={filterRef}
        >
          <div ref={filterRef} className="bg-white dark:bg-black rounded-md shadow-md p-4 mt-2 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <h6 className="font-semibold mb-2 text-black dark:text-white">Filter by Type</h6>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setProductType(type)}
                    className={`block py-2 px-4 text-sm text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                      productType === type ? 'font-semibold' : ''
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-2 text-black dark:text-white">Filter by Cast</h6>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableCasts.map(cast => (
                  <button
                    key={cast}
                    onClick={() => setCastFilter(cast)}
                    className={`block py-2 px-4 text-sm text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                      castFilter === cast ? 'font-semibold' : ''
                    }`}
                  >
                    {cast}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>

      {/* Product Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
          fadeIn ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'
        }`}
      >
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative w-full h-[200px] overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-4 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 text-center">
                {product.name}
              </h3>
              <p className="text-black dark:text-white text-sm text-center">
                Type: {product.type}
              </p>
              <p className="text-black dark:text-white text-sm text-center">
                Cast: {product.cast}
              </p>
              <p className="text-black dark:text-white text-sm text-center">
                Price: ${product.price}
              </p>
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
  <CSSTransition
    in={isCartOpen}
    timeout={300}
    classNames="cart-animation"
    unmountOnExit
    nodeRef={cartRef}
  >
    <div ref={cartRef} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white dark:bg-black w-full md:w-1/2 lg:w-1/3 p-6 relative">
        <button
          onClick={toggleCart}
          className="absolute top-4 right-4 text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
          Shopping Cart
        </h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map(item => (
              <li
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
              >
                {/* Product info */}
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold flex items-center text-black dark:text-white">
                      <FaShoppingCart className="mr-2 text-black dark:text-white" />
                      {item.name}
                    </h4>
                    <p className="text-black dark:text-white text-sm">Price: ${item.price}</p>
                    <p className="text-black dark:text-white text-xs">Cast: {item.cast}</p>
                  </div>
                </div>
                {/* Quantity controls */}
                <div className="flex items-center">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2 dark:text-red-300 dark:hover:text-red-500"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <div className="mt-4">
            {/* การคำนวณยอดรวม */}
            <p className="font-semibold text-sm text-black dark:text-white">
              Subtotal: ${calculateTotal().subtotal}
            </p>
            <p className="text-black dark:text-white text-xs">
              VAT (7%): +${calculateTotal().vat}
            </p>
            <p className="text-black dark:text-white text-xs">
              Credit (13%): +${calculateTotal().credit}
            </p>
            <p className="font-semibold text-lg text-black dark:text-white">
              Total: ${calculateTotal().total}
            </p>
            {/* ปุ่ม Buy Now */}
            <button
              onClick={() => window.open("https://www.facebook.com/messages/t/165982909924535", "_blank")}  // ใส่ลิงก์ Facebook ของคุณ
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 w-full flex items-center justify-center"
            >
              <FaFacebook className="mr-2" />  {/* ไอคอน Facebook */}
              ติดต่อซื้อได้ที่ Page Facebook
            </button>
          </div>
        )}
      </div>
    </div>
  </CSSTransition>
</div>



  );
};

export default Shop;