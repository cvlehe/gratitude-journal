import React, { useRef } from "react";
import { View, Text, Platform, Button, TouchableOpacity } from "react-native";
import { MenuView, MenuComponentRef } from "@react-native-menu/menu";
import Ionicons from "@expo/vector-icons/Ionicons";

const Menu = ({
  onItemPress,
}: {
  onItemPress: (id: "import" | "export" | "delete") => void;
}) => {
  const menuRef = useRef<MenuComponentRef>(null);
  return (
    <View
      style={{
        alignItems: "flex-end",
      }}
    >
      <MenuView
        style={{ marginHorizontal: 32, marginTop: 32 }}
        ref={menuRef}
        title="Menu Title"
        onPressAction={({ nativeEvent }) => {
          onItemPress(nativeEvent.event as "import" | "export" | "delete");
        }}
        actions={[
          {
            id: "import",
            title: "Import",
          },
          {
            id: "export",
            title: "Export",
          },
          {
            id: "delete",
            title: "Delete",
            attributes: {
              destructive: true,
            },
          },
        ]}
        shouldOpenOnLongPress={false}
      >
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </MenuView>
    </View>
  );
};

export default Menu;
