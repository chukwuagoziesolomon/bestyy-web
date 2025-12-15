import React, { useState } from 'react';

export interface VariantOption {
  name: string;
  price_modifier: number;
  is_available: boolean;
  sort_order: number;
}

export interface VariantGroup {
  name: string;
  required: boolean;
  min_select: number;
  max_select: number;
  sort_order: number;
  options: VariantOption[];
}

interface VariantGroupManagerProps {
  groups: VariantGroup[];
  onChange: (groups: VariantGroup[]) => void;
  disabled?: boolean;
}

const defaultOption: VariantOption = {
  name: '',
  price_modifier: 0,
  is_available: true,
  sort_order: 1,
};

const defaultGroup: VariantGroup = {
  name: '',
  required: false,
  min_select: 0,
  max_select: 1,
  sort_order: 1,
  options: [],
};

const VariantGroupManager: React.FC<VariantGroupManagerProps> = ({ groups, onChange, disabled }) => {
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroup, setNewGroup] = useState<VariantGroup>({ ...defaultGroup });
  const [optionDraft, setOptionDraft] = useState<VariantOption>({ ...defaultOption });

  const addGroup = () => {
    if (!newGroup.name.trim()) return;
    onChange([...groups, { ...newGroup, sort_order: groups.length + 1 }]);
    setNewGroup({ ...defaultGroup });
    setShowAddGroup(false);
  };

  const removeGroup = (idx: number) => {
    onChange(groups.filter((_, i) => i !== idx));
  };

  const addOptionToGroup = (groupIdx: number) => {
    if (!optionDraft.name.trim()) return;
    const updatedGroups = [...groups];
    updatedGroups[groupIdx].options.push({ ...optionDraft, sort_order: updatedGroups[groupIdx].options.length + 1 });
    onChange(updatedGroups);
    setOptionDraft({ ...defaultOption });
  };

  const removeOptionFromGroup = (groupIdx: number, optIdx: number) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIdx].options = updatedGroups[groupIdx].options.filter((_, i) => i !== optIdx);
    onChange(updatedGroups);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>Customizations & Variants</h3>
        <button
          type="button"
          onClick={() => setShowAddGroup(true)}
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
          Add Variant Group
        </button>
      </div>
      <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 18 }}>
        Add groups (e.g., Size, Extras) and options for each group. Each option can have a price modifier.
      </p>
      {showAddGroup && (
        <div style={{ background: '#f3f4f6', padding: 24, borderRadius: 16, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 style={{ fontWeight: 600, color: '#1f2937', marginBottom: 16, fontSize: 17 }}>Add New Variant Group</h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <input
              type="text"
              value={newGroup.name}
              onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
              placeholder="Group Name (e.g., Size, Extras)"
              style={{ flex: 2, padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15 }}
            />
            <input
              type="number"
              value={newGroup.min_select}
              onChange={e => setNewGroup({ ...newGroup, min_select: parseInt(e.target.value) || 0 })}
              placeholder="Min Select"
              style={{ width: 100, padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15 }}
            />
            <input
              type="number"
              value={newGroup.max_select}
              onChange={e => setNewGroup({ ...newGroup, max_select: parseInt(e.target.value) || 1 })}
              placeholder="Max Select"
              style={{ width: 100, padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15 }}
            />
            <input
              type="number"
              value={newGroup.sort_order}
              onChange={e => setNewGroup({ ...newGroup, sort_order: parseInt(e.target.value) || 1 })}
              placeholder="Sort Order"
              style={{ width: 100, padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#374151', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={newGroup.required}
                onChange={e => setNewGroup({ ...newGroup, required: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              Required
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24, marginTop: 16 }}>
            <button
              type="button"
              onClick={() => setShowAddGroup(false)}
              style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#e5e7eb', color: '#374151', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginRight: 8, transition: 'background 0.2s' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addGroup}
              disabled={!newGroup.name.trim()}
              style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: !newGroup.name.trim() ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontWeight: 600, fontSize: 15, cursor: !newGroup.name.trim() ? 'not-allowed' : 'pointer', opacity: !newGroup.name.trim() ? 0.7 : 1, marginLeft: 8, boxShadow: !newGroup.name.trim() ? 'none' : '0 2px 6px rgba(16, 185, 129, 0.12)', transition: 'all 0.2s' }}
            >
              Add Group
            </button>
          </div>
        </div>
      )}
      {/* List groups and options */}
      {groups.map((group, groupIdx) => (
        <div key={groupIdx} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, marginBottom: 24, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 17, color: '#1f2937' }}>{group.name}</span>
              <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 12 }}>
                (Min: {group.min_select}, Max: {group.max_select}, {group.required ? 'Required' : 'Optional'})
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeGroup(groupIdx)}
              style={{ padding: '6px 14px', fontSize: 13, borderRadius: 8, border: 'none', background: '#fee2e2', color: '#b91c1c', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            >
              Remove Group
            </button>
          </div>
          {/* Options for this group */}
          <div style={{ marginLeft: 12 }}>
            {group.options.map((opt, optIdx) => (
              <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontWeight: 500, color: '#374151', fontSize: 15 }}>{opt.name}</span>
                <span style={{ fontSize: 14, color: '#6b7280' }}>₦{opt.price_modifier}</span>
                <span style={{ fontSize: 13, color: opt.is_available ? '#059669' : '#9ca3af' }}>{opt.is_available ? 'Available' : 'Unavailable'}</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Order: {opt.sort_order}</span>
                <button
                  type="button"
                  onClick={() => removeOptionFromGroup(groupIdx, optIdx)}
                  style={{ padding: '4px 10px', fontSize: 13, borderRadius: 8, border: 'none', background: '#fee2e2', color: '#b91c1c', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                >
                  Remove
                </button>
              </div>
            ))}
            {/* Add option form */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <input
                type="text"
                value={optionDraft.name}
                onChange={e => setOptionDraft({ ...optionDraft, name: e.target.value })}
                placeholder="Option Name (e.g., Large, Extra Cheese)"
                style={{ flex: 2, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
              />
              <input
                type="number"
                value={optionDraft.price_modifier}
                onChange={e => setOptionDraft({ ...optionDraft, price_modifier: parseFloat(e.target.value) || 0 })}
                placeholder="Price Modifier"
                style={{ width: 120, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
              />
              <input
                type="number"
                value={optionDraft.sort_order}
                onChange={e => setOptionDraft({ ...optionDraft, sort_order: parseInt(e.target.value) || 1 })}
                placeholder="Sort Order"
                style={{ width: 100, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
              />
              <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#374151', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={optionDraft.is_available}
                  onChange={e => setOptionDraft({ ...optionDraft, is_available: e.target.checked })}
                  style={{ marginRight: 6 }}
                />
                Available
              </label>
              <button
                type="button"
                onClick={() => addOptionToGroup(groupIdx)}
                disabled={!optionDraft.name.trim()}
                style={{ padding: '8px 16px', border: 'none', borderRadius: 8, background: !optionDraft.name.trim() ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: !optionDraft.name.trim() ? 'not-allowed' : 'pointer', opacity: !optionDraft.name.trim() ? 0.7 : 1, boxShadow: !optionDraft.name.trim() ? 'none' : '0 2px 6px rgba(16, 185, 129, 0.12)', transition: 'all 0.2s' }}
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      ))}
      {groups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
          <p style={{ fontSize: 16, marginBottom: 4 }}>No variant groups added yet.</p>
          <p style={{ fontSize: 14 }}>Add groups to allow customers to customize this menu item.</p>
        </div>
      )}
    </div>
  );
};

export default VariantGroupManager;
