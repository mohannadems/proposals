import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  TextInput,
  Animated,
  Dimensions,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext"; // Update this path if needed
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ModernDropdown = ({
  label,
  value,
  items = [],
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  clearText = "Clear",
}) => {
  const { isRTL } = useContext(LanguageContext); // Get RTL status from context
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const modalAnimation = useRef(new Animated.Value(0)).current;

  // Get the selected item's label
  const selectedItem = items.find((item) => item.value === value);
  const displayText = selectedItem ? selectedItem.label : placeholder;

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

  const handleSelect = (item) => {
    onValueChange(item.value);
    animateModalOut();
  };

  const handleClear = () => {
    onValueChange(null);
  };

  const animateModalIn = () => {
    setSearchText("");
    setFilteredItems(items);
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

  const slideTranslation = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  const backdropOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <View
        style={[
          styles.headerContainer,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Text style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
          {label}
        </Text>
        {value !== null && !disabled && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>{clearText}</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.dropdownButton,
          { flexDirection: isRTL ? "row-reverse" : "row" },
          disabled && styles.dropdownButtonDisabled,
          !selectedItem && styles.dropdownButtonEmpty,
        ]}
        onPress={disabled ? null : animateModalIn}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text
          style={[
            styles.dropdownText,
            { textAlign: isRTL ? "right" : "left" },
            !selectedItem && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <View style={styles.iconContainer}>
          <Ionicons
            name="chevron-down"
            size={20}
            color={disabled ? "#CCC" : COLORS.primary}
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={animateModalOut}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
            onTouchEnd={animateModalOut}
          />

          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideTranslation }] },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity
                onPress={animateModalOut}
                style={[
                  styles.closeButton,
                  isRTL ? { left: 20, right: "auto" } : { right: 20 },
                ]}
              >
                <Ionicons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.searchContainer,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="search"
                size={18}
                color="#999"
                style={[
                  styles.searchIcon,
                  isRTL
                    ? { marginLeft: 8, marginRight: 0 }
                    : { marginRight: 8, marginLeft: 0 },
                ]}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
                placeholder="Search..."
                value={searchText}
                onChangeText={handleSearch}
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
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                    value === item.value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { textAlign: isRTL ? "right" : "left" },
                      value === item.value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {value === item.value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No results found for "{searchText}"
                  </Text>
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                      setSearchText("");
                      setFilteredItems(items);
                    }}
                  >
                    <Text style={styles.resetButtonText}>Show all options</Text>
                  </TouchableOpacity>
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                filteredItems.length === 0 ? { flex: 1 } : null
              }
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
  containerDisabled: {
    opacity: 0.6,
  },
  headerContainer: {
    flexDirection: "row", // Will be overridden based on isRTL
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    // textAlign will be set dynamically
  },
  clearButton: {
    backgroundColor: "rgba(74, 111, 161, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  dropdownButton: {
    flexDirection: "row", // Will be overridden based on isRTL
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  dropdownButtonDisabled: {
    backgroundColor: "#F5F7FA",
    borderColor: "#E5E5E5",
  },
  dropdownButtonEmpty: {
    borderStyle: "dashed",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    // textAlign will be set dynamically
  },
  placeholderText: {
    color: "#A1A1A1",
  },
  disabledText: {
    color: "#A1A1A1",
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  modalHeader: {
    flexDirection: "row", // Will be overridden based on isRTL
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    // right/left will be set dynamically
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row", // Will be overridden based on isRTL
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    // margin will be set dynamically
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    // textAlign will be set dynamically
  },
  optionItem: {
    flexDirection: "row", // Will be overridden based on isRTL
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F4",
  },
  selectedOption: {
    backgroundColor: "rgba(74, 111, 161, 0.05)",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    // textAlign will be set dynamically
  },
  selectedOptionText: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "rgba(74, 111, 161, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});

export default ModernDropdown;
