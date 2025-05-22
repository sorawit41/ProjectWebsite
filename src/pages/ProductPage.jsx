// ProductPage.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductPage = ({ product, onClose, addToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMainDisplayImage, setCurrentMainDisplayImage] = useState(
    product.images && product.images.length > 0 ? product.images[currentImageIndex] : product.image
  );

  const [selectedOptionId, setSelectedOptionId] = useState(product.options[0]?.id || null);
  const [quantity, setQuantity] = useState(1);
  const [selectedBundleSelections, setSelectedBundleSelections] = useState({});
  const [selectedExtraFeatures, setSelectedExtraFeatures] = useState({});
  const [selectedCasts, setSelectedCasts] = useState([]);
  const [baseUnitPrice, setBaseUnitPrice] = useState(0);
  const [validationError, setValidationError] = useState('');

  const selectedOption = product.options.find(opt => opt.id === selectedOptionId);

  useEffect(() => {
    if (product.images && product.images.length > 0) {
        setCurrentMainDisplayImage(product.images[currentImageIndex]);
    } else {
        setCurrentMainDisplayImage(product.image);
    }
  }, [currentImageIndex, product.images, product.image]);

  useEffect(() => {
    if (selectedOption) {
      const initialBundleSelections = {};
      if (selectedOption.type === 'bundle' && selectedOption.bundleIncludes) {
        selectedOption.bundleIncludes.forEach(bundleItem => {
          initialBundleSelections[bundleItem.itemType] = [];
        });
      } else if (selectedOption.type === 'single-item' && selectedOption.from) {
        initialBundleSelections[selectedOption.itemType] = [];
      }
      setSelectedBundleSelections(initialBundleSelections);

      const initialExtraFeatures = {};
      if (selectedOption.extraFeatures) {
        selectedOption.extraFeatures.forEach(feature => {
          initialExtraFeatures[feature.id] = { ...feature, selected: false };
        });
      }
      setSelectedExtraFeatures(initialExtraFeatures);
      setSelectedCasts([]);
      setValidationError('');
      setQuantity(1);
      setCurrentImageIndex(0);

      if (selectedOption.type === 'single-item' && selectedOption.selectionType === 'select-single' && selectedOption.from) {
        const availableChoices = product.availableItemChoices[selectedOption.from];
        if (availableChoices && availableChoices.length > 0) {
          setSelectedBundleSelections(prevSelections => ({
            ...prevSelections,
            [selectedOption.itemType]: [availableChoices[0]]
          }));
        }
      }
    } else {
      setSelectedBundleSelections({});
      setSelectedExtraFeatures({});
      setSelectedCasts([]);
      setValidationError('');
      setQuantity(1);
      setCurrentImageIndex(0);
    }
  }, [selectedOptionId, product]);

  useEffect(() => {
    if (selectedOption) {
      let price = selectedOption.price;
      Object.values(selectedExtraFeatures).forEach(feature => {
        if (feature.selected) {
          price += feature.price;
        }
      });
      setBaseUnitPrice(price);
    } else {
      setBaseUnitPrice(0);
    }
  }, [selectedOption, selectedExtraFeatures]);

  // --- Modified Price Calculation: VAT and Service Charge are removed ---
  // const serviceCharge = baseUnitPrice * 0.10; // Removed
  // const subtotalBeforeVat = baseUnitPrice + serviceCharge; // Removed
  // const vatAmount = subtotalBeforeVat * 0.07; // Removed
  const finalSingleItemPrice = baseUnitPrice; // Final price per item is now just the base unit price
  const totalPriceForAllQuantity = finalSingleItemPrice * (quantity || 0);


  const handleOptionChange = (event) => setSelectedOptionId(event.target.value);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    } else if (newQuantity === '' || newQuantity === 0) {
        setQuantity(newQuantity);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === '' || quantity < 1) {
        setQuantity(1);
    }
  };

  const handleBundleItemSelection = (itemType, item, selectionType, countLimit) => {
    setSelectedBundleSelections(prevSelections => {
      const currentSelections = prevSelections[itemType] || [];
      const isItemSelected = currentSelections.some(sel => sel.id === item.id);
      let newSelections;
      if (selectionType === 'select-single') {
        newSelections = isItemSelected ? [] : [item];
      } else {
        if (isItemSelected) {
          newSelections = currentSelections.filter(sel => sel.id !== item.id);
        } else {
          if (currentSelections.length < countLimit) {
            newSelections = [...currentSelections, item];
          } else {
            return prevSelections;
          }
        }
      }
      return { ...prevSelections, [itemType]: newSelections };
    });
  };

  const handleExtraFeatureChange = (featureId) => {
    setSelectedExtraFeatures(prevFeatures => ({
      ...prevFeatures,
      [featureId]: { ...prevFeatures[featureId], selected: !prevFeatures[featureId].selected },
    }));
  };

  const handleCastSelection = (cast, selectionType, countLimit) => {
    setSelectedCasts(prevSelectedCasts => {
      const isCastSelected = prevSelectedCasts.some(c => c.id === cast.id);
      let newSelectedCasts;
      if (selectionType === 'select-single') {
        newSelectedCasts = isCastSelected ? [] : [cast];
      } else {
        if (isCastSelected) {
          newSelectedCasts = prevSelectedCasts.filter(c => c.id !== cast.id);
        } else {
          if (prevSelectedCasts.length < countLimit) {
            newSelectedCasts = [...prevSelectedCasts, cast];
          } else {
            return prevSelectedCasts;
          }
        }
      }
      return newSelectedCasts;
    });
  };

  const validateSelections = () => {
    if (!selectedOption) {
      setValidationError('กรุณาเลือกตัวเลือกสินค้า');
      return false;
    }
    if (selectedOption.type === 'bundle' && selectedOption.bundleIncludes) {
      for (const bundleItem of selectedOption.bundleIncludes) {
        const currentSelections = selectedBundleSelections[bundleItem.itemType] || [];
        if (currentSelections.length !== bundleItem.count) {
          setValidationError(`กรุณาเลือก ${bundleItem.description} ให้ครบถ้วน`);
          return false;
        }
      }
    } else if (selectedOption.type === 'single-item' && selectedOption.from && selectedOption.selectionType === 'select-single') {
      const currentSelection = selectedBundleSelections[selectedOption.itemType]?.[0];
      if (!currentSelection || !(product.availableItemChoices[selectedOption.from] || []).some(choice => choice.id === currentSelection.id)) {
        setValidationError(`กรุณาเลือกแบบของ ${selectedOption.name}`);
        return false;
      }
    }
    if (selectedOption.castSelection && selectedCasts.length !== selectedOption.castSelection.count) {
      setValidationError(`กรุณา${selectedOption.castSelection.description}`);
      return false;
    }
    if (quantity === '' || quantity <= 0) {
      setValidationError('จำนวนสินค้าต้องมากกว่า 0');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelections()) return;
    const itemToAdd = {
      productId: product.id,
      productName: product.name,
      optionId: selectedOption.id,
      optionName: selectedOption.name,
      quantity: Number(quantity),
      price: finalSingleItemPrice, // This is now baseUnitPrice (option price + extra features price)
      image: currentMainDisplayImage,
      selectedOptionDetails: {
        itemSelections: Object.fromEntries(
          Object.entries(selectedBundleSelections).filter(([, selections]) => selections.length > 0)
        ),
        extraFeatures: Object.fromEntries(
          Object.entries(selectedExtraFeatures).filter(([, details]) => details.selected)
        ),
        selectedCasts: selectedCasts,
      },
    };
    addToCart(itemToAdd);
  };

  const totalImages = product.images?.length || 0;
  const handleNextImage = () => {
    if (totalImages > 0) {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % totalImages);
    }
  };
  const handlePrevImage = () => {
    if (totalImages > 0) {
        setCurrentImageIndex(prevIndex => (prevIndex - 1 + totalImages) % totalImages);
    }
  };

  if (!product) return null;

  const SelectableGridItem = ({ item, isSelected, isDisabled, onClick, itemType }) => (
    <div
      className={`relative border rounded-lg p-2.5 text-center cursor-pointer transition-all duration-200 transform hover:scale-[1.03]
                  ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-400 bg-white'}
                  ${isDisabled ? 'opacity-60 cursor-not-allowed hover:scale-100' : ''}
                  flex flex-col items-center justify-center h-full`}
      onClick={() => !isDisabled && onClick()}
    >
      {item.img && (
        <img src={item.img || product.image} alt={item.name} className="w-full h-20 object-contain mb-2 rounded-md"/>
      )}
      <p className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
        {item.name}
      </p>
      {isSelected && <FaCheckCircle className="absolute top-1.5 right-1.5 text-blue-500 text-md" />}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-x-8 gap-y-6 p-1">
      <div className="w-full lg:w-5/12 flex-shrink-0">
        <div className="sticky top-24">
            <div className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <img
                    src={currentMainDisplayImage}
                    alt={product.name}
                    className="w-full h-auto max-h-[70vh] object-contain"
                />
                {totalImages > 1 && (
                    <>
                        <button
                            onClick={handlePrevImage}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"
                            aria-label="Previous image"
                        > <FaChevronLeft size={20} /> </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"
                            aria-label="Next image"
                        > <FaChevronRight size={20} /> </button>
                    </>
                )}
            </div>

            {totalImages > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all duration-150
                                ${currentImageIndex === index ? 'border-blue-500 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => setCurrentImageIndex(index)}
                />
                ))}
            </div>
            )}
        </div>
      </div>

      <div className="w-full lg:w-7/12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="text-gray-600 mb-6 whitespace-pre-wrap text-sm leading-relaxed">
          {product.description}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">เลือกตัวเลือกหลัก:</h3>
          <div className="space-y-3">
            {product.options.map(option => (
              <label key={option.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02]
                           ${selectedOptionId === option.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 shadow-md' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
              >
                <div className="flex items-center">
                    <input
                    type="radio" name="productOption" value={option.id}
                    checked={selectedOptionId === option.id} onChange={handleOptionChange}
                    className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500 accent-blue-600" />
                    <span className={`ml-3 text-md font-medium ${selectedOptionId === option.id ? 'text-blue-700': 'text-gray-800'}`}>{option.name}</span>
                </div>
                {option.price > 0 && (
                  <span className={`text-sm font-medium ${selectedOptionId === option.id ? 'text-blue-600': 'text-gray-600'}`}>
                    (ราคา: {option.price.toFixed(2)} ฿) {/* Changed label to "ราคา" for clarity */}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {selectedOption && (
          <div className="space-y-6">
            {selectedOption.type === 'bundle' && selectedOption.bundleIncludes && (
              <div className="p-4 border rounded-lg bg-gray-50/80 shadow-sm">
                <h4 className="text-md font-semibold mb-1 text-gray-800">{selectedOption.name}: รายการในเซ็ต</h4>
                {selectedOption.bundleIncludes.map(bundleItem => {
                  const availableChoices = product.availableItemChoices[bundleItem.from] || [];
                  const currentSelections = selectedBundleSelections[bundleItem.itemType] || [];
                  return (
                    <div key={bundleItem.itemType} className="mb-4 pt-2 last:mb-0">
                      <p className="text-sm font-medium mb-2 text-gray-700">
                        {bundleItem.description}{' '}
                        <span className="text-xs text-gray-500">({currentSelections.length}/{bundleItem.count} เลือกแล้ว)</span>
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {availableChoices.map(item => (
                          <SelectableGridItem
                            key={item.id} item={item}
                            isSelected={currentSelections.some(sel => sel.id === item.id)}
                            isDisabled={bundleItem.selectionType !== 'select-single' && currentSelections.length >= bundleItem.count && !currentSelections.some(sel => sel.id === item.id)}
                            onClick={() => handleBundleItemSelection(bundleItem.itemType, item, bundleItem.selectionType, bundleItem.count)}
                            itemType="bundle" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedOption.type === 'single-item' && selectedOption.from && (
              <div className="p-4 border rounded-lg bg-gray-50/80 shadow-sm">
                <h4 className="text-md font-semibold mb-1 text-gray-800">เลือกแบบสำหรับ {selectedOption.name}</h4>
                 <p className="text-sm font-medium mb-2 text-gray-700">
                    กรุณาเลือก 1 แบบ
                    <span className="text-xs text-gray-500"> ({(selectedBundleSelections[selectedOption.itemType]?.[0]) ? '1/1' : '0/1'} เลือกแล้ว)</span>
                  </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {(product.availableItemChoices[selectedOption.from] || []).map(item => (
                    <SelectableGridItem
                      key={item.id} item={item}
                      isSelected={selectedBundleSelections[selectedOption.itemType]?.[0]?.id === item.id}
                      onClick={() => handleBundleItemSelection(selectedOption.itemType, item, 'select-single', 1)}
                      itemType="single" />
                  ))}
                </div>
              </div>
            )}

            {selectedOption.castSelection && product.availableCasts && product.availableCasts.length > 0 && (
              <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="text-md font-semibold mb-1 text-gray-800">{selectedOption.castSelection.description}</h3>
                 <p className="text-sm font-medium mb-2 text-gray-700">
                    <span className="text-xs text-gray-500">({selectedCasts.length}/{selectedOption.castSelection.count} เลือกแล้ว)</span>
                  </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {product.availableCasts.map(cast => (
                    <SelectableGridItem
                      key={cast.id} item={cast}
                      isSelected={selectedCasts.some(c => c.id === cast.id)}
                      isDisabled={selectedOption.castSelection.selectionType !== 'select-single' && selectedCasts.length >= selectedOption.castSelection.count && !selectedCasts.some(c => c.id === cast.id)}
                      onClick={() => handleCastSelection(cast, selectedOption.castSelection.selectionType, selectedOption.castSelection.count)}
                      itemType="cast" />
                  ))}
                </div>
              </div>
            )}

            {selectedOption.extraFeatures && selectedOption.extraFeatures.length > 0 && (
              <div className="p-4 border rounded-lg bg-gray-50/80 shadow-sm">
                <h3 className="text-md font-semibold mb-3 text-gray-800">เลือกเพิ่มเติม:</h3>
                <div className="space-y-2.5">
                  {selectedOption.extraFeatures.map(feature => (
                    <label key={feature.id} className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type={feature.type} name={`extraFeature-${feature.id}`}
                        checked={selectedExtraFeatures[feature.id]?.selected || false}
                        onChange={() => handleExtraFeatureChange(feature.id)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600" />
                      <span className="text-sm text-gray-800">{feature.name}</span>
                      {feature.price > 0 && (
                        <span className="text-xs text-gray-600 font-medium">(+{feature.price.toFixed(2)} ฿)</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="quantity" className="block text-md font-semibold text-gray-800">จำนวน:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity > 1 ? quantity - 1 : 1)}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-l-md transition-colors"
                    aria-label="Decrease quantity"> <FaMinus /> </button>
                  <input
                    type="number" id="quantity" value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    onBlur={handleQuantityBlur} min="1"
                    className="w-16 text-center px-1 py-2 border-x border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none [-moz-appearance:textfield]"
                    style={{ MozAppearance: 'textfield' }} />
                  <button
                    onClick={() => handleQuantityChange(quantity === '' ? 1 : quantity + 1)}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-r-md transition-colors"
                    aria-label="Increase quantity"> <FaPlus /> </button>
                </div>
              </div>

              {/* MODIFIED Price Breakdown: Removed VAT and Service Charge lines */}
              <div className="text-right mb-5 space-y-1 text-sm">
                <p className="text-md font-bold text-gray-800">ราคาต่อหน่วย: <span className="font-semibold">{finalSingleItemPrice.toFixed(2)} ฿</span></p>
                {/* Removed lines for Service Charge, Subtotal before VAT, VAT */}
                <hr className="my-2"/>
                <p className="text-xl font-bold text-gray-900">
                  ราคารวมทั้งหมด: <span className="text-orange-600">{totalPriceForAllQuantity.toFixed(2)} ฿</span>
                </p>
              </div>

              {validationError && (
                <div className="text-red-600 text-sm mb-4 p-3 border border-red-300 bg-red-50 rounded-md shadow-sm">
                  {validationError}
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3.5 px-6 rounded-lg font-semibold text-md
                           hover:bg-gray-800 transition-all duration-200 transform active:scale-95
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                disabled={!selectedOption || (quantity !== '' && quantity <= 0) || !!validationError && validationError !== ''}
              > เพิ่มลงตะกร้า </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;