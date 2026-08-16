interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

function Header({ title, subtitle, onBack }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 p-2 -ml-2"
              aria-label="Go back"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
