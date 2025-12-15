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

  const getVariantTypeStyle = (type: string) => {
    switch (type) {
      case 'size': return { background: '#dbeafe', color: '#1e40af' };
      case 'extra': return { background: '#d1fae5', color: '#065f46' };
      case 'addon': return { background: '#ede9fe', color: '#6d28d9' };
      case 'substitute': return { background: '#ffedd5', color: '#c2410c' };
      default: return { background: '#f3f4f6', color: '#374151' };
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    if (price > 0) return `+₦${price.toLocaleString()}`;
    return `-₦${Math.abs(price).toLocaleString()}`;
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>Customizations & Variants</h3>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          disabled={disabled}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: 8,
            background: disabled ? '#d1d5db' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxShadow: disabled ? 'none' : '0 2px 6px rgba(16, 185, 129, 0.12)',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          Add Variant
        </button>
      </div>
      <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 18 }}>
        Add sizes, extras, add-ons, or substitutions for this menu item. These will be shown to customers as customization options when they order.
      </p>

      {/* Add Variant Form */}
      {showAddForm && (
        <div style={{ background: '#f3f4f6', padding: 24, borderRadius: 16, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 style={{ fontWeight: 600, color: '#1f2937', marginBottom: 16, fontSize: 17 }}>Add New Variant</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 32px 1fr', gap: 0, marginBottom: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 14 }}>Variant Name</label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                placeholder="e.g., Large, Extra Cheese"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15, outline: 'none', color: '#374151', marginBottom: 0 }}
              />
            </div>
            <div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 14 }}>Type</label>
              <select
                value={newVariant.type}
                onChange={(e) => setNewVariant({ ...newVariant, type: e.target.value as any })}
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15, outline: 'none', color: '#374151' }}
              >
                <option value="size">Size</option>
                <option value="extra">Extra</option>
                <option value="addon">Add-on</option>
                <option value="substitute">Substitute</option>
              </select>
            </div>
          </div>
          <div style={{ height: 18 }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 32px 1fr', gap: 0, marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 14 }}>Price Modifier (₦)</label>
              <input
                type="number"
                value={newVariant.price_modifier}
                onChange={(e) => setNewVariant({ ...newVariant, price_modifier: parseFloat(e.target.value) || 0 })}
                placeholder="0 for free, positive for extra cost, negative for discount"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15, outline: 'none', color: '#374151' }}
              />
            </div>
            <div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 14 }}>Sort Order</label>
              <input
                type="number"
                value={newVariant.sort_order || 0}
                onChange={(e) => setNewVariant({ ...newVariant, sort_order: parseInt(e.target.value) || 0 })}
                placeholder="Display order"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15, outline: 'none', color: '#374151' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#374151', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={newVariant.is_required || false}
                onChange={(e) => setNewVariant({ ...newVariant, is_required: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              Required Selection
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#374151', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={newVariant.is_available !== false}
                onChange={(e) => setNewVariant({ ...newVariant, is_available: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              Available
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24, marginTop: 24 }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: 8,
                background: '#e5e7eb',
                color: '#374151',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                marginRight: 8,
                transition: 'background 0.2s'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addVariant}
              disabled={!newVariant.name.trim()}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: 8,
                background: !newVariant.name.trim() ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                cursor: !newVariant.name.trim() ? 'not-allowed' : 'pointer',
                opacity: !newVariant.name.trim() ? 0.7 : 1,
                marginLeft: 8,
                boxShadow: !newVariant.name.trim() ? 'none' : '0 2px 6px rgba(16, 185, 129, 0.12)',
                transition: 'all 0.2s'
              }}
            >
              Add Variant
            </button>
          </div>
        </div>
      )}

      {/* Variants List */}
      {variants.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {variants.map((variant, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ padding: '4px 10px', fontSize: 13, fontWeight: 600, borderRadius: 12, ...getVariantTypeStyle(variant.type) }}>
                    {variant.type.toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 600, color: '#1f2937', fontSize: 15 }}>{variant.name}</span>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>({formatPrice(variant.price_modifier)})</span>
                  {variant.is_required && (
                    <span style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, borderRadius: 12, background: '#fee2e2', color: '#b91c1c', marginLeft: 6 }}>
                      Required
                    </span>
                  )}
                  {variant.is_available === false && (
                    <span style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, borderRadius: 12, background: '#f3f4f6', color: '#6b7280', marginLeft: 6 }}>
                      Unavailable
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  Sort Order: {variant.sort_order || 0}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => updateVariant(index, 'is_available', !variant.is_available)}
                  disabled={disabled}
                  style={{ padding: '6px 14px', fontSize: 13, borderRadius: 8, border: 'none', background: variant.is_available !== false ? '#d1fae5' : '#f3f4f6', color: variant.is_available !== false ? '#065f46' : '#6b7280', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                >
                  {variant.is_available !== false ? 'Available' : 'Unavailable'}
                </button>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  disabled={disabled}
                  style={{ padding: '6px 14px', fontSize: 13, borderRadius: 8, border: 'none', background: '#fee2e2', color: '#b91c1c', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
          <p style={{ fontSize: 16, marginBottom: 4 }}>No variants added yet.</p>
          <p style={{ fontSize: 14 }}>Add variants to allow customers to customize this menu item.</p>
        </div>
      )}

      {variants.length > 0 && (
        <div style={{ marginTop: 24, padding: 16, background: '#eff6ff', borderRadius: 12 }}>
          <p style={{ fontSize: 14, color: '#2563eb' }}>
            <strong>Preview:</strong> This item will show customization options to customers. Variants are grouped by type (Size, Extra, Add-on, Substitute) and displayed in sort order.
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantManager;
