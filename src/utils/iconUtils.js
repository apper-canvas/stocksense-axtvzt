import * as Icons from 'lucide-react';
  
export default function getIcon(iconName) {
  const IconComponent = Icons[iconName] || Icons.Smile;
  return (props) => <IconComponent {...props} />;
};