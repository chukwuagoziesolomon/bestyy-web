import React from 'react';
import EditMenuItemPage from './EditMenuItemPage';

// Always render the unified edit page; the page itself handles responsive layout.
const ResponsiveEditMenu: React.FC = () => {
  return <EditMenuItemPage />;
};

export default ResponsiveEditMenu;
