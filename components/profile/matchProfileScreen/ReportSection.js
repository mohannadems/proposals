import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import ReportUserModal from "../../report/ReportUserModal";

const ReportSection = ({
  userName,
  userId,
  isRTL,
  styles: customStyles,
  onReportPress,
  reportModalVisible,
  onCloseReportModal,
}) => {
  return (
    <>
      <View style={customStyles.reportContainer}>
        <TouchableOpacity
          style={[
            customStyles.reportButton,
            isRTL && customStyles.reportButtonRTL,
          ]}
          onPress={onReportPress}
        >
          <Feather name="flag" size={16} color={COLORS.text} />
          <Text
            style={[
              customStyles.reportText,
              isRTL && customStyles.reportTextRTL,
            ]}
          >
            {isRTL ? `إبلاغ عن ${userName}` : `Report ${userName}`}
          </Text>
        </TouchableOpacity>
      </View>

      <ReportUserModal
        visible={reportModalVisible}
        onClose={onCloseReportModal}
        userId={userId}
        userName={userName}
      />
    </>
  );
};

export default ReportSection;
