import { Page } from '../types';
import { Home, FileText, FileStack, Users, Settings } from 'lucide-react';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { page: 'home' as const, icon: Home, label: 'Nyumbani' },
    { page: 'quotations' as const, icon: FileText, label: 'Nukuu' },
    { page: 'invoices' as const, icon: FileStack, label: 'Ankara' },
    { page: 'customers' as const, icon: Users, label: 'Wateja' },
    { page: 'settings' as const, icon: Settings, label: 'Mipango' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <nav className="flex justify-around">
        {navItems.map(({ page, icon: Icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex-1 py-3 px-2 text-center flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              currentPage === page
                ? 'text-accent border-t-2 border-accent'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={24} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default BottomNav;
