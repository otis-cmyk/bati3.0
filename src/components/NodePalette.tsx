import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getServiceIcon } from '../utils/icons';

interface Service {
  id: string;
  name: string;
  description: string;
  iconType: string;
  color: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
}

interface NodePaletteProps {
  category: string;
  searchTerm: string;
  onAddNode: (data: any) => void;
}

const services: Service[] = [
  // 커뮤니케이션
  { id: 'http', name: 'HTTP 요청', description: 'API에 HTTP 요청 전송', iconType: 'globe', color: 'bg-blue-500', category: '커뮤니케이션', isPopular: true },
  { id: 'webhook', name: '웹훅', description: '들어오는 웹훅 수신', iconType: 'webhook', color: 'bg-green-500', category: '커뮤니케이션' },
  { id: 'email', name: '이메일', description: '이메일 전송 및 수신', iconType: 'mail', color: 'bg-red-500', category: '커뮤니케이션', isPopular: true },
  { id: 'slack', name: '슬랙', description: '슬랙에 메시지 전송', iconType: 'slack', color: 'bg-purple-500', category: '커뮤니케이션' },
  { id: 'discord', name: '디스코드', description: '디스코드에 메시지 전송', iconType: 'message-circle', color: 'bg-indigo-500', category: '커뮤니케이션' },
  { id: 'telegram', name: '텔레그램', description: '텔레그램으로 메시지 전송', iconType: 'send', color: 'bg-blue-400', category: '커뮤니케이션' },
  { id: 'sms', name: 'SMS', description: 'SMS 메시지 전송', iconType: 'smartphone', color: 'bg-green-400', category: '커뮤니케이션' },
  { id: 'teams', name: '마이크로소프트 Teams', description: 'Teams에 메시지 전송', iconType: 'users', color: 'bg-blue-600', category: '커뮤니케이션', isNew: true },

  // 데이터 처리
  { id: 'function', name: '함수', description: '사용자 정의 JavaScript 코드 실행', iconType: 'code', color: 'bg-yellow-500', category: '데이터 처리', isPopular: true },
  { id: 'filter', name: '필터', description: '조건에 따라 데이터 필터링', iconType: 'filter', color: 'bg-orange-500', category: '데이터 처리' },
  { id: 'merge', name: '병합', description: '여러 데이터 스트림 결합', iconType: 'merge', color: 'bg-teal-500', category: '데이터 처리' },
  { id: 'split', name: '일괄 분할', description: '데이터를 배치로 분할', iconType: 'split', color: 'bg-cyan-500', category: '데이터 처리' },
  { id: 'aggregate', name: '집계', description: '계산을 통한 데이터 집계', iconType: 'calculator', color: 'bg-pink-500', category: '데이터 처리' },
  { id: 'transform', name: '변환', description: '데이터 구조 변환', iconType: 'refresh-cw', color: 'bg-violet-500', category: '데이터 처리', isPopular: true },
  { id: 'validate', name: '검증', description: '스키마 기반 데이터 검증', iconType: 'check-circle', color: 'bg-emerald-500', category: '데이터 처리' },
  { id: 'sort', name: '정렬', description: '필드별 데이터 정렬', iconType: 'arrow-up-down', color: 'bg-amber-500', category: '데이터 처리' },
  { id: 'dedupe', name: '중복 제거', description: '중복 레코드 제거', iconType: 'copy', color: 'bg-rose-500', category: '데이터 처리' },
  { id: 'format', name: '형식 지정', description: '데이터 값 형식 지정', iconType: 'type', color: 'bg-lime-500', category: '데이터 처리' },
  { id: 'convert', name: '변환', description: '데이터 타입 변환', iconType: 'repeat', color: 'bg-sky-500', category: '데이터 처리' },
  { id: 'schedule', name: '스케줄 트리거', description: '스케줄에 따라 워크플로 트리거', iconType: 'clock', color: 'bg-gray-500', category: '데이터 처리', isNew: true },

  // 저장소
  { id: 'mysql', name: 'MySQL', description: 'MySQL 데이터베이스 연결', iconType: 'database', color: 'bg-blue-600', category: '저장소', isPopular: true },
  { id: 'postgresql', name: 'PostgreSQL', description: 'PostgreSQL 연결', iconType: 'database', color: 'bg-blue-700', category: '저장소' },
  { id: 'mongodb', name: 'MongoDB', description: 'MongoDB 연결', iconType: 'database', color: 'bg-green-600', category: '저장소' },
  { id: 'redis', name: 'Redis', description: 'Redis 캐시 연결', iconType: 'database', color: 'bg-red-600', category: '저장소' },
  { id: 'googledrive', name: '구글 드라이브', description: '구글 드라이브 파일 접근', iconType: 'cloud', color: 'bg-yellow-400', category: '저장소' },
  { id: 'dropbox', name: '드롭박스', description: '드롭박스 파일 접근', iconType: 'cloud', color: 'bg-blue-500', category: '저장소' },

  // AI & ML
  { id: 'openai', name: 'OpenAI', description: 'OpenAI GPT 모델 사용', iconType: 'brain', color: 'bg-green-500', category: 'AI & ML', isPopular: true },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude AI 모델 사용', iconType: 'brain', color: 'bg-orange-500', category: 'AI & ML', isNew: true },
  { id: 'azure-ai', name: 'Azure AI', description: 'Azure AI 서비스 사용', iconType: 'brain', color: 'bg-blue-500', category: 'AI & ML' },
  { id: 'huggingface', name: 'Hugging Face', description: 'Hugging Face 모델 사용', iconType: 'brain', color: 'bg-yellow-500', category: 'AI & ML' },
];

export function NodePalette({ category, searchTerm, onAddNode }: NodePaletteProps) {
  const filteredServices = services.filter(service => 
    service.category === category &&
    (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNode = (service: Service) => {
    onAddNode({
      type: 'service',
      name: service.name,
      description: service.description,
      iconType: service.iconType,
      color: service.color
    });
  };

  const handleDragStart = (e: React.DragEvent, service: Service) => {
    const dragData = {
      type: 'service',
      name: service.name,
      description: service.description,
      iconType: service.iconType,
      color: service.color
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  };

  return (
    <div className="space-y-2">
      {filteredServices.map((service) => (
        <div
          key={service.id}
          draggable
          onDragStart={(e) => handleDragStart(e, service)}
          onClick={() => handleAddNode(service)}
          className="group flex items-center gap-3 p-3 rounded-xl border border-sidebar-border hover:bg-sidebar-accent cursor-pointer transition-all duration-200 hover:elevation-1"
        >
          <div className={`w-10 h-10 rounded-xl ${service.color} flex items-center justify-center text-white shadow-sm`}>
            {getServiceIcon(service.iconType)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="label-large text-sidebar-foreground truncate">{service.name}</span>
              {service.isPopular && (
                <Badge variant="secondary" className="label-small rounded-full px-2 py-0.5 h-5">
                  인기
                </Badge>
              )}
              {service.isNew && (
                <Badge variant="default" className="label-small rounded-full px-2 py-0.5 h-5 bg-primary">
                  신규
                </Badge>
              )}
            </div>
            <p className="body-small text-muted-foreground truncate">{service.description}</p>
          </div>
        </div>
      ))}
      
      {filteredServices.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p className="body-small">{category}에서 서비스를 찾을 수 없습니다</p>
        </div>
      )}
    </div>
  );
}