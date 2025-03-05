// components/MultiSelectFilter.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const MultiSelectFilter = ({
  title,
  values = [],
  items = [],
  onSelect,
  loading = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items based on search query
  const filteredItems =
    searchQuery.trim() === ""
      ? items
      : items.filter(
          (item) =>
            item.name &&
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // Extract emojis from text
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

  // Get the names of selected items to display
  const getSelectedItemsText = () => {
    if (values.length === 0) return "None selected";

    if (values.length === 1) {
      const selectedItem = items.find((item) => item.id === values[0]);
      return selectedItem
        ? getTextAndEmoji(selectedItem.name).text
        : "1 selected";
    }

    return `${values.length} selected`;
  };

  // Handle item selection
  const handleSelect = (itemId) => {
    onSelect(itemId);
  };

  // Render a selected chip in the button
  const renderChip = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return null;

    const { emoji, text } = getTextAndEmoji(item.name);

    return (
      <View key={itemId} style={styles.chip}>
        {emoji && <Text style={styles.chipEmoji}>{emoji}</Text>}
        <Text style={styles.chipText}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => !loading && setModalVisible(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : values.length > 0 ? (
          <View style={styles.selectedChipsContainer}>
            {values.length <= 2 ? (
              values.map((itemId) => renderChip(itemId))
            ) : (
              <>
                {renderChip(values[0])}
                <View style={styles.moreChip}>
                  <Text style={styles.moreChipText}>
                    +{values.length - 1} more
                  </Text>
                </View>
              </>
            )}
          </View>
        ) : (
          <Text style={styles.placeholderText}>Select options</Text>
        )}

        <Ionicons name="chevron-down" size={18} color="#777" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery("");
                }}
              >
                <Text style={styles.doneButtonText}>Done</Text>
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
                  const isSelected = values.includes(item.id);
                  const { emoji, text } = getTextAndEmoji(item.name);

                  return (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => handleSelect(item.id)}
                    >
                      <View style={styles.checkboxContainer}>
                        <View
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected,
                          ]}
                        >
                          {isSelected && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FFFFFF"
                            />
                          )}
                        </View>
                      </View>

                      {emoji && <Text style={styles.optionEmoji}>{emoji}</Text>}
                      <Text style={styles.optionText}>{text}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={40} color="#DDD" />
                <Text style={styles.emptyText}>No options found</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  selectorButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
  },
  selectedChipsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "rgba(158, 8, 108, 0.08)",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
    marginTop: 4,
  },
  chipEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
  moreChip: {
    backgroundColor: "#F0F0F0",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 4,
    marginTop: 4,
  },
  moreChipText: {
    fontSize: 13,
    color: "#777",
  },
  placeholderText: {
    color: "#999",
    fontSize: 15,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 30,
    minHeight: "50%",
    maxHeight: "80%",
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  doneButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  optionText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
});

export default MultiSelectFilter;
