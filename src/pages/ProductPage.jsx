// ProductPage.js (Rewritten with improved Grid UI)
import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaMinus, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// --- Reusable UI Components ---

// Component สำหรับรูปภาพสินค้าและ Thumbnail
const ImageGallery = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">No Image</div>;
  }

  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  const handleNext = () => setCurrentIndex(prev => (prev + 1) % images.length);

  return (
    <div className="w-full lg:w-5/12 flex-shrink-0">
      <div className="sticky top-24">
        <div className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`${productName} - ${currentIndex + 1}`}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
          {images.length > 1 && (
            <>
              <button onClick={handlePrev} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"><FaChevronLeft size={20} /></button>
              <button onClick={handleNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"><FaChevronRight size={20} /></button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all ${currentIndex === index ? 'border-blue-500' : 'border-gray-300'}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ NEW: Component สำหรับตัวเลือกแบบ Grid ที่ปรับปรุงแล้ว
const SelectionGrid = ({ title, items, selectedIds, onSelect, selectionType = 'radio', disabled, count, limit }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-md font-semibold text-gray-800 flex justify-between items-center">
        {title}
        {limit > 1 && <span className="text-sm font-normal text-gray-500">({count}/{limit})</span>}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map(item => {
          const isSelected = selectedIds.includes(item.id);
          const isDisabled = disabled && !isSelected;
          return (
            <div
              key={item.id}
              onClick={() => !isDisabled && onSelect(item)}
              className={`relative border rounded-lg p-3 text-center cursor-pointer transition-all duration-200 transform hover:scale-[1.03]
                          flex items-center justify-center min-h-[60px]
                          ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200 bg-white hover:border-gray-400'}
                          ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
            >
              <p className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{item.name}</p>
              {isSelected && <FaCheckCircle className="absolute top-1.5 right-1.5 text-blue-500 text-lg" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- Main Product Page Component ---
const ProductPage = ({ product, allCasts, addToCart }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(product.options[0]?.id || null);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState({}); // Unified selections state
  const [validationError, setValidationError] = useState('');

  const productImages = useMemo(() => [product.main_image_url, ...(product.images_urls || [])].filter(Boolean), [product]);
  const selectedOption = useMemo(() => product.options.find(opt => opt.id === selectedOptionId), [product.options, selectedOptionId]);

  // Reset state when option changes
  useEffect(() => {
    setSelections({});
    setQuantity(1);
    setValidationError('');
  }, [selectedOptionId]);

  // Calculate price
  const totalPrice = useMemo(() => {
    if (!selectedOption) return 0;
    let price = selectedOption.price;
    const extraFeatures = selections['extraFeatures'] || [];
    extraFeatures.forEach(featureId => {
      const feature = selectedOption.extraFeatures.find(f => f.id === featureId);
      if (feature) price += feature.price;
    });
    return price * quantity;
  }, [selectedOption, selections, quantity]);

  // Handler for all selections
  const handleSelectionChange = (group, item, type, limit) => {
    setSelections(prev => {
      const currentSelection = prev[group] || [];
      const newSelection = [...currentSelection];
      const itemIndex = newSelection.findIndex(id => id === item.id);

      if (type === 'radio') {
          return { ...prev, [group]: [item.id] };
      }

      // Checkbox logic
      if (itemIndex > -1) {
        newSelection.splice(itemIndex, 1); // Deselect
      } else {
        if (newSelection.length < limit) {
          newSelection.push(item.id); // Select
        }
      }
      return { ...prev, [group]: newSelection };
    });
  };

  const validateAndAddToCart = () => {
    // Validation
    if (!selectedOption) {
        setValidationError("กรุณาเลือกตัวเลือกหลัก");
        return;
    }

    // Validate bundle includes
    if (selectedOption.type === 'bundle' && selectedOption.bundleIncludes) {
        for (const bundle of selectedOption.bundleIncludes) {
            const selectedItems = selections[bundle.itemType] || [];
            if (selectedItems.length !== bundle.count) {
                setValidationError(`กรุณาเลือก "${bundle.description}" ให้ครบ ${bundle.count} รายการ`);
                return;
            }
        }
    }

    // Validate cast selection
    if (selectedOption.castSelection?.enabled) {
        const selectedCasts = selections['casts'] || [];
        if (selectedCasts.length !== selectedOption.castSelection.count) {
            setValidationError(`กรุณา${selectedOption.castSelection.description}`);
            return;
        }
    }

    setValidationError('');

    // Prepare data for cart
    const resolvedSelections = {};
    for (const key in selections) {
        if (key !== 'casts' && key !== 'extraFeatures' && product.available_item_choices[key]) {
            resolvedSelections[key] = selections[key].map(id => product.available_item_choices[key].find(item => item.id === id));
        }
    }

    const itemToAdd = {
        productId: product.id,
        productName: product.name,
        optionId: selectedOption.id,
        optionName: selectedOption.name,
        quantity,
        price: totalPrice / quantity,
        image: productImages[0],
        selectedOptionDetails: {
            itemSelections: resolvedSelections,
            selectedCasts: (selections['casts'] || []).map(id => allCasts.find(c => c.id === id)),
            extraFeatures: (selections['extraFeatures'] || []).reduce((acc, id) => {
                const feature = selectedOption.extraFeatures.find(f => f.id === id);
                if(feature) acc[id] = { ...feature, selected: true };
                return acc;
            }, {}),
        },
    };
    
    addToCart(itemToAdd);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-x-8 gap-y-6 p-1">
      <ImageGallery images={productImages} productName={product.name} />

      <div className="w-full lg:w-7/12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-6 whitespace-pre-wrap text-sm leading-relaxed">{product.description}</p>
        
        {/* --- Main Options --- */}
        <div className="space-y-4 border-b pb-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">เลือกตัวเลือกหลัก:</h3>
            {product.options.map(option => (
                <label key={option.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedOptionId === option.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200 bg-white hover:border-gray-400'}`}>
                    <div className="flex items-center">
                        <input type="radio" name="productOption" value={option.id} checked={selectedOptionId === option.id} onChange={(e) => setSelectedOptionId(e.target.value)} className="form-radio h-5 w-5 text-blue-600 accent-blue-600" />
                        <span className="ml-3 font-medium text-gray-800">{option.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{option.price.toFixed(2)} ฿</span>
                </label>
            ))}
        </div>

        {selectedOption && (
          <div className="space-y-6">
            {/* --- Bundle / Single Item Selections --- */}
            {selectedOption.type === 'bundle' && selectedOption.bundleIncludes?.map(bundle => (
                <SelectionGrid
                    key={bundle.itemType}
                    title={bundle.description}
                    items={product.available_item_choices[bundle.itemType] || []}
                    selectedIds={selections[bundle.itemType] || []}
                    onSelect={(item) => handleSelectionChange(bundle.itemType, item, bundle.selectionType === 'select-single' ? 'radio' : 'checkbox', bundle.count)}
                    selectionType={bundle.selectionType === 'select-single' ? 'radio' : 'checkbox'}
                    disabled={(selections[bundle.itemType] || []).length >= bundle.count}
                    count={(selections[bundle.itemType] || []).length}
                    limit={bundle.count}
                />
            ))}

            {/* --- Cast Selection --- */}
            {selectedOption.castSelection?.enabled && (
                <SelectionGrid
                    title={selectedOption.castSelection.description}
                    items={allCasts}
                    selectedIds={selections['casts'] || []}
                    onSelect={(item) => handleSelectionChange('casts', item, selectedOption.castSelection.selectionType === 'select-single' ? 'radio' : 'checkbox', selectedOption.castSelection.count)}
                    selectionType={selectedOption.castSelection.selectionType === 'select-single' ? 'radio' : 'checkbox'}
                    disabled={(selections['casts'] || []).length >= selectedOption.castSelection.count}
                    count={(selections['casts'] || []).length}
                    limit={selectedOption.castSelection.count}
                />
            )}

            {/* --- Extra Features --- */}
            {selectedOption.extraFeatures?.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-md font-semibold text-gray-800">เลือกเพิ่มเติม:</h4>
                    {selectedOption.extraFeatures.map(feature => (
                        <label key={feature.id} className="flex items-center p-3 border rounded-lg cursor-pointer transition-all bg-white hover:border-gray-400">
                            <input type="checkbox"
                                checked={(selections['extraFeatures'] || []).includes(feature.id)}
                                onChange={() => handleSelectionChange('extraFeatures', feature, 'checkbox', selectedOption.extraFeatures.length)}
                                className="form-checkbox h-5 w-5 rounded text-blue-600 accent-blue-600"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700">{feature.name}</span>
                            {feature.price > 0 && <span className="ml-auto text-sm font-medium text-gray-500">(+{feature.price.toFixed(2)} ฿)</span>}
                        </label>
                    ))}
                </div>
            )}
            
            {/* --- Quantity and Price --- */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                  <label htmlFor="quantity" className="font-semibold text-gray-800">จำนวน:</label>
                  <div className="flex items-center border rounded-md">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-700 hover:bg-gray-100"><FaMinus /></button>
                      <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) < 1 ? 1 : Number(e.target.value))} onBlur={() => {if(quantity < 1) setQuantity(1)}} min="1" className="w-16 text-center border-x focus:outline-none" />
                      <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-700 hover:bg-gray-100"><FaPlus /></button>
                  </div>
              </div>
              <div className="text-right mb-5">
                  <p className="text-2xl font-bold text-gray-900">
                      ราคารวม: <span className="text-orange-600">{totalPrice.toFixed(2)} ฿</span>
                  </p>
              </div>

              {validationError && <div className="text-red-600 text-sm text-center mb-4 p-3 border border-red-300 bg-red-50 rounded-md">{validationError}</div>}

              <button onClick={validateAndAddToCart} className="w-full bg-black text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition-all">เพิ่มลงตะกร้า</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;