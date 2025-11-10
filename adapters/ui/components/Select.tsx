import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
  return (
    <div>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-400 mb-1"
      >
        {label}
      </label>
      <select
        {...props}
        className="block w-full pl-3 pr-10 py-2 text-base bg-navy-800 border-navy-700 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md text-white"
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
