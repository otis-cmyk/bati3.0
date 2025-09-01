import React, { useState, useRef, useCallback } from 'react';
import { WorkflowNode } from './WorkflowNode';
import { DataNode } from './DataNode';
import { ConnectionLine } from './ConnectionLine';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, Maximize2, Grid, Play } from 'lucide-react';

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

interface WorkflowCanvasProps {
  nodes: Node[];
  connections: Connection[];
  selectedNodeId: string | null;
  onAddNode: (data: any, position?: { x: number; y: number }) => void;
  onUpdateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  onSelectNode: (nodeId: string | null) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateConnections: (connections: Connection[]) => void;
  onOpenSettings: (nodeId: string) => void;
}

export function WorkflowCanvas({
  nodes,
  connections,
  selectedNodeId,
  onAddNode,
  onUpdateNodePosition,
  onSelectNode,
  onDeleteNode,
  onUpdateConnections,
  onOpenSettings
}: WorkflowCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<{ from: string; to?: string } | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Node dimensions (matching the actual node sizes)
  const NODE_WIDTH = 240; // w-60 = 240px
  const NODE_HEIGHT = 120; // min-h-[120px] for service nodes, min-h-[130px] for data nodes
  const CONNECTION_POINT_OFFSET = 8; // connection points are 8px outside the node

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      onAddNode(data, { x, y });
    }
  }, [onAddNode, pan, zoom]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === svgRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectNode(null);
    }
  }, [pan, onSelectNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleFitToScreen = () => {
    if (nodes.length === 0) return;
    
    const minX = Math.min(...nodes.map(n => n.position.x));
    const maxX = Math.max(...nodes.map(n => n.position.x));
    const minY = Math.min(...nodes.map(n => n.position.y));
    const maxY = Math.max(...nodes.map(n => n.position.y));
    
    const width = maxX - minX + NODE_WIDTH + 100;
    const height = maxY - minY + NODE_HEIGHT + 100;
    const canvasWidth = canvasRef.current?.clientWidth || 800;
    const canvasHeight = canvasRef.current?.clientHeight || 600;
    
    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;
    const newZoom = Math.min(scaleX, scaleY, 1);
    
    setZoom(newZoom);
    setPan({
      x: (canvasWidth - width * newZoom) / 2 - minX * newZoom + 50 * newZoom,
      y: (canvasHeight - height * newZoom) / 2 - minY * newZoom + 50 * newZoom
    });
  };

  const handleStartConnection = (nodeId: string) => {
    setConnecting({ from: nodeId });
  };

  const handleCompleteConnection = (nodeId: string) => {
    if (connecting && connecting.from !== nodeId) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        from: connecting.from,
        to: nodeId
      };
      onUpdateConnections([...connections, newConnection]);
    }
    setConnecting(null);
  };

  const handleDeleteConnection = (connectionId: string) => {
    onUpdateConnections(connections.filter(conn => conn.id !== connectionId));
  };

  // Calculate connection points for nodes
  const getConnectionPoints = (node: Node) => {
    const nodeHeight = node.type === 'data' ? 130 : 120;
    return {
      output: {
        x: node.position.x + NODE_WIDTH + CONNECTION_POINT_OFFSET,
        y: node.position.y + nodeHeight / 2
      },
      input: {
        x: node.position.x - CONNECTION_POINT_OFFSET,
        y: node.position.y + nodeHeight / 2
      }
    };
  };

  return (
    <div className="flex-1 relative bg-surface overflow-hidden">
      {/* Grid Background */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle, var(--md-sys-color-outline-variant) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x % (20 * zoom)}px ${pan.y % (20 * zoom)}px`
          }}
        />
      )}

      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-surface-container p-2 rounded-2xl shadow-lg elevation-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="w-10 h-10 p-0 rounded-full hover:bg-surface-container-high"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <div className="label-medium text-on-surface px-2 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="w-10 h-10 p-0 rounded-full hover:bg-surface-container-high"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFitToScreen}
            className="w-10 h-10 p-0 rounded-full border-outline hover:bg-surface-container"
            title="화면에 맞추기"
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={`w-10 h-10 p-0 rounded-full border-outline hover:bg-surface-container ${showGrid ? 'bg-primary-container text-primary' : ''}`}
            title="격자 표시/숨기기"
          >
            <Grid className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary-container flex items-center justify-center">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <h3 className="headline-small text-on-surface mb-2">워크플로 작성 시작하기</h3>
            <p className="body-large text-on-surface-variant mb-6">
              사이드 패널에서 서비스 노드와 데이터 에셋을 끌어다 놓아 자동화 워크플로를 만들어보세요.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-on-surface-variant body-medium">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                서비스 노드
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant body-medium">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                데이터 에셋
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
          {/* Connections SVG - Render behind nodes */}
          <svg 
            ref={svgRef}
            className="absolute inset-0 pointer-events-auto w-full h-full"
            style={{ overflow: 'visible', zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="var(--md-sys-color-primary)"
                />
              </marker>
              <marker
                id="arrowhead-inactive"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="var(--md-sys-color-outline)"
                />
              </marker>
            </defs>
            
            {connections.map((connection) => {
              const fromNode = nodes.find(n => n.id === connection.from);
              const toNode = nodes.find(n => n.id === connection.to);
              
              if (!fromNode || !toNode) return null;
              
              const fromPoints = getConnectionPoints(fromNode);
              const toPoints = getConnectionPoints(toNode);
              
              return (
                <ConnectionLine
                  key={connection.id}
                  from={fromPoints.output}
                  to={toPoints.input}
                  isSelected={selectedNodeId === connection.from || selectedNodeId === connection.to}
                  onClick={() => handleDeleteConnection(connection.id)}
                />
              );
            })}

            {/* Temporary connection line while dragging */}
            {connecting && (
              <g>
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={0}
                  stroke="var(--md-sys-color-primary)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="opacity-50"
                />
              </g>
            )}
          </svg>

          {/* Nodes - Render on top of connections */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {nodes.map((node) => (
              node.type === 'service' ? (
                <WorkflowNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  onSelect={onSelectNode}
                  onDelete={onDeleteNode}
                  onUpdatePosition={onUpdateNodePosition}
                  onOpenSettings={onOpenSettings}
                  onStartConnection={handleStartConnection}
                  onCompleteConnection={handleCompleteConnection}
                  isConnecting={connecting?.from === node.id}
                />
              ) : (
                <DataNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  onSelect={onSelectNode}
                  onDelete={onDeleteNode}
                  onUpdatePosition={onUpdateNodePosition}
                  onOpenSettings={onOpenSettings}
                  onStartConnection={handleStartConnection}
                  onCompleteConnection={handleCompleteConnection}
                  isConnecting={connecting?.from === node.id}
                />
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}