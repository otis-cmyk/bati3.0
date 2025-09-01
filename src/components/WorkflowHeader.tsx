import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  HelpCircle, 
  MessageCircle, 
  Calendar,
  Webhook,
  Save,
  Play,
  Share2,
  Clock,
  Users,
  CheckCircle,
  Bot,
  Sparkles
} from 'lucide-react';

interface WorkflowHeaderProps {
  currentView?: 'dashboard' | 'canvas';
  workflowName?: string;
  lastSaved?: string;
  status?: 'active' | 'inactive' | 'scheduled';
  onSave?: () => void;
  onRun?: () => void;
  onShare?: () => void;
  onSchedule?: () => void;
  onWebhook?: () => void;
  onAICreate?: () => void;
}

export function WorkflowHeader({ 
  currentView = 'dashboard',
  workflowName = '대시보드',
  lastSaved,
  status = 'inactive',
  onSave,
  onRun,
  onShare,
  onSchedule,
  onWebhook,
  onAICreate
}: WorkflowHeaderProps) {
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    setHasChanges(false);
    onSave?.();
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300 rounded-full px-2 py-0.5">
            <CheckCircle className="w-3 h-3 mr-1" />
            실행 중
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300 rounded-full px-2 py-0.5">
            <Clock className="w-3 h-3 mr-1" />
            예약됨
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="rounded-full px-2 py-0.5">
            비활성
          </Badge>
        );
    }
  };

  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="title-large text-foreground">{workflowName}</h1>
          {currentView === 'canvas' && (
            <div className="flex items-center gap-2 mt-0.5">
              {getStatusBadge()}
              {lastSaved && (
                <span className="body-small text-muted-foreground">
                  마지막 저장: {lastSaved}
                </span>
              )}
              {hasChanges && (
                <span className="body-small text-primary">
                  저장되지 않은 변경사항
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* AI Workflow Builder - Always visible */}
        <Button 
          onClick={onAICreate}
          className="rounded-xl px-4 h-9 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI 워크플로
        </Button>

        {currentView === 'canvas' && (
          <>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Workflow Controls */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSchedule}
                className="rounded-xl px-3 h-9 border-border hover:bg-muted"
              >
                <Calendar className="w-4 h-4 mr-2" />
                스케쥴링 설정
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onWebhook}
                className="rounded-xl px-3 h-9 border-border hover:bg-muted"
              >
                <Webhook className="w-4 h-4 mr-2" />
                웹훅 설정
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={!hasChanges}
                className="rounded-xl px-3 h-9 border-border hover:bg-muted disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              
              <Button 
                size="sm" 
                onClick={onRun}
                className="rounded-xl px-4 h-9 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Play className="w-4 h-4 mr-2" />
                실행하기
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onShare}
                className="rounded-xl px-3 h-9 border-border hover:bg-muted"
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
            </div>
          </>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Help & Support */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-lg px-3 h-8 text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            가이드
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-lg px-3 h-8 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            문의
          </Button>
        </div>
      </div>
    </header>
  );
}