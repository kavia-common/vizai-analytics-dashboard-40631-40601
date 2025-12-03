import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import ChatWidget from '../common/ChatWidget';

// PUBLIC_INTERFACE
export default function AppLayout() {
  // New app shell: TopNav + page container; ChatWidget is global
  return (
    <>
      <TopNav />
      <div className="page">
        <div className="page-container">
          <Outlet />
        </div>
      </div>
      <ChatWidget />
    </>
  );
}
