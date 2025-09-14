import React, { useState } from 'react';

export interface MenuVariant {
  name: string;
  type: 'size' | 'extra' | 'addon' | 'substitute';
  price_modifier: number;
  is_required?: boolean;
  is_available?: boolean;
  sort_order?: number;
}

interface VariantManagerProps {
  variants: MenuVariant[];
  onChange: (variants: MenuVariant[]) => void;
  disabled?: boolean;
}

const VariantManager: React.FC<VariantManagerProps> = ({ variants, onChange, disabled = false }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVariant, setNewVariant] = useState<MenuVariant>({
    name: '',
    type: 'size',
    price_modifier: 0,
    is_required: false,
    is_available: true,
    sort_order: 0
  });

  const addVariant = () => {
    if (!newVariant.name.trim()) return;
    
    const updatedVariants = [...variants, { ...newVariant, sort_order: variants.length + 1 }];
    onChange(updatedVariants);
    
    // Reset form
    setNewVariant({
      name: '',
      type: 'size',
      price_modifier: 0,
      is_required: false,
      is_available: true,
      sort_order: 0
    });
    setShowAddForm(false);
  };

  const removeVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    onChange(updatedVariants);
  };

  const updateVariant = (index: number, field: keyof MenuVariant, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    onChange(updatedVariants);
  };

  const getVariantTypeColor = (type: string) => {
    switch (type) {
      case 'size': return 'bg-blue-100 text-blue-800';
      case 'extra': return 'bg-green-100 text-green-800';
      case 'addon': return 'bg-purple-100 text-purple-800';
      case 'substitute': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    if (price > 0) return `+₦${price.toLocaleString()}`;
    return `-₦${Math.abs(price).toLocaleString()}`;
  };

  return (
    <div className="variant-manager">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Menu Variants</h3>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          disabled={disabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Variant
        </button>
      </div>

      {/* Add Variant Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-gray-900 mb-3">Add New Variant</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant Name
              </label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                placeholder="e.g., Large, Extra Cheese"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newVariant.type}
                onChange={(e) => setNewVariant({ ...newVariant, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="size">Size</option>
                <option value="extra">Extra</option>
                <option value="addon">Add-on</option>
                <option value="substitute">Substitute</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Modifier (₦)
              </label>
              <input
                type="number"
                value={newVariant.price_modifier}
                onChange={(e) => setNewVariant({ ...newVariant, price_modifier: parseFloat(e.target.value) || 0 })}
                placeholder="0 for free, positive for extra cost, negative for discount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={newVariant.sort_order || 0}
                onChange={(e) => setNewVariant({ ...newVariant, sort_order: parseInt(e.target.value) || 0 })}
                placeholder="Display order"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newVariant.is_required || false}
                onChange={(e) => setNewVariant({ ...newVariant, is_required: e.target.checked })}
                className="mr-2"
              />
              Required Selection
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newVariant.is_available !== false}
                onChange={(e) => setNewVariant({ ...newVariant, is_available: e.target.checked })}
                className="mr-2"
              />
              Available
            </label>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addVariant}
              disabled={!newVariant.name.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Variant
            </button>
          </div>
        </div>
      )}

      {/* Variants List */}
      {variants.length > 0 ? (
        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVariantTypeColor(variant.type)}`}>
                    {variant.type.toUpperCase()}
                  </span>
                  <span className="font-medium text-gray-900">{variant.name}</span>
                  <span className="text-sm text-gray-600">({formatPrice(variant.price_modifier)})</span>
                  {variant.is_required && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Required
                    </span>
                  )}
                  {variant.is_available === false && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      Unavailable
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Sort Order: {variant.sort_order || 0}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => updateVariant(index, 'is_available', !variant.is_available)}
                  disabled={disabled}
                  className={`px-2 py-1 text-xs rounded ${
                    variant.is_available !== false 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {variant.is_available !== false ? 'Available' : 'Unavailable'}
                </button>
                
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  disabled={disabled}
                  className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No variants added yet.</p>
          <p className="text-sm">Add variants to allow customers to customize this menu item.</p>
        </div>
      )}
      
      {variants.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Preview:</strong> This item will show customization options to customers. 
            Variants are grouped by type (Size, Extra, Add-on, Substitute) and displayed in sort order.
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantManager;
