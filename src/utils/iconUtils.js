import React from 'react';
import * as Icons from 'lucide-react';

// This function returns the icon component from lucide-react
// If the icon doesn't exist, it defaults to the Smile icon
const getIcon = (iconName) => {
  // Get the icon component or default to Smile
  const IconComponent = Icons[iconName] || Icons.Smile;
  
  // Return a function that renders the icon with the given props
  return (props) => React.createElement(IconComponent, props);
};

export default getIcon;