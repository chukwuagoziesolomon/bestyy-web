import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMenuItem } from '../api';
import { showError, showSuccess } from '../toast';
import './AddMenuItemPage.css';

type NewMenuItem = {
  name: string;
  item_description: string;
  category: string;
  quantity: string;
  price: string;
  image?: File;
  available_now: boolean;
};

const AddMenuItemPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuItem, setMenuItem] = useState<NewMenuItem>({
    name: '',
    item_description: '',
    category: '',
    quantity: '',
    price: '',
    image: undefined,
    available_now: true,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setMenuItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMenuItem(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('You must be logged in to add an item.');
      return;
    }
    if (!menuItem.name || !menuItem.price || !menuItem.category || !menuItem.item_description || !menuItem.quantity) {
      showError('All fields except image are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createMenuItem(token, {
        dish_name: menuItem.name,
        item_description: menuItem.item_description,
        price: parseFloat(menuItem.price).toFixed(2),
        category: menuItem.category,
        quantity: parseInt(menuItem.quantity, 10),
        image: menuItem.image,
        available_now: menuItem.available_now,
      });
      showSuccess('Menu item added successfully!');
      navigate('/vendor/dashboard/menu');
    } catch (err: any) {
      showError(err.message || 'Failed to add menu item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-menu-container">
      <h1 className="add-menu-title">Add New Menu</h1>
      <div className="add-menu-form-container">
        <form onSubmit={handleSubmit}>
          <div className="upload-section">
            <label htmlFor="image-upload" className="upload-label">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" fill="#E0F2F2"/>
                    <path d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 20H18.02" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M34 22V28C34 32 32 34 28 34H20C16 34 14 32 14 28V20C14 16 16 14 20 14H22" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="upload-text">Upload Photo</span>
                </div>
              )}
            </label>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Item Name</label>
              <input type="text" id="name" name="name" value={menuItem.name} onChange={handleInputChange} placeholder="Jollof rice" required />
            </div>
            <div className="form-group item-description">
              <label htmlFor="item_description">Item Description</label>
              <textarea id="item_description" name="item_description" value={menuItem.item_description} onChange={handleInputChange} placeholder="Smoky jollof rice with susage, carrot and diced chunks" required/>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input type="text" id="category" name="category" value={menuItem.category} onChange={handleInputChange} placeholder="Rice Dish" required/>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" name="quantity" value={menuItem.quantity} onChange={handleInputChange} placeholder="20" required min="1"/>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" name="price" value={menuItem.price} onChange={handleInputChange} placeholder="1500.00" required step="0.01"/>
            </div>
            <div className="form-group">
              <label htmlFor="available_now">Available Now?</label>
              <input type="checkbox" id="available_now" name="available_now" checked={menuItem.available_now} onChange={handleInputChange} />
            </div>
          </div>
          <div className="save-button-container">
            <button type="submit" className="save-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemPage; 