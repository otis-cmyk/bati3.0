import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, ChevronLeft, ChevronRight, Plus, Edit, FileSpreadsheet, Database, FileText, Folder, FolderOpen, Upload, Link } from "lucide-react";
import { getDataIcon } from "../utils/icons";

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

interface DataPanelProps {
  onAddNode: (data: any) => void;
  dataAssets: DataAsset[];
  onEditAsset: (assetId: string) => void;
}

export function DataPanel({ onAddNode, dataAssets, onEditAsset }: DataPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['최근 에셋']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredAssets = dataAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDataAssetDragStart = (e: React.DragEvent, asset: DataAsset) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'data',
      name: asset.name,
      fileType: asset.type,
      size: asset.size,
      lastModified: asset.lastModified,
      color: asset.color
    }));
  };

  const handleDataAssetClick = (asset: DataAsset) => {
    onAddNode({
      type: 'data',
      name: asset.name,
      fileType: asset.type,
      size: asset.size,
      lastModified: asset.lastModified,
      color: asset.color
    });
  };

  const handleEditClick = (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation();
    onEditAsset(assetId);
  };

  const handleAssetCardClick = (e: React.MouseEvent, assetId: string) => {
    // Open editor when clicking on the card
    onEditAsset(assetId);
  };

  // 타입별로 에셋 그룹화하여 더 나은 구성
  const groupedAssets = {
    '최근 에셋': filteredAssets.slice(0, 5), // 최근 5개
    '스프레드시트': filteredAssets.filter(asset => asset.type === 'spreadsheet'),
    'CSV 파일': filteredAssets.filter(asset => asset.type === 'csv'),
    'JSON 파일': filteredAssets.filter(asset => asset.type === 'json'),
    '데이터베이스': filteredAssets.filter(asset => asset.type === 'database'),
  };

  const categories = [
    { name: '최근 에셋', description: '최근 사용된 데이터셋', count: groupedAssets['최근 에셋'].length },
    { name: '스프레드시트', description: '엑셀 및 스프레드시트 파일', count: groupedAssets['스프레드시트'].length },
    { name: 'CSV 파일', description: '쉼표로 구분된 값', count: groupedAssets['CSV 파일'].length },
    { name: 'JSON 파일', description: 'JSON 데이터 파일', count: groupedAssets['JSON 파일'].length },
    { name: '데이터베이스', description: '연결된 데이터베이스', count: groupedAssets['데이터베이스'].length },
  ];

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col elevation-1">
        <div className="p-3">
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 p-0 rounded-full hover:bg-sidebar-accent"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col elevation-1 h-full">
      {/* Header - Fixed */}
      <div className="p-6 border-b border-sidebar-border bg-sidebar shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="title-medium text-sidebar-foreground">데이터 에셋</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="w-10 h-10 p-0 rounded-full hover:bg-sidebar-accent"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="데이터 에셋 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 rounded-full bg-input-background border-outline text-body-large"
          />
        </div>
      </div>

      {/* Scrollable Categories Area */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4 pb-8">
          {categories.map((category) => (
            <div key={category.name} className="space-y-3">
              <Button
                variant="ghost"
                onClick={() => toggleCategory(category.name)}
                className="w-full justify-start p-3 h-auto rounded-xl hover:bg-sidebar-accent transition-colors duration-200"
              >
                {expandedCategories.includes(category.name) ? (
                  <FolderOpen className="w-5 h-5 mr-3 text-primary" />
                ) : (
                  <Folder className="w-5 h-5 mr-3 text-muted-foreground" />
                )}
                <div className="flex-1 text-left min-w-0">
                  <div className="title-small text-sidebar-foreground truncate">{category.name}</div>
                  <div className="body-small text-muted-foreground truncate">{category.description}</div>
                </div>
                <Badge variant="secondary" className="ml-2 rounded-full shrink-0 bg-primary/10 text-primary border-primary/20">
                  {category.count}
                </Badge>
              </Button>
              
              {expandedCategories.includes(category.name) && (
                <div className="ml-2 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  {groupedAssets[category.name as keyof typeof groupedAssets]?.map((asset) => (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => handleDataAssetDragStart(e, asset)}
                      onClick={(e) => handleAssetCardClick(e, asset.id)}
                      className="group flex items-center gap-3 p-4 rounded-2xl border border-sidebar-border hover:bg-sidebar-accent cursor-pointer transition-all duration-200 hover:elevation-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${asset.color} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                        {getDataIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="title-small text-sidebar-foreground truncate group-hover:text-primary transition-colors duration-200">{asset.name}</div>
                        <div className="body-small text-muted-foreground flex items-center gap-2">
                          <span className="capitalize">{asset.type}</span>
                          <span>•</span>
                          <span>{asset.size}</span>
                        </div>
                        <div className="label-small text-muted-foreground">
                          {asset.lastModified}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 rounded-full hover:bg-primary/10 transition-colors duration-200"
                          onClick={(e) => handleEditClick(e, asset.id)}
                          title="데이터 에셋 편집"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 rounded-full hover:bg-primary/10 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDataAssetClick(asset);
                          }}
                          title="캔버스에 추가"
                        >
                          <Plus className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {groupedAssets[category.name as keyof typeof groupedAssets]?.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <FileSpreadsheet className="w-8 h-8 mx-auto mb-3 opacity-50" />
                      <p className="body-medium">{category.name}을(를) 찾을 수 없습니다</p>
                      <p className="body-small">검색어를 조정해보세요</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Empty state for search */}
          {searchTerm && filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="title-small text-foreground mb-2">데이터 에셋을 찾을 수 없습니다</h3>
              <p className="body-small text-muted-foreground">
                다른 검색어를 사용하거나 위의 카테고리를 찾아보세요.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Fixed Quick Actions - Bottom */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar/95 backdrop-blur-sm shrink-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="title-small text-sidebar-foreground">빠른 작업</h3>
            <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-primary/20">
              2
            </Badge>
          </div>
          
          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto rounded-2xl border-border hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-3 shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="title-small text-sidebar-foreground group-hover:text-primary transition-colors duration-200">데이터셋 업로드</div>
              <div className="body-small text-muted-foreground">새 데이터 소스 추가</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto rounded-2xl border-border hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-3 shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
              <Link className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="title-small text-sidebar-foreground group-hover:text-primary transition-colors duration-200">데이터베이스 연결</div>
              <div className="body-small text-muted-foreground">외부 데이터베이스 연결</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}