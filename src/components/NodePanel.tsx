import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, ChevronLeft, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { NodePalette } from "./NodePalette";

interface NodePanelProps {
  onAddNode: (data: any) => void;
}

export function NodePanel({ onAddNode }: NodePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['커뮤니케이션']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = [
    { name: '커뮤니케이션', description: 'API, 웹훅, 메시징', count: 8 },
    { name: '데이터 처리', description: '변환, 필터링, 검증', count: 12 },
    { name: '저장소', description: '데이터베이스, 파일, 클라우드', count: 6 },
    { name: 'AI & ML', description: '머신러닝, AI 모델', count: 4 },
    { name: '분석', description: '추적, 지표, 리포팅', count: 7 },
    { name: '소셜 미디어', description: '트위터, 페이스북, 인스타그램', count: 5 },
    { name: '전자상거래', description: '쇼핑, 결제, 주문', count: 9 },
    { name: '생산성', description: '오피스 도구, 캘린더', count: 11 },
    { name: '개발', description: '코드, 배포, CI/CD', count: 8 },
    { name: '보안', description: '인증, 암호화', count: 6 },
    { name: 'IoT & 하드웨어', description: '센서, 디바이스, 제어', count: 4 },
    { name: '금융', description: '뱅킹, 암호화폐, 회계', count: 7 }
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
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border bg-sidebar shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="title-medium text-sidebar-foreground">서비스 노드</h2>
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
            placeholder="서비스 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 rounded-full bg-input-background border-outline text-body-large"
          />
        </div>
      </div>

      {/* Categories */}
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
                <div className="ml-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <NodePalette 
                    category={category.name} 
                    searchTerm={searchTerm} 
                    onAddNode={onAddNode}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Empty state for search */}
          {searchTerm && categories.every(cat => !cat.name.toLowerCase().includes(searchTerm.toLowerCase())) && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="title-small text-foreground mb-2">검색 결과 없음</h3>
              <p className="body-small text-muted-foreground">
                다른 검색어를 사용하거나 위의 카테고리를 찾아보세요.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}