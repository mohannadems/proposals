import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { COLORS } from "../../constants/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ModernDropdown = ({
  label,
  value,
  items,
  onValueChange,
  required = false,
  placeholder = "Select an option",
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const modalAnimation = useRef(new Animated.Value(0)).current;

  // Find the selected item label
  const selectedItem = items.find((item) => item.value === value);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  const handleSelect = (item) => {
    onValueChange(item.value);
    animateModalOut();
  };

  // Handle clearing the selection
  const handleClear = () => {
    onValueChange(null);
  };

  const animateModalIn = () => {
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateModalOut = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSearchText("");
      setFilteredItems(items);
    });
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  // Animations for modal
  const slideTranslation = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const backdropOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredMarker}>*</Text>}
        </Text>

        {value !== null && !required && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.dropdown,
          !selectedItem && styles.dropdownEmpty,
          value === null && required && styles.dropdownError,
        ]}
        onPress={animateModalIn}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.dropdownText, !selectedItem && styles.placeholder]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <View style={styles.iconContainer}>
          <View style={styles.downArrow} />
        </View>
      </TouchableOpacity>

      {value === null && required && (
        <Text style={styles.errorText}>This field is required</Text>
      )}

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={animateModalOut}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          >
            <TouchableWithoutFeedback onPress={animateModalOut}>
              <View style={styles.backdropTouchable} />
            </TouchableWithoutFeedback>
          </Animated.View>

          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideTranslation }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity
                onPress={animateModalOut}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={handleSearch}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>

            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item.value && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item.value && styles.selectedText,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {value === item.value && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>No results found</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  clearButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  requiredMarker: {
    color: COLORS.error,
    fontWeight: "bold",
  },
  dropdown: {
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.inputBg,
  },
  dropdownEmpty: {
    borderStyle: "dashed",
  },
  dropdownError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  placeholder: {
    color: COLORS.lightText,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  downArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.lightText,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkText,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedItem: {
    backgroundColor: COLORS.lightPrimary + "50", // 50% opacity
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  selectedText: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyList: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 16,
    color: COLORS.lightText,
  },
});

export default ModernDropdown;
