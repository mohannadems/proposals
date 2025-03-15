import React from "react";
import { View, StyleSheet } from "react-native";
import { useController } from "react-hook-form";

const SelectableGrid = ({
  control,
  name,
  items,
  multiple = false,
  numColumns = 3,
  renderItem,
}) => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
    defaultValue: multiple ? [] : null,
  });

  const itemsWithNone = [...items, { id: "none", name: "None" }];

  const handleSelect = (item) => {
    if (!multiple) {
      onChange(item.id === "none" ? [] : [parseInt(item.id)]);
      return;
    }

    const currentSelections = value || [];

    if (item.id === "none") {
      onChange([]);
      return;
    }

    if (currentSelections.includes(parseInt(item.id))) {
      const newSelections = currentSelections.filter(
        (id) => id !== parseInt(item.id)
      );
      onChange(newSelections.length === 0 ? [] : newSelections);
    } else {
      onChange([...currentSelections, parseInt(item.id)]);
    }
  };

  const isSelected = (item) => {
    if (!value) return false;
    return multiple ? value.includes(item.id) : value === item.id;
  };

  const renderGridItems = () => {
    const rows = Math.ceil(itemsWithNone.length / numColumns);
    const gridItems = [];

    for (let i = 0; i < rows; i++) {
      const rowItems = itemsWithNone.slice(
        i * numColumns,
        (i + 1) * numColumns
      );
      const row = (
        <View key={`row-${i}`} style={styles.row}>
          {rowItems.map((item) => (
            <View key={item.id} style={styles.gridItemContainer}>
              <View onTouchEnd={() => handleSelect(item)}>
                {renderItem(item, isSelected(item))}
              </View>
            </View>
          ))}
          {rowItems.length < numColumns &&
            Array(numColumns - rowItems.length)
              .fill()
              .map((_, index) => (
                <View key={`empty-${index}`} style={styles.gridItemContainer} />
              ))}
        </View>
      );
      gridItems.push(row);
    }

    return gridItems;
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>{renderGridItems()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  grid: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  gridItemContainer: {
    flex: 1,
    paddingVertical: 10,
  },
});

export default SelectableGrid;
