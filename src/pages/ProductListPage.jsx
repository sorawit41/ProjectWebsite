// ProductListPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useLocation removed as it wasn't used directly here
import ProductPage from './ProductPage'; // Import Modal version
import { FaShoppingCart, FaTrash, FaRegTimesCircle } from 'react-icons/fa'; // Added FaRegTimesCircle for modal close
import { supabase } from './supabaseClient';

// Product Images - ensure paths are correct
import productImage1 from '../assets/shop/blackneko-icon.png';
import productImage2 from '../assets/shop/blackneko-icon.png';

// Product Data (existing)
const products = [
  {
    id: '1',
    name: `🌈 สินค้าภายในร้าน 🌤️`,
    image: productImage1,
    description: 'รวมภาษีแล้ว ค่าจัดส่งคำนวณในขั้นตอนการชำระเงิน\nระยะเวลาพรีออเดอร์: 30 ถึง 60 วันแล้วแต่ชนิดประเภทของสิน \n**หมายเหตุ: สินค้านี้มีตัวเลือกซับซ้อน**',
    images: [productImage2, productImage1],
    availableItemChoices: {
        '4x6': [
            { id: '4x6-a', name: 'รูป 4x6 แบบ A', img: productImage2 },
            { id: '4x6-b', name: 'รูป 4x6 แบบ B', img: productImage2 },
            { id: '4x6-c', name: 'รูป 4x6 แบบ C', img: productImage2 },
            { id: '4x6-d', name: 'รูป 4x6 แบบ D', img: productImage2 },
        ],
        '8x12': [
            { id: '8x12-a', name: 'รูป 8x12 แบบ A', img: productImage2 },
            { id: '8x12-b', name: 'รูป 8x12 แบบ B', img: productImage2 },
            { id: '8x12-c', name: 'รูป 8x12 แบบ C', img: productImage2 },
            { id: '8x12-d', name: 'รูป 8x12 แบบ D', img: productImage2 },
        ],
        'tapestry': [
            { id: 'tape-a', name: 'Tapestry ลาย A', img: productImage2 },
            { id: 'tape-b', name: 'Tapestry ลาย B', img: productImage2 },
            { id: 'tape-c', name: 'Tapestry ลาย C', img: productImage2 },
            { id: 'tape-d', name: 'Tapestry ลาย D', img: productImage2 },
        ],
    },
    availableCasts: [
        { id: 'momo', name: 'Momo' }, { id: 'mei', name: 'Mei' }, { id: 'cin', name: 'Cin' },
        { id: 'azuki', name: 'Azuki' }, { id: 'fukada', name: 'Fukada' }, { id: 'narin', name: 'Narin' },
        { id: 'tsuki', name: 'Tsuki' }, { id: 'cream', name: 'Cream' }, { id: 'cornine', name: 'Cornine' },
        { id: 'fuwarun', name: 'Fuwarun' }, { id: 'hamo', name: 'Hamo' }, { id: 'icezu', name: 'Icezu' },
        { id: 'ivy', name: 'Ivy' }, { id: 'kokoa', name: 'Kokoa' }, { id: 'miyuki', name: 'Miyuki' },
        { id: 'mio', name: 'Mio' }, { id: 'momoka', name: 'Momoka' }, { id: 'moolek', name: 'Moolek' },
        { id: 'risa', name: 'Risa' }, { id: 'yuna', name: 'Yuna' }, { id: 'hitomi', name: 'Hitomi' },
        { id: 'maywa', name: 'Maywa' }, { id: 'kurimi', name: 'Kurimi' }, { id: 'itsumi', name: 'Itsumi' },
        { id: 'ayse', name: 'Ayse' }, { id: 'reka', name: 'Reka' }, { id: 'yumeko', name: 'Yumeko' },
        { id: 'shiori', name: 'Shiori' }, { id: 'tsubaki', name: 'Tsubaki' }, { id: 'sora', name: 'Sora' },
        { id: 'erika', name: 'Erika' }, { id: 'layra', name: 'Layra' }, { id: 'nene', name: 'Nene' },
        { id: 'saya', name: 'Saya' }, { id: 'sylvie', name: 'Sylvie' },
    ],
    options: [
      {
        id: 'set', name: 'SET', price: 600, type: 'bundle',
        bundleIncludes: [
            { itemType: '4x6', selectionType: 'select-multiple', count: 3, from: '4x6', description: 'เลือกรูป 4x6 จำนวน 3 แบบ จาก 4 แบบ' },
            { itemType: '8x12', selectionType: 'select-single', count: 1, from: '8x12', description: 'เลือกรูป 8x12 จำนวน 1 แบบ จาก 4 แบบ' }
        ],
        castSelection: { selectionType: 'select-single', count: 1, description: 'เลือก Cast 1 คน' }
      },
      {
        id: '4x6-single', name: 'รูป 4x6 (เลือก 1 แบบ)', price: 200, type: 'single-item',
        itemType: '4x6', selectionType: 'select-single', count: 1, from: '4x6',
        castSelection: { selectionType: 'select-single', count: 1, description: 'เลือก Cast 1 คน'}
      },
      {
        id: '8x12-single', name: 'รูป 8x12 (เลือก 1 แบบ)', price: 200, type: 'single-item',
        itemType: '8x12', selectionType: 'select-single', count: 1, from: '8x12',
        castSelection: { selectionType: 'select-single', count: 1, description: 'เลือก Cast 1 คน'}
      },
      {
        id: 'tapestry', name: 'Tapestry (เลือก 1 ลาย)', price: 3180, type: 'single-item',
        itemType: 'tapestry', selectionType: 'select-single', count: 1, from: 'tapestry',
        extraFeatures: [{ id: 'signed', name: 'เพิ่มลายเซ็น', price: 0, type: 'checkbox' }],
        castSelection: { selectionType: 'select-single', count: 1, description: 'เลือก Cast 1 คน'}
      }
    ],
  }
];


