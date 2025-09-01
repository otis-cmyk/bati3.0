import { useState } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { WorkflowHeader } from './components/WorkflowHeader';
import { NodePanel } from './components/NodePanel';
import { DataPanel } from './components/DataPanel';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodeSettingsPanel } from './components/NodeSettingsPanel';
import { DataAssetEditor } from './components/DataAssetEditor';
import { DashboardContent } from './components/DashboardContent';
import { AIWorkflowBuilder } from './components/AIWorkflowBuilder';
import { getServiceIcon, getDataIcon, getNodeTypeColor, getDataAssetColor } from './utils/icons';

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

interface Connection {
  id: string;
  from: string;
  to: string;
}

interface DataAsset {
  id: string;
  name: string;
  type: 'spreadsheet' | 'csv' | 'json' | 'database';
  size: string;
  lastModified: string;
  data: any[];
  columns: string[];
  color: string;
}

export default function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [settingsNodeId, setSettingsNodeId] = useState<string | null>(null);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'canvas'>('dashboard');
  const [showAIBuilder, setShowAIBuilder] = useState(false);
  
  // Workflow state
  const [workflowName, setWorkflowName] = useState('구글 스프레드시트 데이터 처리');
  const [workflowStatus, setWorkflowStatus] = useState<'active' | 'inactive' | 'scheduled'>('inactive');
  const [lastSaved, setLastSaved] = useState<string | undefined>('2분 전');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 스크롤을 위한 다양한 데이터 에셋 샘플
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([
    {
      id: 'asset-1',
      name: '매출_데이터.xlsx',
      type: 'spreadsheet',
      size: '2.4 MB',
      lastModified: '2시간 전',
      color: getDataAssetColor('spreadsheet'),
      columns: ['날짜', '제품명', '카테고리', '매출', '지역', '고객사'],
      data: [
        { '날짜': '2024-01-15', '제품명': 'iPhone 15', '카테고리': '전자기기', '매출': 1299, '지역': '북미', '고객사': '테크스토어' },
        { '날짜': '2024-01-16', '제품명': 'MacBook Pro', '카테고리': '전자기기', '매출': 2499, '지역': '유럽', '고객사': '디지털솔루션' },
        { '날짜': '2024-01-17', '제품명': 'AirPods Pro', '카테고리': '액세서리', '매출': 249, '지역': '아시아', '고객사': '사운드웨이브' },
        { '날짜': '2024-01-18', '제품명': 'iPad Air', '카테고리': '전자기기', '매출': 599, '지역': '북미', '고객사': '크리에이티브허브' },
        { '날짜': '2024-01-19', '제품명': 'Apple Watch', '카테고리': '웨어러블', '매출': 399, '지역': '유럽', '고객사': '피트니스퍼스트' },
        { '날짜': '2024-01-20', '제품명': 'iPhone 15 Pro', '카테고리': '전자기기', '매출': 1599, '지역': '아시아', '고객사': '모바일월드' },
        { '날짜': '2024-01-21', '제품명': 'Magic Keyboard', '카테고리': '액세서리', '매출': 179, '지역': '북미', '고객사': '오피스서플라이' },
        { '날짜': '2024-01-22', '제품명': 'Studio Display', '카테고리': '전자기기', '매출': 1599, '지역': '유럽', '고객사': '디자인스튜디오프로' }
      ]
    },
    {
      id: 'asset-2',
      name: '고객_피드백.csv',
      type: 'csv',
      size: '890 KB',
      lastModified: '1일 전',
      color: getDataAssetColor('csv'),
      columns: ['ID', '고객명', '평점', '리뷰', '날짜'],
      data: [
        { 'ID': 1, '고객명': '김민수', '평점': 5, '리뷰': '제품 품질이 매우 훌륭합니다', '날짜': '2024-01-20' },
        { 'ID': 2, '고객명': '이지영', '평점': 4, '리뷰': '가성비가 좋네요', '날짜': '2024-01-19' },
        { 'ID': 3, '고객명': '박준호', '평점': 3, '리뷰': '보통 수준입니다', '날짜': '2024-01-18' },
        { 'ID': 4, '고객명': '최서연', '평점': 5, '리뷰': '고객서비스가 뛰어났습니다', '날짜': '2024-01-17' }
      ]
    },
    {
      id: 'asset-3',
      name: '제품_재고.json',
      type: 'json',
      size: '1.2 MB',
      lastModified: '3시간 전',
      color: getDataAssetColor('json'),
      columns: ['제품코드', '제품명', '카테고리', '재고수량', '가격', '공급업체'],
      data: [
        { '제품코드': 'TECH001', '제품명': '무선 마우스', '카테고리': '액세서리', '재고수량': 150, '가격': 29990, '공급업체': '테크코프' },
        { '제품코드': 'TECH002', '제품명': 'USB-C 허브', '카테고리': '액세서리', '재고수량': 75, '가격': 49990, '공급업체': '커넥트프로' },
        { '제품코드': 'TECH003', '제품명': '노트북 스탠드', '카테고리': '액세서리', '재고수량': 200, '가격': 39990, '공급업체': '인체공학솔루션' }
      ]
    },
    {
      id: 'asset-4',
      name: '마케팅_캠페인.xlsx',
      type: 'spreadsheet',
      size: '4.1 MB',
      lastModified: '5시간 전',
      color: getDataAssetColor('spreadsheet'),
      columns: ['캠페인명', '예산', '노출수', '클릭수', '전환수'],
      data: [
        { '캠페인명': '여름 세일', '예산': 50000000, '노출수': 2500000, '클릭수': 125000, '전환수': 2500 },
        { '캠페인명': '블랙프라이데이', '예산': 100000000, '노출수': 5000000, '클릭수': 300000, '전환수': 12000 }
      ]
    },
    {
      id: 'asset-5',
      name: '사용자_분석.csv',
      type: 'csv',
      size: '3.7 MB',
      lastModified: '12시간 전',
      color: getDataAssetColor('csv'),
      columns: ['사용자ID', '세션시간', '방문페이지', '기기유형', '위치'],
      data: [
        { '사용자ID': 'U001', '세션시간': '00:15:30', '방문페이지': 8, '기기유형': '모바일', '위치': '서울' },
        { '사용자ID': 'U002', '세션시간': '00:22:45', '방문페이지': 12, '기기유형': '데스크톱', '위치': '부산' }
      ]
    },
    {
      id: 'asset-6',
      name: '재무_보고서.json',
      type: 'json',
      size: '2.8 MB',
      lastModified: '1일 전',
      color: getDataAssetColor('json'),
      columns: ['분기', '매출', '비용', '순이익', '성장률'],
      data: [
        { '분기': '2024년 1분기', '매출': 1200000000, '비용': 800000000, '순이익': 400000000, '성장률': '15%' },
        { '분기': '2024년 2분기', '매출': 1350000000, '비용': 850000000, '순이익': 500000000, '성장률': '12.5%' }
      ]
    },
    {
      id: 'asset-7',
      name: '직원_데이터.xlsx',
      type: 'spreadsheet',
      size: '1.9 MB',
      lastModified: '2일 전',
      color: getDataAssetColor('spreadsheet'),
      columns: ['직원번호', '이름', '부서', '연봉', '입사일'],
      data: [
        { '직원번호': 'EMP001', '이름': '김영희', '부서': '개발팀', '연봉': 85000000, '입사일': '2023-03-15' },
        { '직원번호': 'EMP002', '이름': '이철수', '부서': '마케팅팀', '연봉': 65000000, '입사일': '2023-05-20' }
      ]
    },
    {
      id: 'asset-8',
      name: '웹사이트_트래픽.csv',
      type: 'csv',
      size: '5.2 MB',
      lastModified: '6시간 전',
      color: getDataAssetColor('csv'),
      columns: ['날짜', '방문자수', '페이지뷰', '이탈률', '유입경로'],
      data: [
        { '날짜': '2024-01-20', '방문자수': 12500, '페이지뷰': 35000, '이탈률': '35%', '유입경로': '검색엔진' },
        { '날짜': '2024-01-21', '방문자수': 13200, '페이지뷰': 38500, '이탈률': '32%', '유입경로': '직접 방문' }
      ]
    },
    {
      id: 'asset-9',
      name: '공급망_관리.json',
      type: 'json',
      size: '3.4 MB',
      lastModified: '4시간 전',
      color: getDataAssetColor('json'),
      columns: ['공급업체', '제품', '배송기간', '비용', '품질평점'],
      data: [
        { '공급업체': '글로벌부품', '제품': '회로기판', '배송기간': '7일', '비용': 450000, '품질평점': 4.8 },
        { '공급업체': '테크컴포넌트', '제품': '메모리 모듈', '배송기간': '5일', '비용': 120000, '품질평점': 4.9 }
      ]
    },
    {
      id: 'asset-10',
      name: '소셜미디어_지표.xlsx',
      type: 'spreadsheet',
      size: '2.1 MB',
      lastModified: '8시간 전',
      color: getDataAssetColor('spreadsheet'),
      columns: ['플랫폼', '팔로워수', '참여율', '도달수', '게시물수'],
      data: [
        { '플랫폼': '인스타그램', '팔로워수': 45000, '참여율': '3.2%', '도달수': 125000, '게시물수': 28 },
        { '플랫폼': '트위터', '팔로워수': 32000, '참여율': '2.8%', '도달수': 89000, '게시물수': 45 }
      ]
    }
  ]);

  const addNode = (data: any, position?: { x: number; y: number }) => {
    const autoPosition = position || {
      x: 100 + (nodes.length % 5) * 250,
      y: 100 + Math.floor(nodes.length / 5) * 200
    };

    // Use main color system
    const icon = data.type === 'service' 
      ? getServiceIcon(data.icon || data.iconType) 
      : getDataIcon(data.icon || data.type || data.fileType);

    // Use main color system
    const color = data.color || getNodeTypeColor(data.type, data.category || data.type);

    const newNode: Node = {
      id: `node-${Date.now()}`,
      name: data.name,
      icon: icon,
      color: color,
      type: data.type,
      position: autoPosition,
      settings: {}
    };

    if (data.type === 'data') {
      newNode.fileSize = data.size;
      newNode.fileType = data.type;
      newNode.lastModified = data.lastModified;
      newNode.description = `데이터 소스: ${data.name}`;
    } else {
      newNode.description = data.description || `${data.name} 서비스 연동`;
    }
    
    setNodes(prev => [...prev, newNode]);
    setHasUnsavedChanges(true);
  };

  const updateNodePosition = (nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position } : node
    ));
    setHasUnsavedChanges(true);
  };

  const updateNodeSettings = (nodeId: string, settings: Record<string, any>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, settings: { ...node.settings, ...settings } } : node
    ));
    setHasUnsavedChanges(true);
  };

  const updateConnections = (newConnections: Connection[]) => {
    setConnections(newConnections);
    setHasUnsavedChanges(true);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => conn.from !== nodeId && conn.to !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    if (settingsNodeId === nodeId) {
      setSettingsNodeId(null);
    }
    setHasUnsavedChanges(true);
  };

  const openNodeSettings = (nodeId: string) => {
    // Close data asset editor when opening node settings
    if (editingAssetId) {
      setEditingAssetId(null);
    }
    setSettingsNodeId(nodeId);
    setSelectedNodeId(nodeId);
  };

  const closeNodeSettings = () => {
    setSettingsNodeId(null);
  };

  const openDataAssetEditor = (assetId: string) => {
    // Close node settings when opening data asset editor
    if (settingsNodeId) {
      setSettingsNodeId(null);
    }
    setEditingAssetId(assetId);
  };

  const closeDataAssetEditor = () => {
    setEditingAssetId(null);
  };

  const updateDataAsset = (assetId: string, updatedAsset: Partial<DataAsset>) => {
    setDataAssets(prev => prev.map(asset => 
      asset.id === assetId ? { ...asset, ...updatedAsset, lastModified: '방금 전' } : asset
    ));
  };

  // Workflow action handlers
  const handleSaveWorkflow = () => {
    setHasUnsavedChanges(false);
    setLastSaved('방금 전');
    console.log('워크플로 저장됨');
  };

  const handleRunWorkflow = () => {
    setWorkflowStatus('active');
    console.log('워크플로 실행 시작');
    // 실제 실행 로직은 나중에 구현
  };

  const handleShareWorkflow = () => {
    console.log('워크플로 공유');
    // 공유 다이얼로그 열기
  };

  const handleScheduleWorkflow = () => {
    console.log('스케쥴링 설정');
    // 스케쥴 설정 다이얼로그 열기
  };

  const handleWebhookSettings = () => {
    console.log('웹훅 설정');
    // 웹훅 설정 다이얼로그 열기
  };

  // AI 워크플로 생성 핸들러
  const handleAIWorkflowGenerated = (steps: any[]) => {
    // 기존 노드와 연결 초기화
    setNodes([]);
    setConnections([]);

    const newNodes: Node[] = [];
    const newConnections: Connection[] = [];

    // 각 단계를 노드로 변환
    steps.forEach((step, index) => {
      const position = {
        x: 100 + index * 280,
        y: 100
      };

      const newNode: Node = {
        id: `ai-node-${Date.now()}-${index}`,
        name: step.name,
        icon: step.icon,
        color: step.color,
        type: step.type,
        position: position,
        settings: step.settings || {},
        description: step.description
      };

      newNodes.push(newNode);

      // 이전 노드와 연결
      if (index > 0) {
        newConnections.push({
          id: `ai-connection-${index}`,
          from: newNodes[index - 1].id,
          to: newNode.id
        });
      }
    });

    setNodes(newNodes);
    setConnections(newConnections);
    setCurrentView('canvas');
    setHasUnsavedChanges(true);
    
    // 워크플로 이름 업데이트
    setWorkflowName('AI 생성 워크플로');
  };

  const settingsNode = settingsNodeId ? nodes.find(node => node.id === settingsNodeId) : null;
  const editingAsset = editingAssetId ? dataAssets.find(asset => asset.id === editingAssetId) : null;

  return (
    <div className="h-screen flex bg-background">
      {/* Navigation Bar */}
      <NavigationBar 
        isCollapsed={navCollapsed} 
        onToggle={() => setNavCollapsed(!navCollapsed)}
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view as 'dashboard' | 'canvas')}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkflowHeader 
          currentView={currentView}
          workflowName={currentView === 'canvas' ? workflowName : '대시보드'}
          lastSaved={currentView === 'canvas' ? lastSaved : undefined}
          status={currentView === 'canvas' ? workflowStatus : undefined}
          onSave={handleSaveWorkflow}
          onRun={handleRunWorkflow}
          onShare={handleShareWorkflow}
          onSchedule={handleScheduleWorkflow}
          onWebhook={handleWebhookSettings}
          onAICreate={() => setShowAIBuilder(true)}
        />
        {currentView === 'dashboard' ? (
          <DashboardContent />
        ) : (
          <div className="flex flex-1 overflow-hidden relative">
            {/* Left Panels */}
            <NodePanel onAddNode={addNode} />
            <DataPanel 
              onAddNode={addNode} 
              dataAssets={dataAssets}
              onEditAsset={openDataAssetEditor}
            />
            
            {/* Main Canvas */}
            <WorkflowCanvas 
              nodes={nodes}
              connections={connections}
              selectedNodeId={selectedNodeId}
              onAddNode={addNode}
              onUpdateNodePosition={updateNodePosition}
              onSelectNode={setSelectedNodeId}
              onDeleteNode={deleteNode}
              onUpdateConnections={updateConnections}
              onOpenSettings={openNodeSettings}
            />

            {/* Node Settings Panel - Full Screen Modal */}
            {settingsNode && (
              <NodeSettingsPanel
                node={settingsNode}
                isOpen={!!settingsNodeId}
                onClose={closeNodeSettings}
                onUpdateSettings={(settings) => updateNodeSettings(settingsNodeId!, settings)}
                dataAssets={dataAssets}
              />
            )}

            {/* Data Asset Editor - Full Screen Modal */}
            {editingAsset && (
              <DataAssetEditor
                asset={editingAsset}
                isOpen={!!editingAssetId}
                onClose={closeDataAssetEditor}
                onUpdateAsset={(updatedAsset) => updateDataAsset(editingAssetId!, updatedAsset)}
              />
            )}

            {/* AI Workflow Builder */}
            <AIWorkflowBuilder
              isOpen={showAIBuilder}
              onClose={() => setShowAIBuilder(false)}
              onWorkflowGenerated={handleAIWorkflowGenerated}
            />
          </div>
        )}
      </div>
    </div>
  );
}