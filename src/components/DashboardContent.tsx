import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Search, Zap, Clock, Sparkles } from 'lucide-react';

export function DashboardContent() {
  const templates = [
    {
      id: 1,
      title: '관심종목&기업뉴스 자동 문자 발송하기',
      image: '/placeholder-template1.jpg'
    },
    {
      id: 2,
      title: '정부지원 수집 후 메일&문자로 공유하기',
      image: '/placeholder-template2.jpg'
    },
    {
      id: 3,
      title: '매일 아침 우리 팀을 위한 AI 뉴스 브리핑 받기',
      image: '/placeholder-template3.jpg'
    },
    {
      id: 4,
      title: '뉴스기사 크롤링 후 AI로 날짜와 중복 필터링하기',
      image: '/placeholder-template4.jpg'
    },
    {
      id: 5,
      title: '급여명세서 작성부터 발송까지 한 번에',
      image: '/placeholder-template5.jpg'
    }
  ];

  const recentWorks = [
    {
      id: 1,
      title: '2차_송촌 뉴스레터 발송 준비',
      lastRun: '2025.08.08 12:58',
      status: 'completed'
    },
    {
      id: 2,
      title: '03_고객 그룹별 뉴스 발송(프로)',
      lastRun: '2025.07.22 14:18',
      status: 'scheduled'
    },
    {
      id: 3,
      title: '01_상담 신청 접수 안내',
      lastRun: '2025.07.16 14:57',
      status: 'scheduled'
    },
    {
      id: 4,
      title: '02_상담 검토 완료 안내',
      lastRun: '2025.07.16 14:16',
      status: 'completed'
    },
    {
      id: 5,
      title: '[초급] 노션에서 간편하게 문자 발송하기',
      lastRun: '2025.05.23 13:57',
      status: 'scheduled'
    }
  ];

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-[1120px] mx-auto px-8 py-10">
        {/* Hero Section */}
        <div className="text-center mb-14">
          {/* Gradient background icon */}
          <div className="relative mb-6">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 w-21 h-21 rounded-full bg-primary/20 -translate-x-1.5 -translate-y-1.5"></div>
              <div className="relative w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-[21px] font-normal leading-7 text-foreground mb-2">
            가장 귀찮은 일, 바티에게 전부 맡겨주세요.
          </h1>
          <p className="text-sm text-muted-foreground mb-14 max-w-md mx-auto">
            한 문장으로 원하는 결과만 알려주시면 나머지는 바티가 도와드릴게요.
          </p>

          {/* Search Input */}
          <div className="relative max-w-[672px] mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                className="h-12 pl-14 pr-28 rounded-2xl border-2 border-gray-100 shadow-[0px_4px_20px_0px_rgba(20,132,236,0.08)] placeholder:text-gray-400 text-base"
                placeholder="매일 아침, 경쟁사 최신 뉴스 3줄 요약 받고 싶어요"
              />
              <Button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-9 px-4 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs"
                variant="secondary"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                도와줘요
              </Button>
            </div>
          </div>
        </div>

        {/* Recommended Templates Section */}
        <div className="mb-16">
          <div className="flex items-center mb-5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-normal leading-6 text-foreground">추천 템플릿</h2>
              <p className="text-xs text-muted-foreground">바로 시작할 수 있는 인기 자동화 템플릿</p>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 pl-10 pr-10">
              {templates.map((template) => (
                <Card key={template.id} className="min-w-[224px] rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="h-28 bg-black"></div>
                  <div className="p-4">
                    <h3 className="text-xs leading-4 text-foreground">{template.title}</h3>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Navigation arrows */}
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full p-0 opacity-50 shadow-md"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                <path d="M8.75 10.5L5.25 7L8.75 3.5" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full p-0 shadow-md"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                <path d="M5.25 10.5L8.75 7L5.25 3.5" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Recent Work Section */}
        <div>
          <div className="flex items-center mb-5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center mr-3">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-normal leading-6 text-foreground">최근 작업</h2>
              <p className="text-xs text-muted-foreground">최근에 작업한 자동화 워크플로우</p>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 pl-10 pr-10">
              {recentWorks.map((work) => (
                <Card key={work.id} className="min-w-[224px] rounded-xl border border-border p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="mb-2">
                    <h3 className="text-xs leading-4 text-foreground h-9 line-clamp-2">{work.title}</h3>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>최근실행</span>
                    <span>{work.lastRun}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {work.status === 'scheduled' ? (
                      <div className="flex items-center px-2 py-1 rounded-lg bg-blue-50">
                        <Clock className="w-2.5 h-2.5 text-primary mr-1" />
                        <span className="text-xs text-primary">스케쥴링</span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 14 14">
                      <path d="M2.91667 7H11.0833" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 2.91667L11.0833 7L7 11.0833" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Card>
              ))}
            </div>

            {/* Navigation arrows */}
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full p-0 opacity-50 shadow-md"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                <path d="M8.75 10.5L5.25 7L8.75 3.5" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full p-0 shadow-md"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                <path d="M5.25 10.5L8.75 7L5.25 3.5" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}