const ProductListPage = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate('/LoginPage', { replace: true });
            }
            setLoading(false);
        };
        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setIsAuthenticated(true);
            } else if (event === 'SIGNED_OUT') {
                setIsAuthenticated(false);
                navigate('/LoginPage', { replace: true });
            }
        });
        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [navigate]);

    const addToCart = (item) => {
        setCartItems(prevItems => {
            // Check if item with the exact same configuration already exists
            const existingItemIndex = prevItems.findIndex(cartItem =>
                cartItem.productId === item.productId &&
                cartItem.optionId === item.optionId &&
                JSON.stringify(cartItem.selectedOptionDetails?.itemSelections) === JSON.stringify(item.selectedOptionDetails?.itemSelections) &&
                JSON.stringify(cartItem.selectedOptionDetails?.selectedCasts) === JSON.stringify(item.selectedOptionDetails?.selectedCasts) &&
                JSON.stringify(cartItem.selectedOptionDetails?.extraFeatures) === JSON.stringify(item.selectedOptionDetails?.extraFeatures)
            );

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += item.quantity;
                return updatedItems;
            } else {
                // New item, add to cart
                return [...prevItems, item];
            }
        });
        console.log('สินค้าถูกเพิ่มลงตะกร้า:', item);
    };

    const removeFromCart = (indexToRemove) => {
        setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
        console.log('สินค้าถูกลบออกจากตะกร้า (Index:', indexToRemove, ')');
    };

    const handleOpenCartModal = () => setIsCartModalOpen(true);
    const handleCloseCartModal = () => setIsCartModalOpen(false);

    const handleCheckoutClick = () => {
        if (cartItems.length > 0) {
            handleCloseCartModal();
            navigate('/CheckoutPage', { state: { cartItems: cartItems } });
            console.log('กำลังไปยังหน้าชำระเงิน พร้อมข้อมูลตะกร้า:', cartItems);
        } else {
            console.log('ตะกร้าว่างเปล่า ไม่สามารถดำเนินการชำระเงินได้');
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const serviceChargeRate = 0.10;
    const serviceCharge = subtotal * serviceChargeRate;
    const totalBeforeVat = subtotal + serviceCharge;
    const vatRate = 0.07;
    const vatAmount = totalBeforeVat * vatRate;
    const finalTotal = totalBeforeVat + vatAmount;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white text-xl text-gray-700">
                กำลังโหลด...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Redirect handled by useEffect
    }

 return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">สินค้าทั้งหมด</h1>
          <button
            onClick={handleOpenCartModal}
            className="flex items-center text-lg text-gray-700 hover:text-black transition-colors duration-200 group"
          >
            <FaShoppingCart className="mr-2 text-xl group-hover:scale-110 transition-transform" />
            ตะกร้า: <span className="font-semibold ml-1.5">{cartItems.length}</span>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden"> {/* Changed from h-90 to aspect ratio */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={product.name}>
                    {product.name}
                </h2>
                 {/* Price display can be added here if there's a default or "from" price */}
                 {/* <p className="text-sm text-gray-500">เริ่มต้นที่ ... ฿</p> */}
              </div>
              <div className="p-5 border-t border-gray-200">
                 <button
                    className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-sm"
                    onClick={(e) => { e.stopPropagation(); setSelectedProduct(product);}} // Prevent card click if button is clicked (optional)
                >
                    ดูตัวเลือกสินค้า
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 md:p-8 m-4">
              <button
                className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600 transition-colors z-20 p-2"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
              >
                <FaRegTimesCircle />
              </button>
              <ProductPage
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                addToCart={(item) => {
                  addToCart(item);
                  setSelectedProduct(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Modal */}
        {isCartModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto m-4">
              <button
                className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600 transition-colors z-20 p-2"
                onClick={handleCloseCartModal}
                aria-label="Close cart"
              >
                <FaRegTimesCircle />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">สินค้าในตะกร้า ({cartItems.length})</h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-600 text-center py-8">ยังไม่มีสินค้าในตะกร้า</p>
              ) : (
                <div className="space-y-5 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm flex items-start space-x-4">
                      {item.image && (
                        <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow flex flex-col space-y-1.5">
                        <div className="font-semibold text-gray-800 text-md">{item.productName}</div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">ตัวเลือก:</span> {item.optionName}
                        </div>

                        {item.selectedOptionDetails?.itemSelections && Object.entries(item.selectedOptionDetails.itemSelections).length > 0 && (
                          <div className="pl-2 text-xs text-gray-500 space-y-0.5">
                            {Object.entries(item.selectedOptionDetails.itemSelections).map(([itemType, selections]) => (
                              selections.length > 0 && (
                                <div key={itemType}>
                                  <strong className="text-gray-600">{itemType.charAt(0).toUpperCase() + itemType.slice(1)}:</strong>{' '}
                                  {selections.map(sel => sel.name).join(', ')}
                                </div>
                              )
                            ))}
                          </div>
                        )}

                        {item.selectedOptionDetails?.selectedCasts && item.selectedOptionDetails.selectedCasts.length > 0 && (
                          <div className="pl-2 text-xs text-gray-500 space-y-0.5">
                            <div className="font-medium text-gray-600">Cast ที่เลือก:</div>
                            <div>{item.selectedOptionDetails.selectedCasts.map(cast => cast.name).join(', ')}</div>
                          </div>
                        )}

                        {item.selectedOptionDetails?.extraFeatures && Object.entries(item.selectedOptionDetails.extraFeatures).length > 0 && (
                          <div className="pl-2 text-xs text-gray-500 space-y-0.5">
                            {Object.entries(item.selectedOptionDetails.extraFeatures).map(([featureId, featureDetails]) => (
                              featureDetails.selected && (
                                <div key={featureId}>
                                  + {featureDetails.name} <span className="font-medium text-gray-700">(+{featureDetails.price.toFixed(2)} ฿)</span>
                                </div>
                              )
                            ))}
                          </div>
                        )}

                        <div className="flex items-center text-sm font-bold text-gray-800 mt-2 pt-2 border-t border-gray-200">
                          <span>จำนวน: {item.quantity}</span>
                          <span className="ml-auto">รวม: {(item.price * item.quantity).toFixed(2)} ฿</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary & Buttons */}
              {cartItems.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-300">
                    <div className="space-y-2 text-sm text-gray-700 mb-6">
                        <div className="flex justify-between">
                            <span>ยอดรวมสินค้า (Subtotal):</span>
                            <span className="font-medium">{subtotal.toFixed(2)} ฿</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Service Charge (10%):</span>
                            <span className="font-medium">{serviceCharge.toFixed(2)} ฿</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-800">
                            <span>ยอดรวมก่อน VAT:</span>
                            <span>{totalBeforeVat.toFixed(2)} ฿</span>
                        </div>
                        <div className="flex justify-between">
                            <span>VAT (7%):</span>
                            <span className="font-medium">{vatAmount.toFixed(2)} ฿</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 mt-3 pt-3 border-t border-gray-200">
                            <span>ยอดชำระทั้งหมด:</span>
                            <span>{finalTotal.toFixed(2)} ฿ THB</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={handleCloseCartModal}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium w-full sm:w-auto"
                        >
                            เลือกซื้อสินค้าต่อ
                        </button>
                        <button
                            onClick={handleCheckoutClick}
                            className={`px-6 py-3 rounded-lg transition-colors font-semibold w-full sm:w-auto
                                ${cartItems.length === 0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                            disabled={cartItems.length === 0}
                        >
                            ดำเนินการชำระเงิน
                        </button>
                    </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;