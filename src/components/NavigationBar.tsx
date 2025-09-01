import React, { useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Menu, 
  Plus, 
  List, 
  FileText, 
  Calendar, 
  Zap, 
  Users, 
  Upload,
  HelpCircle,
  Settings,
  User
} from 'lucide-react';

interface NavigationBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
}

export function NavigationBar({ isCollapsed, onToggle, currentView = 'dashboard', onViewChange }: NavigationBarProps) {
  const [activeItem, setActiveItem] = useState(currentView);

  const mainNavItems = [
    { id: 'canvas', icon: Plus, label: '캔버스' },
    { id: 'dashboard', icon: List, label: '워크플로' },
    { id: 'templates', icon: FileText, label: '템플릿' },
    { id: 'schedules', icon: Calendar, label: '스케줄' },
    { id: 'automations', icon: Zap, label: '자동화' },
    { id: 'team', icon: Users, label: '팀' },
    { id: 'import', icon: Upload, label: '가져오기' },
  ];

  const bottomNavItems = [
    { id: 'help', icon: HelpCircle, label: '도움말' },
    { id: 'settings', icon: Settings, label: '설정' },
    { id: 'profile', icon: User, label: '프로필' },
  ];

  const NavButton = ({ item, isBottom = false }: { item: any; isBottom?: boolean }) => {
    const isActive = activeItem === item.id;
    const Icon = item.icon;
    
    const buttonElement = (
      <Button
        variant="ghost"
        size="sm"
        className={`w-11 h-11 p-0 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-white/20 text-white shadow-sm' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
        onClick={() => {
          setActiveItem(item.id);
          if (onViewChange) {
            onViewChange(item.id);
          }
        }}
      >
        <Icon className="w-4 h-4" />
      </Button>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonElement}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-background text-foreground border border-border">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonElement;
  };

  return (
    <div 
      className={`h-full bg-primary flex flex-col border-r border-black/10 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-16'
      }`}
    >
      {/* Header */}
      <div className="border-b border-white/10 flex items-center justify-center p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-7 h-7 p-0 rounded-lg bg-white/20 text-white hover:bg-white/30"
          onClick={onToggle}
        >
          <Menu className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col items-center py-3.5 space-y-1">
        {mainNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 flex flex-col items-center py-3.5 space-y-1">
        {bottomNavItems.map((item) => (
          <NavButton key={item.id} item={item} isBottom />
        ))}
      </div>
    </div>
  );
}