import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar({
  value, onChange, placeholder = '搜尋筆記標題、內容或標籤…',
}, ref) {
  return (
    <label className="search-field">
      <Search size={19} aria-hidden="true" />
      <span className="sr-only">搜尋筆記</span>
      <input ref={ref} value={value} type="search" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {value && <button type="button" onClick={() => onChange('')} aria-label="清除搜尋"><X size={16} /></button>}
    </label>
  );
});

export default SearchBar;
