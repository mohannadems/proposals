// components/search/DropdownFilter.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const DropdownFilter = ({
  title,
  value,
  items = [],
  onSelect,
  loading = false,
  disabled = false,
  placeholder = "Select an option",
  containerStyle = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Update filtered items when items change or search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(
        (item) => item.name && item.name.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [items, searchQuery]);

  // Animation for modal appearance
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [modalVisible, fadeAnim]);

  // Find the selected item
  const selectedItem = items.find((item) => item.id === value);

  const handleSelect = (item) => {
    onSelect(item.id);
    setModalVisible(false);
    setSearchQuery("");
  };

  // Extract emojis
  const getTextAndEmoji = (text) => {
    if (!text) return { emoji: null, text: "" };

    const emojiRegex =
      /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    const match = text.match(emojiRegex);

    if (match) {
      const emoji = match[0];
      const cleanedText = text.replace(emoji, "").trim();
      return { emoji, text: cleanedText };
    }

    return { emoji: null, text };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          disabled && styles.dropdownButtonDisabled,
          containerStyle,
        ]}
        onPress={() => !disabled && !loading && setModalVisible(true)}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : selectedItem ? (
          <View style={styles.selectedItemContainer}>
            {getTextAndEmoji(selectedItem.name).emoji && (
              <Text style={styles.emoji}>
                {getTextAndEmoji(selectedItem.name).emoji}
              </Text>
            )}
            <Text style={styles.selectedItemText}>
              {getTextAndEmoji(selectedItem.name).text}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>{placeholder}</Text>
        )}

        <Ionicons
          name="chevron-down"
          size={20}
          color={selectedItem ? COLORS.primary : "#777"}
        />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
              onResponderGrant={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {title || "Select an option"}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setModalVisible(false);
                    setSearchQuery("");
                  }}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#777"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#999"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSearchQuery("")}
                  >
                    <Ionicons name="close-circle" size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>

              {filteredItems.length > 0 ? (
                <FlatList
                  data={filteredItems}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.listContainer}
                  renderItem={({ item }) => {
                    const isSelected = item.id === value;
                    const { emoji, text } = getTextAndEmoji(item.name);

                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          isSelected && styles.selectedOption,
                        ]}
                        onPress={() => handleSelect(item)}
                        activeOpacity={0.7}
                      >
                        {emoji && (
                          <Text style={styles.optionEmoji}>{emoji}</Text>
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedOptionText,
                          ]}
                        >
                          {text}
                        </Text>

                        {isSelected && (
                          <View style={styles.checkmarkContainer}>
                            <Ionicons
                              name="checkmark"
                              size={18}
                              color="#FFFFFF"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search" size={50} color="#DDD" />
                  <Text style={styles.emptyText}>No options found</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdownButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  selectedItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedItemText: {
    color: "#333",
    fontSize: 15,
    flex: 1,
    fontWeight: "500",
  },
  placeholderText: {
    color: "#999",
    fontSize: 15,
    flex: 1,
  },
  emoji: {
    fontSize: 18,
    marginRight: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 30,
    minHeight: "60%",
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    margin: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  selectedOption: {
    backgroundColor: "rgba(158, 8, 108, 0.06)",
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  checkmarkContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
});

export default DropdownFilter;
