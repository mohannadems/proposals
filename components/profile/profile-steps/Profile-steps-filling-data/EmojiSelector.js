import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const SelectableItem = ({ item, isSelected, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      relative flex flex-col items-center justify-center p-4 
      rounded-xl cursor-pointer transition-all duration-200
      ${isSelected ? "bg-[#9e086c] text-white" : "bg-white hover:bg-gray-50"}
      border-2 ${isSelected ? "border-[#9e086c]" : "border-[#E5E5EA]"}
    `}
  >
    {isSelected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-2 right-2 bg-white rounded-full p-1"
      >
        <Check size={16} className="text-[#9e086c]" />
      </motion.div>
    )}

    <div className="text-4xl mb-2">{item.emoji}</div>
    <span
      className={`text-sm font-medium ${
        isSelected ? "text-white" : "text-[#1C1C1E]"
      }`}
    >
      {item.name}
    </span>
  </motion.div>
);

const SelectableGrid = ({
  control,
  name,
  items,
  multiple = false,
  numColumns = 3,
}) => {
  const { field } = control.register(name);
  const selectedItems = field.value || (multiple ? [] : null);

  const handleItemClick = (item) => {
    if (multiple) {
      const newSelected = selectedItems.includes(item.id)
        ? selectedItems.filter((id) => id !== item.id)
        : [...selectedItems, item.id];
      field.onChange(newSelected);
    } else {
      field.onChange(selectedItems === item.id ? null : item.id);
    }
  };

  return (
    <div className={`grid grid-cols-${numColumns} gap-4`}>
      {items.map((item) => (
        <SelectableItem
          key={item.id}
          item={item}
          isSelected={
            multiple
              ? selectedItems.includes(item.id)
              : selectedItems === item.id
          }
          onClick={() => handleItemClick(item)}
        />
      ))}
    </div>
  );
};

const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay / 1000 }}
    className="bg-white rounded-xl shadow-sm p-6 mb-6"
  >
    {children}
  </motion.div>
);

const CardHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-[#1C1C1E] mb-1">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);

export { SelectableGrid, AnimatedCard, CardHeader };
