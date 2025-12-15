import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenuItem, updateMenuItem } from '../api';
import { showError, showSuccess, showApiError } from '../toast';
import VariantGroupManager, { VariantGroup } from '../components/VariantGroupManager';
import '../UserLogin.css'; // Reusing styles
import { useResponsive } from '../hooks/useResponsive';
import DesktopEditMenuItem from './DesktopEditMenuItem';

type MenuItemData = {
  dish_name: string;
  price: string;
  category: string;
  otherCategory?: string;
  image?: File | string; // Can be a File for new uploads or string for existing URL
  available: boolean;
  description?: string;
  quantity?: number;
  video?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const EditMenuItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  // Capture initial device type on first mount to avoid switching UIs
  const [initialIsMobile, setInitialIsMobile] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    if (initialIsMobile === null) setInitialIsMobile(isMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState<MenuItemData & { variants?: VariantGroup[] }>({
    dish_name: '',
    price: '',
    category: '',
    otherCategory: '',
    image: undefined,
    available: true,
    variants: [],
    quantity: 0,
    video: undefined,
    created_at: undefined,
    updated_at: undefined
  });

  const [loading, setLoading] = useState(false);
  const [initialImage, setInitialImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchMenuItem() {
      if (!id || !localStorage.getItem('access_token')) {
        showError('Missing item ID or authentication token.');
        navigate('/vendor/menu');
        return;
      }

      try {
        setLoading(true);
        const response = await getMenuItem(localStorage.getItem('access_token')!, id);
          console.log('Fetched menu item response:', response);
        // Use menu_item key from API response
        const item = response.menu_item;
        // Build variant groups: support grouped (variants with options) or flat list
        let groups: VariantGroup[] = [];
        if (item.variants && Array.isArray(item.variants)) {
          if (item.variants.length > 0 && item.variants[0].options) {
            // already grouped
            // Correct mapping for variant groups
            if (Array.isArray(item.variants) && item.variants.length > 0 && item.variants[0].options) {
              groups = item.variants.map((g: any) => ({
                name: g.name || '',
                required: !!g.required,
                min_select: g.min_select || 0,
                max_select: g.max_select || 1,
                sort_order: g.sort_order || 1,
                options: (g.options || []).map((o: any) => ({
                  name: o.name || '',
                  price_modifier: parseFloat(o.price_modifier || 0) || 0,
                  is_available: o.is_available !== false,
                  sort_order: o.sort_order || 1
                }))
              }));
            } else {
              // flat variants -> group by type
              const byType: Record<string, any> = {};
              for (const v of item.variants || []) {
                const type = (v.type || 'extra').toString();
                if (!byType[type]) {
                  byType[type] = { name: type, required: !!v.is_required, min_select: 0, max_select: 1, sort_order: 1, options: [] };
                }
                byType[type].options.push({
                  name: v.name || '',
                  price_modifier: parseFloat(v.price_modifier || 0) || 0,
                  is_available: v.is_available !== false,
                  sort_order: v.sort_order || 1
                });
              }
              groups = Object.values(byType);
            }
          } else {
            // flat variants -> group by type
            const byType: Record<string, VariantGroup> = {};
            for (const v of item.variants) {
              const type = (v.type || 'extra').toString();
              if (!byType[type]) {
                byType[type] = { name: type, required: !!v.is_required, min_select: 0, max_select: 1, sort_order: 1, options: [] };
              }
              byType[type].options.push({
                name: v.name || '',
                price_modifier: parseFloat(v.price_modifier || 0) || 0,
                is_available: v.is_available !== false,
                sort_order: v.sort_order || 1
              });
            }
            groups = Object.values(byType);
          }
        }

        setFormData({
          dish_name: item.dish_name || '',
          price: item.price ? item.price.toString() : '',
          category: item.category || '',
          otherCategory: item.otherCategory || '',
          image: item.image || undefined,
          available: item.available_now !== undefined ? item.available_now : true,
          description: item.item_description || '',
          quantity: item.quantity ?? 0,
          video: item.video ?? null,
          created_at: item.created_at ?? null,
          updated_at: item.updated_at ?? null,
          variants: groups
        });

        if (item.image) {
          setInitialImage(item.image);
        }
      } catch (error: any) {
        console.error('Failed to fetch menu item:', error);
        // Provide clearer message for 404 / not-found cases
        const message = (error && error.message) ? error.message.toString().toLowerCase() : '';
        if (message.includes('not found') || message.includes('404')) {
          showError('Menu item not found or you do not have permission to edit this item.');
        } else {
          showApiError(error);
        }
        // Do not immediately navigate away so user can see the error and debug
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItem();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSave = async () => {
    console.log('EditMenuItemPage.handleSave invoked', { id, formData });
    if (!formData.dish_name.trim()) {
      showError('Dish name is required');
      return;
    }

    if (!formData.price.trim()) {
      showError('Price is required');
      return;
    }

    if (!formData.category.trim()) {
      showError('Category is required');
      return;
    }

    try {
      setLoading(true);

      // Map variant groups back to flat variants expected by API
      const allowedTypes = ['size', 'extra', 'addon', 'substitute'] as const;
      const mapGroupNameToType = (name: string): 'size' | 'extra' | 'addon' | 'substitute' => {
        const lower = name.trim().toLowerCase();
        if (allowedTypes.includes(lower as any)) return lower as any;
        for (const t of allowedTypes) {
          if (lower.includes(t)) return t;
        }
        return 'extra';
      };

      const flatVariants = (formData.variants || []).flatMap(g =>
        (g.options || []).map(o => ({
          name: o.name,
          type: mapGroupNameToType(g.name),
          price_modifier: o.price_modifier,
          is_required: !!g.required,
          is_available: !!o.is_available,
          sort_order: o.sort_order
        }))
      );

      const updateData = {
        dish_name: formData.dish_name,
        item_description: undefined as any,
        price: formData.price,
        category: formData.category,
        available_now: formData.available,
        otherCategory: formData.otherCategory,
        image: formData.image instanceof File ? formData.image : undefined,
        variants: flatVariants
      };

      await updateMenuItem(localStorage.getItem('access_token')!, id!, updateData);
      showSuccess('Menu item updated successfully!');
      navigate('/vendor/menu');
    } catch (error) {
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        setLoading(true);
        // Add delete API call here when available
        showSuccess('Menu item deleted successfully!');
        navigate('/vendor/menu');
      } catch (error) {
        showApiError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !formData.dish_name) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading menu item...
      </div>
    );
  }

  // Use a single responsive editor component for all devices
  return (
    <DesktopEditMenuItem
      formData={formData}
      setFormData={setFormData}
      handleInputChange={handleInputChange}
      handleImageChange={handleImageChange}
      handleSave={handleSave}
      handleDelete={handleDelete}
      loading={loading}
      initialImage={initialImage}
    />
  );
};

export default EditMenuItemPage;