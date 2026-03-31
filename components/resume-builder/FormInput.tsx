import React from "react";

interface FormInputProps {
  name: string;
  label: string;
  icon?: React.ReactNode;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  name,
  label,
  icon,
  value,
  type = "text",
  placeholder,
  onChange,
}: FormInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
      >
        {icon}
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900 dark:text-white"
      />
    </div>
  );
};

export default FormInput;
