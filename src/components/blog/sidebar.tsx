

import type React from 'react';

import { useState } from 'react';
import StickySidebar from './sticky-sidebar';

export default function Sidebar() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <aside className="space-y-8 overflow-clip hidden md:block flex-grow-0 flex-shrink-0 w-80">
      { /* Newsletter Subscription - Normal Flow */ }
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscribe newsletters</h3>
        <p className="text-sm text-gray-600 mb-4">
          Stay on top of the latest product updates, development inspirations, blogs, and research articles.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

      { /* Promotional Card - Normal Flow */ }
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white shadow-sm">
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 bg-white rounded mr-2 flex items-center justify-center">
            <span className="text-purple-600 font-bold text-sm">P</span>
          </div>
          <span className="font-semibold">Plexicus</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">ASPM Provider</h3>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
            <span>Open-source blog alternative</span>
          </div>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
            <span>For both B2B and B2C use cases</span>
          </div>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
            <span>Free plan up to 50k MAU</span>
          </div>
        </div>
        <button className="w-full bg-white text-purple-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          Sign up today
        </button>
      </div>

      { /* Sticky Share and TOC Section */ }
      <StickySidebar />
    </aside>
  );
}
