import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import './VendorProfile.css';
import PremiumLoadingAnimation from './components/PremiumLoadingAnimation';
import { vendorApi, VendorProfile as VendorProfileType, MenuCategory, MenuItem, VendorProfileResponse, VendorMenuResponse } from './services/vendorApi';
import { cartApi } from './services/cartApi';
import { useCart, CartItem } from './context/CartContext';
import { getMenuItemImageUrl } from './utils/imageUtils';
import { getVendorIdFromSlug } from './utils/urlUtils';

const VendorProfile: React.FC = () => {
  const { id: vendorSlug } = useParams<{ id: string }>();
  const vendorId = vendorSlug ? getVendorIdFromSlug(vendorSlug)?.toString() : undefined;
  const [vendor, setVendor] = useState<VendorProfileType | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { state: cartState, addItem, updateQuantity, removeItem, replaceCart } = useCart();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [showMobileCart, setShowMobileCart] = useState<boolean>(false);
  const [mobileCartLoading, setMobileCartLoading] = useState<boolean>(false);
  const [mobileCartError, setMobileCartError] = useState<string | null>(null);

  useEffect(() => {
    console.log('VendorProfile useEffect triggered, vendorId:', vendorId, 'type:', typeof vendorId);
    if (vendorId && vendorId !== 'undefined') {
      fetchVendorProfile();
    }
  }, [vendorId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const MOBILE_BREAKPOINT = 1024;
    const updateViewport = () => {
      setIsMobileView(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  const fetchVendorProfile = async () => {
    try {
      console.log('Fetching vendor profile for vendorId:', vendorId);
      setLoading(true);
      setError(null);

      const response: VendorMenuResponse = await vendorApi.getVendorMenuProfile(parseInt(vendorId!));
      console.log('API response:', response);

      if (response.success) {
        // Transform the vendor data to match existing VendorProfile interface
        const transformedVendor: VendorProfileType = {
          id: response.vendor.id,
          business_name: response.vendor.business_name,
          business_category: response.vendor.business_category,
          business_description: response.vendor.business_description,
          business_address: response.vendor.business_address,
          phone: response.vendor.phone,
          phone_number: response.vendor.phone,
          logo: response.vendor.logo,
          cover_image: response.vendor.cover_image,
          cover_photo: response.vendor.cover_image, // Use cover_image as cover_photo
          bio: response.vendor.business_description, // Use description as bio
          is_featured: response.vendor.is_featured,
          verification_status: response.vendor.verification_status,
          service_areas: response.vendor.service_areas,
          delivery_radius: response.vendor.delivery_radius,
          delivery_time: '30-45 mins', // Default delivery time since not in response
          offers_delivery: response.vendor.offers_delivery,
          opening_hours: response.vendor.opening_hours,
          closing_hours: response.vendor.closing_hours,
          is_open: response.vendor.is_open,
          rating: 4.5, // Default rating since not in response
          total_reviews: 0, // Default since not in response
          is_favorited: false, // Default since not in response
          created_at: response.vendor.created_at,
          updated_at: response.vendor.updated_at
        };

        setVendor(transformedVendor);

        // Transform menu items into categories
        const transformedCategories: MenuCategory[] = Object.entries(response.categories).map(([categoryName, items]) => ({
          category: categoryName,
          item_count: items.length,
          items: items.map(item => ({
            id: item.id,
            name: item.dish_name,
            description: item.item_description,
            price: item.price,
            currency: 'NGN',
            image: item.image,
            category: item.category,
            is_available: item.available_now,
            preparation_time: undefined,
            ingredients: [], // Not provided in response
            allergens: [], // Not provided in response
            is_vegetarian: false, // Not provided in response
            is_spicy: false, // Not provided in response
            calories: undefined,
            created_at: item.created_at,
            updated_at: item.created_at
          }))
        }));

        setMenuCategories(transformedCategories);

        // Set first category as active if available
        if (transformedCategories.length > 0) {
          setActiveCategory(transformedCategories[0].category);
        }
      } else {
        setError('Failed to fetch vendor profile');
      }
    } catch (err) {
      console.error('Error fetching vendor profile:', err);
      setError('Unable to load vendor profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!vendor) return;

    try {
      const response = await vendorApi.toggleFavorite(vendor.id);
      if (response.success) {
        setVendor({ ...vendor, is_favorited: response.is_favorited });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Get all menu items from all categories
  const allMenuItems = menuCategories.flatMap(category => category.items);

  // Filter menu items based on active category and search term
  const filteredMenuItems = allMenuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Vendor-specific cart view for the sidebar
  const vendorCartItems = cartState.items.filter(i => vendor && i.vendorId === vendor.id);
  const vendorCartCount = vendorCartItems.reduce((sum, i) => sum + i.quantity, 0);
  const vendorCartTotal = vendorCartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  // Handle adding item to cart
  const handleAddToCart = (item: MenuItem) => {
    if (!vendor) return;
    setPendingItem(item);
    setSpecialInstructions('');
    setShowAddModal(true);
  };

  const confirmAddToCart = async () => {
    if (!vendor || !pendingItem) return;
    try {
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: pendingItem.id,
        name: pendingItem.name,
        description: pendingItem.description,
        price: pendingItem.price,
        currency: pendingItem.currency,
        image: pendingItem.image,
        category: pendingItem.category,
        vendorId: vendor.id,
        vendorName: vendor.business_name,
        specialInstructions: specialInstructions || undefined,
      };
      
      // Add to cart using new JWT-based cart service
      await addItem(cartItem);
      
      setShowAddModal(false);
      setPendingItem(null);
      setSpecialInstructions('');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const normalizeCartItemsFromApi = (apiResponse: any): CartItem[] => {
    if (!apiResponse) return [];

    const maybeArray =
      Array.isArray(apiResponse) ? apiResponse :
      Array.isArray(apiResponse?.items) ? apiResponse.items :
      Array.isArray(apiResponse?.cart_items) ? apiResponse.cart_items :
      Array.isArray(apiResponse?.data?.items) ? apiResponse.data.items :
      [];

    return maybeArray.map((raw: any) => {
      const menuItem = raw?.menu_item ?? raw?.item ?? raw?.menu_item_detail ?? raw;
      const quantityRaw = raw?.quantity ?? raw?.menu_item_quantity ?? menuItem?.quantity ?? 1;
      const priceRaw = menuItem?.price ?? raw?.price ?? menuItem?.amount ?? 0;
      const priceNumeric = typeof priceRaw === 'string' ? parseFloat(priceRaw) : Number(priceRaw) || 0;
      const quantityNumeric = typeof quantityRaw === 'string' ? parseInt(quantityRaw, 10) || 1 : Number(quantityRaw) || 1;

      const derivedVendorId = vendor?.id ?? Number(menuItem?.vendor_id) ?? Number(raw?.vendor_id) ?? Number(apiResponse?.vendor_id) ?? 0;
      const derivedVendorName = vendor?.business_name ?? raw?.vendor_name ?? menuItem?.vendor_name ?? apiResponse?.vendor_name ?? 'Vendor';

      const imageCandidate =
        menuItem?.image_urls?.medium ??
        menuItem?.image_urls?.thumbnail ??
        menuItem?.image_urls?.original ??
        menuItem?.image_url ??
        menuItem?.image ??
        raw?.image ??
        '';

      return {
        id: Number(menuItem?.id ?? raw?.menu_item_id ?? raw?.id ?? Date.now()),
        name: menuItem?.name ?? menuItem?.dish_name ?? raw?.name ?? 'Menu Item',
        description: menuItem?.description ?? menuItem?.item_description ?? raw?.description ?? '',
        price: priceNumeric,
        currency: menuItem?.currency ?? raw?.currency ?? 'NGN',
        image: imageCandidate,
        category: menuItem?.category ?? raw?.category ?? 'General',
        vendorId: derivedVendorId,
        vendorName: derivedVendorName,
        quantity: quantityNumeric,
        specialInstructions: raw?.special_instructions ?? raw?.instructions ?? menuItem?.special_instructions ?? undefined,
      } as CartItem;
    });
  };

  const handleMobileCartToggle = async () => {
    if (showMobileCart) {
      setShowMobileCart(false);
      return;
    }

    setShowMobileCart(true);
    setMobileCartLoading(true);
    setMobileCartError(null);

    try {
      const apiCart = await cartApi.getCart();
      const normalizedItems = normalizeCartItemsFromApi(apiCart);
      if (normalizedItems.length > 0) {
        replaceCart(normalizedItems);
      }
    } catch (err) {
      console.error('Error fetching cart via API:', err);
      setMobileCartError('Unable to load your cart. Please try again.');
    } finally {
      setMobileCartLoading(false);
    }
  };

  const mobileCartTitle = useMemo(() => {
    if (!vendor) return 'Your Cart';
    return `${vendor.business_name} cart`;
  }, [vendor]);

  // Check if item is already in cart
  const getItemQuantityInCart = (itemId: number) => {
    const cartItem = cartState.items.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  if (loading) {
    return (
      <div className="vendor-profile-page">
        <PremiumLoadingAnimation message="Loading vendor profile..." />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="vendor-profile-page">
        <div className="error-state">
          <div className="error-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="error-icon">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4"/>
              <path d="M12 16h.01"/>
            </svg>
            <h3>Error loading vendor</h3>
            <p>{error || 'Vendor not found'}</p>
            <Link to="/recommendations" className="retry-button">
              Back to Recommendations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {isMobileView && vendor && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 60,
            background: '#ffffff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => window.history.back()}
              style={{
                border: 'none',
                background: '#f3f4f6',
                borderRadius: 999,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {vendor.business_name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6b7280' }}>
                <span>⭐ {vendor.rating.toFixed(1)}</span>
                <span>•</span>
                <span>{vendor.delivery_time}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleMobileCartToggle}
            style={{
              position: 'relative',
              border: 'none',
              background: '#10b981',
              color: '#ffffff',
              borderRadius: 999,
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
            }}
            aria-label="View cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {vendorCartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 999,
                  background: '#ffffff',
                  color: '#047857',
                  fontSize: 10,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px',
                }}
              >
                {vendorCartCount}
              </span>
            )}
          </button>
        </div>
      )}
      {/* Top hero */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 220, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <img
            src={vendor.cover_photo || vendor.logo || '/placeholder-banner.jpg'}
            alt={vendor.business_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: 12, left: 12, background: '#fff', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
            20% OFF your first order with code BESTIY20
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={vendor.logo || '/placeholder-vendor.jpg'}
              alt={vendor.business_name}
              style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', border: '2px solid #fff' }}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>
                {vendor.business_name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 12 }}>
                <span>⭐ {vendor.rating.toFixed(1)}</span>
                <span>•</span>
                <span>{vendor.delivery_time}</span>
                <span>•</span>
                <span>{vendor.business_category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12, overflowX: 'auto' }}>
          {['Burgers', 'Sandwiches', 'Pizzas', 'Salads', 'Pasta', 'Bowls', 'Drinks'].map((pill) => (
            <button
              key={pill}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: '1px solid #e5e7eb',
                background: '#fff',
                fontSize: 12,
                fontWeight: 700,
                color: '#374151',
                whiteSpace: 'nowrap'
              }}
              onClick={() => setActiveCategory(pill)}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Main two-column layout */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobileView ? '8px 16px 80px' : '8px 16px 40px',
          display: isMobileView ? 'block' : 'grid',
          gridTemplateColumns: isMobileView ? undefined : '1fr 360px',
          gap: 24,
        }}
      >
        {/* Left: menu grid */}
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobileView ? 'repeat(auto-fill,minmax(160px,1fr))' : 'repeat(3,minmax(0,1fr))',
              gap: 16,
            }}
          >
            {filteredMenuItems.map((item) => (
              <div key={item.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                <div style={{ height: 120, overflow: 'hidden' }}>
                  <img
                    src={getMenuItemImageUrl(item) || '/placeholder-food.jpg'}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontWeight: 800, fontSize: 12, color: '#111827' }}>₦{item.price.toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', height: 30, overflow: 'hidden' }}>{item.description}</div>
                  <div style={{ marginTop: 10 }}>
                    {getItemQuantityInCart(item.id) > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => updateQuantity(item.id, getItemQuantityInCart(item.id) - 1)}
                          style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontWeight: 800 }}
                        >
                          -
                        </button>
                        <div style={{ minWidth: 20, textAlign: 'center', fontWeight: 800, fontSize: 12 }}>{getItemQuantityInCart(item.id)}</div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #10b981', background: '#10b981', color: '#fff', fontWeight: 800 }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.is_available}
                        style={{
                          width: '100%',
                          background: item.is_available ? '#10b981' : '#9ca3af',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 12px',
                          fontWeight: 800,
                          fontSize: 12,
                          cursor: item.is_available ? 'pointer' : 'not-allowed'
                        }}
                      >
                        {item.is_available ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: cart sidebar */}
        {!isMobileView && (
          <div style={{ position: 'sticky', top: 16, alignSelf: 'start', height: '100%' }}>
            {vendorCartItems.length === 0 ? (
              <div style={{ border: '1px dashed #e5e7eb', borderRadius: 16, padding: 24, textAlign: 'center', background: '#fafafa' }}>
                <div style={{ width: 140, height: 140, borderRadius: '50%', background: '#fff', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px #f3f4f6' }}>
                  <div style={{ width: 90, height: 52, background: '#f3f4f6', borderRadius: '50%/60% 60% 40% 40%' }} />
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>No item has been added yet</div>
                <div style={{ fontSize: 10, color: '#9ca3af' }}>Add items and proceed to checkout</div>
              </div>
            ) : (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>Your Cart</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{vendorCartCount} item(s)</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360, overflowY: 'auto' }}>
                  {vendorCartItems.map(ci => (
                    <div key={ci.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6' }}>
                        <img src={ci.image} alt={ci.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: '#111827', lineHeight: '16px' }}>{ci.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                          <button
                            onClick={() => updateQuantity(ci.id, ci.quantity - 1)}
                            style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontWeight: 800 }}
                          >
                            -
                          </button>
                          <div style={{ minWidth: 18, textAlign: 'center', fontWeight: 800, fontSize: 12 }}>{ci.quantity}</div>
                          <button
                            onClick={() => updateQuantity(ci.id, ci.quantity + 1)}
                            style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #10b981', background: '#10b981', color: '#fff', fontWeight: 800 }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(ci.id)}
                            style={{ marginLeft: 6, fontSize: 11, color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                        {ci.specialInstructions && (
                          <div style={{ marginTop: 6, fontSize: 11, color: '#6b7280' }}>“{ci.specialInstructions}”</div>
                        )}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 12, color: '#111827' }}>₦{(ci.price * ci.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Subtotal</div>
                  <div style={{ fontWeight: 900, fontSize: 14 }}>₦{vendorCartTotal.toLocaleString()}</div>
                </div>
                <Link to={`/checkout/${vendor.id}`} style={{ display: 'block', marginTop: 12, textDecoration: 'none' }}>
                  <div style={{ background: '#10b981', color: '#fff', textAlign: 'center', padding: '10px 12px', borderRadius: 10, fontWeight: 800, fontSize: 13 }}>
                    Go to Checkout
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {isMobileView && showMobileCart && (
        <div
          onClick={() => setShowMobileCart(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 80,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxHeight: '80vh',
              background: '#ffffff',
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px 32px',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', textTransform: 'capitalize' }}>{mobileCartTitle}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {vendorCartCount} item{vendorCartCount === 1 ? '' : 's'}
                </div>
              </div>
              <button
                onClick={() => setShowMobileCart(false)}
                style={{ border: 'none', background: '#f3f4f6', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close cart"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {mobileCartLoading ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '40px 0' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#10b981', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontSize: 12, color: '#6b7280' }}>Loading your cart...</div>
              </div>
            ) : mobileCartError ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#ef4444', fontSize: 13, padding: '32px 0' }}>
                {mobileCartError}
              </div>
            ) : vendorCartItems.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '40px 0', color: '#6b7280' }}>
                <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>No items yet</div>
                <div style={{ fontSize: 12 }}>Add meals from {vendor?.business_name ?? 'this vendor'} to see them here.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', maxHeight: '45vh', paddingRight: 4 }}>
                {vendorCartItems.map(ci => (
                  <div key={ci.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#f3f4f6' }}>
                      <img src={ci.image} alt={ci.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{ci.name}</div>
                          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>₦{ci.price.toLocaleString()} each</div>
                        </div>
                        <button
                          onClick={() => removeItem(ci.id)}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: 12, fontWeight: 600 }}
                        >
                          Remove
                        </button>
                      </div>
                      {ci.specialInstructions && (
                        <div style={{ marginTop: 6, fontSize: 11, color: '#6b7280' }}>“{ci.specialInstructions}”</div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button
                            onClick={() => updateQuantity(ci.id, ci.quantity - 1)}
                            style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', fontWeight: 800 }}
                          >
                            -
                          </button>
                          <div style={{ minWidth: 24, textAlign: 'center', fontWeight: 800, fontSize: 13 }}>{ci.quantity}</div>
                          <button
                            onClick={() => updateQuantity(ci.id, ci.quantity + 1)}
                            style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #10b981', background: '#10b981', color: '#fff', fontWeight: 800 }}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>₦{(ci.price * ci.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!mobileCartLoading && vendorCartItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#6b7280' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 800, color: '#111827' }}>₦{vendorCartTotal.toLocaleString()}</span>
                </div>
                <Link
                  to={`/checkout/${vendor.id}`}
                  onClick={() => setShowMobileCart(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{ width: '100%', background: '#10b981', color: '#fff', textAlign: 'center', padding: '12px 16px', borderRadius: 12, fontWeight: 800, fontSize: 14 }}>
                    Go to Checkout
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 1, color: '#6b7280' }}>LOCATIONS</div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#111827', lineHeight: '18px' }}>
              ENUGU<br/>ABUJA<br/>LAGOS<br/>PORT-HARCOURT
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>+1 909 287 7764</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>hello@bestie.com</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Whatsapp »</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Become Partner</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 18, color: '#6b7280', fontSize: 12 }}>
          <span>◎</span>
          <span>◈</span>
          <span>◉</span>
          <span>◆</span>
        </div>

        <div style={{ marginTop: 14, fontSize: 10, color: '#9ca3af' }}>Privacy</div>
      </div>
      {/* Add to cart modal */}
      {showAddModal && pendingItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ 
            width: 420, 
            maxWidth: '95%', 
            background: '#fff', 
            borderRadius: 16, 
            padding: '20px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            margin: '16px'
          }}>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 18, 
              marginBottom: 12,
              color: '#111827'
            }}>Add special instructions</div>
            <div style={{ 
              fontSize: 14, 
              color: '#6b7280', 
              marginBottom: 16,
              lineHeight: 1.4
            }}>
              Optional: e.g., "Extra spicy", "No onions", "Well done".
            </div>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Type instructions..."
              rows={4}
              style={{ 
                width: '100%', 
                border: '2px solid #e5e7eb', 
                borderRadius: 12, 
                padding: '14px', 
                fontSize: 16, 
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 12, 
              marginTop: 20,
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => { setShowAddModal(false); setPendingItem(null); }} 
                style={{ 
                  border: '2px solid #e5e7eb', 
                  background: '#fff', 
                  borderRadius: 12, 
                  padding: '12px 20px', 
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmAddToCart} 
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 12, 
                  padding: '12px 24px', 
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;