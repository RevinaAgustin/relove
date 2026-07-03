/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-[#414944] mb-6 font-geist select-none">
      <button
        onClick={() => {
          const firstItem = items[0];
          if (firstItem && firstItem.onClick && firstItem.label.toLowerCase() === 'beranda') {
            firstItem.onClick();
          }
        }}
        className="flex items-center gap-1 hover:text-[#002d1c] transition-colors cursor-pointer"
      >
        <Home size={12} className="stroke-[2.5]" />
        <span>BERANDA</span>
      </button>
      
      {items.map((item, idx) => {
        // If the first item is "Beranda", skip rendering it twice
        if (idx === 0 && item.label.toLowerCase() === 'beranda') return null;

        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <ChevronRight size={10} className="text-[#c1c8c2] stroke-[3]" />
            {isLast ? (
              <span className="text-[#002d1c] font-black">{item.label}</span>
            ) : (
              <button
                onClick={item.onClick}
                className="hover:text-[#002d1c] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
