import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Save, RotateCcw, ExternalLink, Key, Database, Settings2, HelpCircle, FileText, Zap, AlertCircle, Play, X, ChevronDown, FileSpreadsheet, Download, Eye, Info, ChevronRight, ChevronLeft, Bot, CheckCircle, Clock, Lightbulb, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  position: { x: number; y: number };
  type: 'service' | 'data';
  description?: string;
  fileSize?: string;
  fileType?: string;
  lastModified?: string;
  settings?: Record<string, any>;
}

interface DataAsset {
  id: string;
  name: string;
  type: 'spreadsheet' | 'csv' | 'json' | 'database';
  size: string;
  lastModified: string;
  data: any[];
  columns: string[];
}

interface NodeSettingsPanelProps {
  node: Node;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (settings: Record<string, any>) => void;
  dataAssets: DataAsset[];
}

// AI 보조 시스템 관련 인터페이스
interface AIRecommendation {
  id: string;
  field: string;
  value: any;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  requiresConfirmation: boolean;
}

export function NodeSettingsPanel({ node, isOpen, onClose, onUpdateSettings, dataAssets }: NodeSettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(node.settings || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('parameters');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(dataAssets[0]?.id || null);
  const [tableContainerWidth, setTableContainerWidth] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<number>(3);
  const [columnStartIndex, setColumnStartIndex] = useState(0);
  
  // AI 보조 시스템 state
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [confirmedRecommendations, setConfirmedRecommendations] = useState<string[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(true);
  
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // AI 추천값 초기화
  useEffect(() => {
    // 노드 타입에 따른 AI 추천값 생성
    const generateAIRecommendations = () => {
      const recommendations: AIRecommendation[] = [];
      
      if (node.name.includes('HTTP') || node.name.includes('요청')) {
        // HTTP 노드에 대한 AI 추천
        recommendations.push(
          {
            id: 'url-rec',
            field: 'url',
            value: 'https://api.example.com/webhook',
            reason: '일반적인 웹훅 엔드포인트 패턴을 기반으로 추천했습니다',
            confidence: 'medium',
            requiresConfirmation: true
          },
          {
            id: 'method-rec',
            field: 'method',
            value: 'POST',
            reason: '데이터 전송에 가장 적합한 메서드입니다',
            confidence: 'high',
            requiresConfirmation: false
          },
          {
            id: 'headers-rec',
            field: 'headers',
            value: { 'Content-Type': 'application/json' },
            reason: 'JSON 데이터 전송을 위한 표준 헤더입니다',
            confidence: 'high',
            requiresConfirmation: false
          }
        );
      }
      
      if (node.name.includes('Slack') || node.name.includes('슬랙')) {
        recommendations.push(
          {
            id: 'channel-rec',
            field: 'channel',
            value: '#notifications',
            reason: '알림용 채널로 일반적으로 사용되는 이름입니다',
            confidence: 'medium',
            requiresConfirmation: true
          },
          {
            id: 'message-rec',
            field: 'message',
            value: '새로운 데이터가 처리되었습니다: {{제품명}} - {{매출}}원',
            reason: '선택된 데이터셋의 주요 필드를 활용한 메시지 템플릿입니다',
            confidence: 'high',
            requiresConfirmation: false
          }
        );
      }

      return recommendations;
    };

    const recommendations = generateAIRecommendations();
    setAiRecommendations(recommendations);
    
    // 자동 설정값 적용 (확인 불필요한 것들)
    const autoSettings = {};
    recommendations.forEach(rec => {
      if (!rec.requiresConfirmation) {
        autoSettings[rec.field] = rec.value;
      }
    });
    
    setLocalSettings(prev => ({ ...prev, ...autoSettings }));
  }, [node.name, selectedAssetId]);

  useEffect(() => {
    setLocalSettings(node.settings || {});
    setHasChanges(false);
  }, [node.settings, node.id]);

  useEffect(() => {
    const updateTableSize = () => {
      if (tableContainerRef.current) {
        const width = tableContainerRef.current.offsetWidth;
        setTableContainerWidth(width);
        
        const minColumnWidth = 140;
        const maxVisibleColumns = Math.floor(width / minColumnWidth) || 1;
        setVisibleColumns(Math.max(1, maxVisibleColumns));
        
        setColumnStartIndex(0);
      }
    };

    updateTableSize();

    const resizeObserver = new ResizeObserver(updateTableSize);
    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    window.addEventListener('resize', updateTableSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateTableSize);
    };
  }, [isOpen]);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(node.settings || {});
    setHasChanges(false);
  };

  const handlePrevColumns = () => {
    const selectedAsset = selectedAssetId ? dataAssets.find(asset => asset.id === selectedAssetId) : null;
    if (selectedAsset) {
      setColumnStartIndex(Math.max(0, columnStartIndex - visibleColumns));
    }
  };

  const handleNextColumns = () => {
    const selectedAsset = selectedAssetId ? dataAssets.find(asset => asset.id === selectedAssetId) : null;
    if (selectedAsset) {
      const maxStartIndex = Math.max(0, selectedAsset.columns.length - visibleColumns);
      setColumnStartIndex(Math.min(maxStartIndex, columnStartIndex + visibleColumns));
    }
  };

  const handleConfirmRecommendation = (recId: string, accept: boolean) => {
    const recommendation = aiRecommendations.find(r => r.id === recId);
    if (!recommendation) return;

    if (accept) {
      handleSettingChange(recommendation.field, recommendation.value);
      setConfirmedRecommendations(prev => [...prev, recId]);
    } else {
      // 거부된 추천은 목록에서 제거
      setAiRecommendations(prev => prev.filter(r => r.id !== recId));
    }
  };

  if (!isOpen) return null;

  const selectedAsset = selectedAssetId ? dataAssets.find(asset => asset.id === selectedAssetId) : null;
  
  const getVisibleColumnData = () => {
    if (!selectedAsset) return { columns: [], canPrev: false, canNext: false };
    
    const columns = selectedAsset.columns.slice(columnStartIndex, columnStartIndex + visibleColumns);
    const canPrev = columnStartIndex > 0;
    const canNext = columnStartIndex + visibleColumns < selectedAsset.columns.length;
    
    return { columns, canPrev, canNext };
  };

  const { columns: displayColumns, canPrev, canNext } = getVisibleColumnData();

  const renderInputPanel = () => (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="title-medium text-foreground">입력 데이터</h3>
              <p className="body-small text-muted-foreground">데이터 소스 설정</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10">
            <Play className="w-4 h-4 text-primary" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Data Asset Selector */}
          <div className="space-y-3">
            <Label className="title-small text-foreground">데이터 소스</Label>
            <Select value={selectedAssetId || ''} onValueChange={setSelectedAssetId}>
              <SelectTrigger className="w-full h-12 rounded-xl border-border bg-background shadow-sm hover:bg-muted/50 transition-colors">
                <SelectValue placeholder="데이터 에셋을 선택하세요" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {dataAssets.map(asset => (
                  <SelectItem key={asset.id} value={asset.id} className="rounded-lg p-3">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="body-medium text-foreground">{asset.name}</span>
                        <span className="body-small text-muted-foreground">{asset.size}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Asset Info Card */}
          {selectedAsset && (
            <Card className="bg-background border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="title-medium text-foreground">{selectedAsset.name}</CardTitle>
                      <CardDescription className="body-small">{selectedAsset.type.toUpperCase()}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10">
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="body-small text-muted-foreground">크기</div>
                    <div className="body-medium text-foreground">{selectedAsset.size}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="body-small text-muted-foreground">수정됨</div>
                    <div className="body-medium text-foreground">{selectedAsset.lastModified}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="body-small text-muted-foreground">행</div>
                    <div className="body-medium text-foreground">{selectedAsset.data.length}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="body-small text-muted-foreground">열</div>
                    <div className="body-medium text-foreground">{selectedAsset.columns.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Preview */}
          {selectedAsset && (
            <Card className="bg-background border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="title-medium text-foreground">데이터 미리보기</CardTitle>
                    <CardDescription className="body-small">
                      상위 5개 행 • {selectedAsset.columns.length}개 열 중 {displayColumns.length}개 표시
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-primary/20">
                      {selectedAsset.columns.length}개 열
                    </Badge>
                    {selectedAsset.columns.length > visibleColumns && (
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handlePrevColumns}
                          disabled={!canPrev}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleNextColumns}
                          disabled={!canNext}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={tableContainerRef}
                  className="border border-border rounded-lg bg-background overflow-hidden"
                >
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent">
                          {displayColumns.map((column, index) => (
                            <TableHead 
                              key={columnStartIndex + index}
                              className="body-small text-muted-foreground font-medium px-3 py-3 border-r border-border/30 last:border-r-0"
                              style={{ 
                                width: `${100 / displayColumns.length}%`,
                                minWidth: '100px'
                              }}
                            >
                              <div className="truncate" title={column}>
                                {column}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAsset.data.slice(0, 5).map((row, rowIndex) => (
                          <TableRow key={rowIndex} className="hover:bg-muted/30 border-b border-border/50 last:border-b-0">
                            {displayColumns.map((column, colIndex) => (
                              <TableCell 
                                key={columnStartIndex + colIndex}
                                className="body-small text-foreground px-3 py-3 border-r border-border/20 last:border-r-0"
                                style={{ 
                                  width: `${100 / displayColumns.length}%`,
                                  minWidth: '100px'
                                }}
                                title={String(row[column])}
                              >
                                <div className="truncate">
                                  {String(row[column])}
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-muted-foreground">
                  <div className="body-small">
                    {selectedAsset.data.length}개 행 중 {Math.min(5, selectedAsset.data.length)}개 표시
                  </div>
                  <div className="body-small flex items-center gap-2">
                    {selectedAsset.columns.length > visibleColumns ? (
                      <span>
                        {selectedAsset.columns.length}개 열 중 {columnStartIndex + 1}-{Math.min(columnStartIndex + visibleColumns, selectedAsset.columns.length)}번째
                      </span>
                    ) : (
                      <span>모든 {selectedAsset.columns.length}개 열 표시</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              <div className="body-small text-foreground font-medium">데이터 플로우</div>
              <div className="body-small text-muted-foreground leading-relaxed">
                이 노드가 실행되면 선택된 데이터셋의 각 행을 개별적으로 처리합니다.
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  const renderMainPanel = () => (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border bg-background/95 backdrop-blur-sm min-w-0">
        <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-2 lg:px-3 h-10 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:inline">캔버스로 돌아가기</span>
          </Button>
          <Separator orientation="vertical" className="h-6 hidden lg:block" />
          <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl ${node.color} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
              {node.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="title-medium lg:title-large text-foreground truncate">{node.name}</h1>
              <p className="body-small text-muted-foreground hidden lg:block">노드 설정 구성</p>
            </div>
            <Badge 
              variant={hasChanges ? "default" : "secondary"} 
              className={`rounded-full px-2 lg:px-3 py-1 flex-shrink-0 ${hasChanges ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {hasChanges ? "수정됨" : "저장됨"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          <Button
            variant={showAIPanel ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="rounded-xl px-2 lg:px-4 h-10"
          >
            <Bot className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:inline">AI 도우미</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset} 
            disabled={!hasChanges}
            className="rounded-xl px-2 lg:px-4 h-10 border-border hover:bg-muted disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:inline">재설정</span>
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="rounded-xl px-2 lg:px-4 h-10 disabled:opacity-50 bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:inline">저장</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 lg:h-14 w-full justify-start rounded-none bg-transparent border-0 p-0 px-4 lg:px-6">
            <TabsTrigger 
              value="parameters" 
              className={`rounded-lg border-0 h-8 lg:h-10 px-3 lg:px-4 title-small transition-all
                data-[state=active]:bg-primary/10 data-[state=active]:text-primary
                hover:bg-muted hover:text-foreground`}
            >
              매개변수
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className={`rounded-lg border-0 h-8 lg:h-10 px-3 lg:px-4 title-small transition-all
                data-[state=active]:bg-primary/10 data-[state=active]:text-primary
                hover:bg-muted hover:text-foreground`}
            >
              설정
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 lg:p-6 w-full min-w-0">
          <Tabs value={activeTab}>
            <TabsContent value="parameters" className="mt-0">
              {renderParametersContent()}
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              {renderSettingsContent()}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );

  // AI 보조 패널 렌더링
  const renderAIPanel = () => (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="title-small text-foreground">AI 도우미</h3>
              <p className="body-small text-muted-foreground">자동 설정 및 추천</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-lg" 
            onClick={() => setShowAIPanel(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* 자동 설정 완료 */}
          {aiRecommendations.filter(rec => !rec.requiresConfirmation).length > 0 && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="body-small font-medium text-green-800">자동 설정 완료</span>
              </div>
              <div className="space-y-1">
                {aiRecommendations
                  .filter(rec => !rec.requiresConfirmation)
                  .map(rec => (
                  <div key={rec.id} className="body-small text-green-700">
                    • {rec.field === 'method' ? 'HTTP 메서드' : 
                       rec.field === 'headers' ? '요청 헤더' :
                       rec.field === 'message' ? '메시지 템플릿' : rec.field} 설정됨
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 확인 필요한 항목 */}
          {aiRecommendations
            .filter(rec => rec.requiresConfirmation && !confirmedRecommendations.includes(rec.id))
            .map(rec => (
            <div key={rec.id} className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-orange-600" />
                <span className="body-small font-medium text-orange-800">확인 필요</span>
              </div>
              <div className="space-y-2">
                <div className="body-small text-orange-800">
                  {rec.field === 'url' ? 'API URL' :
                   rec.field === 'channel' ? 'Slack 채널' : rec.field}: 
                  <span className="font-mono ml-1">{String(rec.value)}</span>
                </div>
                <div className="body-small text-orange-700">{rec.reason}</div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleConfirmRecommendation(rec.id, true)}
                    className="h-7 px-3 text-xs"
                  >
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    확인
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleConfirmRecommendation(rec.id, false)}
                    className="h-7 px-3 text-xs"
                  >
                    <ThumbsDown className="w-3 h-3 mr-1" />
                    수정
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* 실행 미리보기 */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-4 h-4 text-blue-600" />
              <span className="body-small font-medium text-blue-800">실행 미리보기</span>
            </div>
            <div className="space-y-1">
              {node.name.includes('Slack') && (
                <div className="body-small text-blue-700">
                  📢 #{localSettings.channel || 'notifications'} 채널로 알림 전송
                </div>
              )}
              {node.name.includes('HTTP') && (
                <div className="body-small text-blue-700">
                  🌐 {localSettings.method || 'POST'} 요청 전송
                </div>
              )}
              <div className="body-small text-blue-600">
                • {selectedAsset?.data.length || 0}개 행 순차 처리
              </div>
            </div>
          </div>

          {/* 도움말 */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="body-small text-foreground font-medium">최소 개입 모드</div>
                <div className="body-small text-muted-foreground">
                  AI가 자동으로 설정을 구성했습니다. 확인이 필요한 항목만 검토해주세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  const renderParametersContent = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Basic Configuration */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="title-medium text-foreground">기본 구성</CardTitle>
          <CardDescription>HTTP 요청 메서드 및 엔드포인트 설정</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex items-center gap-2">
              <Label className="title-small text-foreground lg:min-w-[80px]">메서드</Label>
              {localSettings.method && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-1.5 py-0.5 text-xs">
                  <Bot className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
            <div className="flex-1 lg:max-w-[160px]">
              <Select
                value={localSettings.method || 'GET'}
                onValueChange={(value) => handleSettingChange('method', value)}
              >
                <SelectTrigger className="w-full h-12 rounded-xl border-border bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="GET" className="rounded-lg">GET</SelectItem>
                  <SelectItem value="POST" className="rounded-lg">POST</SelectItem>
                  <SelectItem value="PUT" className="rounded-lg">PUT</SelectItem>
                  <SelectItem value="DELETE" className="rounded-lg">DELETE</SelectItem>
                  <SelectItem value="PATCH" className="rounded-lg">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-6">
            <Label className="title-small text-foreground lg:min-w-[80px] lg:mt-3">URL</Label>
            <div className="flex-1 space-y-2">
              <Input
                placeholder="https://api.example.com/endpoint"
                value={localSettings.url || ''}
                onChange={(e) => handleSettingChange('url', e.target.value)}
                className="h-12 rounded-xl border-border"
              />
              {aiRecommendations.some(r => r.field === 'url' && r.requiresConfirmation) && (
                <div className="text-orange-600 body-small">
                  ⚠️ AI가 추천한 URL입니다. 실제 엔드포인트로 수정해주세요.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Headers Configuration */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="title-medium text-foreground">헤더</CardTitle>
          <CardDescription>요청 헤더 설정</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="title-small text-foreground">Content-Type</Label>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-1.5 py-0.5 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                자동 설정
              </Badge>
            </div>
            <Input
              value="application/json"
              disabled
              className="h-12 rounded-xl border-border bg-muted"
            />
          </div>

          <div className="space-y-3">
            <Label className="title-small text-foreground">Authorization</Label>
            <Input
              placeholder="Bearer your-token-here"
              value={localSettings.authorization || ''}
              onChange={(e) => handleSettingChange('authorization', e.target.value)}
              className="h-12 rounded-xl border-border"
            />
            <div className="text-muted-foreground body-small">
              💡 보안을 위해 실제 API 키는 환경변수를 사용하세요
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Template */}
      {node.name.includes('Slack') && (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="title-medium text-foreground">메시지 설정</CardTitle>
            <CardDescription>Slack 메시지 템플릿</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="title-small text-foreground">채널</Label>
                {aiRecommendations.some(r => r.field === 'channel') && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-1.5 py-0.5 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    확인 필요
                  </Badge>
                )}
              </div>
              <Input
                placeholder="#notifications"
                value={localSettings.channel || ''}
                onChange={(e) => handleSettingChange('channel', e.target.value)}
                className="h-12 rounded-xl border-border"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="title-small text-foreground">메시지 템플릿</Label>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-1.5 py-0.5 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  AI 생성
                </Badge>
              </div>
              <Textarea
                placeholder="메시지 내용을 입력하세요"
                value={localSettings.message || ''}
                onChange={(e) => handleSettingChange('message', e.target.value)}
                className="min-h-[100px] rounded-xl border-border"
              />
              <div className="text-muted-foreground body-small">
                💡 {{제품명}}, {{매출}} 같은 형식으로 데이터 필드를 참조할 수 있습니다
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSettingsContent = () => (
    <div className="space-y-6 lg:space-y-8">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="title-medium text-foreground">고급 설정</CardTitle>
          <CardDescription>타임아웃, 재시도 등 추가 옵션</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <Label className="title-small text-foreground lg:min-w-[120px]">요청 타임아웃</Label>
            <div className="flex-1 lg:max-w-[200px]">
              <Input
                placeholder="30000"
                value={localSettings.timeout || ''}
                onChange={(e) => handleSettingChange('timeout', e.target.value)}
                className="h-12 rounded-xl border-border"
              />
            </div>
            <div className="body-small text-muted-foreground">밀리초 (기본값: 30000)</div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <Label className="title-small text-foreground lg:min-w-[120px]">재시도 활성화</Label>
            <Switch
              checked={localSettings.retry || false}
              onCheckedChange={(checked) => handleSettingChange('retry', checked)}
            />
          </div>

          {localSettings.retry && (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <Label className="title-small text-foreground lg:min-w-[120px]">재시도 횟수</Label>
              <div className="flex-1 lg:max-w-[200px]">
                <Input
                  placeholder="3"
                  value={localSettings.retryCount || ''}
                  onChange={(e) => handleSettingChange('retryCount', e.target.value)}
                  className="h-12 rounded-xl border-border"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Input Data Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          {renderInputPanel()}
        </ResizablePanel>
        
        <ResizableHandle className="w-px bg-border hover:bg-primary/50 transition-colors" />
        
        {/* Main Settings Panel */}
        <ResizablePanel defaultSize={showAIPanel ? 50 : 75} minSize={40}>
          {renderMainPanel()}
        </ResizablePanel>
        
        {/* AI Assistant Panel */}
        {showAIPanel && (
          <>
            <ResizableHandle className="w-px bg-border hover:bg-primary/50 transition-colors" />
            <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
              {renderAIPanel()}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}