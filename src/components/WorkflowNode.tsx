import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Settings, CircleDot } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  position: { x: number; y: number };
  type: 'service' | 'data';
  description?: string;
  settings?: Record<string, any>;
}

interface WorkflowNodeProps {
  node: Node;
  isSelected?: boolean;
  onSelect: (nodeId: string | null) => void;
  onDelete: (nodeId: string) => void;
  onUpdatePosition: (nodeId: string, position: { x: number; y: number }) => void;
  onOpenSettings: (nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onCompleteConnection: (nodeId: string) => void;
  isConnecting?: boolean;
}

export function WorkflowNode({
  node,
  isSelected,
  onSelect,
  onDelete,
  onUpdatePosition,
  onOpenSettings,
  onStartConnection,
  onCompleteConnection,
  isConnecting
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isHoveringInput, setIsHoveringInput] = useState(false);
  const [isHoveringOutput, setIsHoveringOutput] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  // Safety check for position
  if (!node || !node.position) {
    return null;
  }

  const { position } = node;

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.connection-point')) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onSelect(node.id);
    
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: Math.max(0, e.clientX - dragStart.x),
        y: Math.max(0, e.clientY - dragStart.y)
      };
      onUpdatePosition(node.id, newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleOutputMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStartConnection(node.id);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCompleteConnection(node.id);
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(node.id);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenSettings(node.id);
  };

  return (
    <div
      ref={nodeRef}
      className="absolute select-none"
      style={{ 
        left: position.x, 
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <Card 
        className={`w-60 p-4 transition-all duration-200 relative bg-card elevation-2 hover:elevation-3 rounded-2xl border-outline min-h-[120px] ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : ''
        } ${isDragging ? 'opacity-75 scale-105' : ''} ${isConnecting ? 'ring-2 ring-secondary' : ''}`}
        onClick={handleNodeClick}
      >
        {/* Input connection point */}
        <div
          className={`connection-point absolute w-4 h-4 rounded-full transition-all cursor-pointer flex items-center justify-center ${
            isHoveringInput 
              ? 'w-5 h-5 bg-primary border-2 border-primary-container' 
              : 'bg-surface border-2 border-outline'
          }`}
          style={{
            left: '-8px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
          onClick={handleInputClick}
          onMouseEnter={() => setIsHoveringInput(true)}
          onMouseLeave={() => setIsHoveringInput(false)}
          title="입력 연결"
        >
          {isHoveringInput && <CircleDot className="w-3 h-3 text-primary-foreground" />}
        </div>

        {/* Output connection point */}
        <div
          className={`connection-point absolute w-4 h-4 rounded-full transition-all cursor-pointer flex items-center justify-center ${
            isHoveringOutput 
              ? 'w-5 h-5 bg-primary border-2 border-primary-container' 
              : 'bg-primary border-2 border-primary'
          }`}
          style={{
            right: '-8px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
          onMouseDown={handleOutputMouseDown}
          onMouseEnter={() => setIsHoveringOutput(true)}
          onMouseLeave={() => setIsHoveringOutput(false)}
          title="출력 연결 - 드래그하여 연결"
        >
          <CircleDot className="w-3 h-3 text-primary-foreground" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-2xl ${node.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
              {node.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="title-small text-on-surface truncate">{node.name}</div>
              {node.description && (
                <div className="body-small text-on-surface-variant truncate">{node.description}</div>
              )}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-8 h-8 p-0 rounded-full hover:bg-primary-container"
              onClick={handleSettingsClick}
              title="노드 설정"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-8 h-8 p-0 rounded-full text-error hover:text-error hover:bg-error-container"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(node.id);
              }}
              title="노드 삭제"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="body-small text-on-surface-variant">
            실행 준비 완료
          </div>
          {Object.keys(node.settings || {}).length > 0 && (
            <div className="body-small text-primary">
              설정 완료
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}