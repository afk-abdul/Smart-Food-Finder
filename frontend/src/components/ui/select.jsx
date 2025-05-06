// components/ui/select.jsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const SelectContext = createContext();

export const Select = ({ children, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");
  const ref = useRef();

  const handleSelect = (val) => {
    setSelected(val);
    onChange?.(val);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ open, setOpen, selected, handleSelect }}>
      <div className="relative w-full max-w-sm" ref={ref}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children }) => {
  const { setOpen, open } = useContext(SelectContext);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full p-3 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center shadow-sm hover:border-gray-400 focus:outline-none"
    >
      {children}
      <svg
        className={`w-4 h-4 ml-2 transition-transform ${
          open ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};

export const SelectValue = () => {
  const { selected } = useContext(SelectContext);
  return <span>{selected || "Select an option"}</span>;
};

export const SelectContent = ({ children }) => {
  const { open } = useContext(SelectContext);
  return (
    open && (
      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
        {children}
      </ul>
    )
  );
};

export const SelectItem = ({ value, children }) => {
  const { handleSelect, selected } = useContext(SelectContext);
  return (
    <li
      onClick={() => handleSelect(value)}
      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
        selected === value ? "bg-gray-100 font-medium" : ""
      }`}
    >
      {children}
    </li>
  );
};
