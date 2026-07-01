import React from 'react';
import * as Icons from 'lucide-react';

interface IconeProps {
  nom: string;
  className?: string;
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const Icone: React.FC<IconeProps> = ({ nom, className, size, onClick, style }) => {
  const nomFormate = (name: string): string => {
    if (!name) return 'HelpCircle';
    
    switch (name.toLowerCase()) {
      case 'mail': return 'Mail';
      case 'lock': return 'Lock';
      case 'eye': return 'Eye';
      case 'eye-off': return 'EyeOff';
      case 'log-out': return 'LogOut';
      case 'search': return 'Search';
      case 'chevron-down': return 'ChevronDown';
      case 'chevron-up': return 'ChevronUp';
      case 'plus': return 'Plus';
      case 'trash':
      case 'trash-2':
      case 'del': return 'Trash2';
      case 'edit': return 'Edit';
      case 'chart':
      case 'trending-up': return 'TrendingUp';
      case 'folder': return 'Folder';
      case 'users': return 'Users';
      case 'dollar':
      case 'dollar-sign': return 'DollarSign';
      case 'activity': return 'Activity';
      case 'file-text': return 'FileText';
      case 'menu': return 'Menu';
      case 'x': return 'X';
      case 'alert-circle': return 'AlertCircle';
      case 'calendar': return 'Calendar';
      case 'user': return 'User';
      case 'info': return 'Info';
      case 'check': return 'Check';
      case 'arrow-left': return 'ArrowLeft';
      case 'chevron-left': return 'ChevronLeft';
      case 'chevron-right': return 'ChevronRight';
      default: return 'HelpCircle';
    }
  };

  const formattedName = nomFormate(nom);
  // @ts-ignore
  const IconComponent = (Icons[formattedName] || Icons.HelpCircle) as React.ComponentType<any>;

  return (
    <IconComponent 
      className={className} 
      size={size} 
      onClick={onClick} 
      style={{
        ...style,
        ...(onClick ? { cursor: 'pointer' } : {})
      }}
    />
  );
};

export default Icone;
