// src/components/common/Header.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, Bell } from 'lucide-react'; // 아이콘 추가

export default function Header() {
    // 현재 경로를 확인하여 활성화된 메뉴를 표시하기 위해 사용
    const location = useLocation();

    // 네비게이션 메뉴 정의
    const navItems = [
        { name: '정비소 찾기', path: '/recommend', icon: Wrench },
        { name: '공지사항', path: '/notice_list', icon: Bell },
        // 필요하다면 여기에 다른 메뉴 추가 가능 (예: { name: '로그인', path: '/login' })
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100/80 backdrop-blur-sm">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* 1. 로고 (홈 링크) */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-extrabold text-teal-600 hover:text-teal-700 transition duration-150 flex items-center gap-2">
                            <Wrench size={24} className="text-teal-500" />
                            MY CAR 정비소
                        </Link>
                    </div>

                    {/* 2. 주 네비게이션 */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-6">
                            {navItems.map((item) => {
                                // 현재 경로가 메뉴 경로와 일치하는지 확인
                                const isActive = 
                                    (item.path === '/' && location.pathname === '/') || 
                                    (item.path !== '/' && location.pathname.startsWith(item.path));
                                
                                return (
                                    <li key={item.name}>
                                        <Link 
                                            to={item.path} 
                                            className={`
                                                px-3 py-2 text-sm font-medium transition duration-150 ease-in-out
                                                flex items-center gap-1
                                                ${isActive 
                                                    ? 'text-teal-600 border-b-2 border-teal-600' 
                                                    : 'text-gray-600 hover:text-teal-600 hover:border-b-2 hover:border-teal-300/50'
                                                }
                                            `}
                                        >
                                            <item.icon size={16} />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* 3. 유틸리티/모바일 메뉴 (임시) */}
                    <div className="flex items-center space-x-4">
                        {/* 로그인/회원가입 등 유틸리티 링크 (추후 구현) */}
                        <Link 
                            to="/login" 
                            className="text-sm font-medium text-gray-500 hover:text-teal-600 transition hidden sm:block"
                        >
                            로그인
                        </Link>
                        {/* 모바일 메뉴 버튼 (나중에 구현) */}
                        <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}