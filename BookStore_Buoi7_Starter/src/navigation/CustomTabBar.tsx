import React from "react";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TabBar, TabItem } from "../components/TabBar";
import { useCart } from "../store/hooks"; // ← Đã mở comment cho BT7.3e

const EMOJI: Record<string, string> = {
  Home: "🏠",
  Categories: "🗂️",
  Cart: "🛒",
  Account: "👤",
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { totalQuantity } = useCart(); // ← Lấy tổng số lượng từ giỏ hàng

  const items: TabItem[] = state.routes.map((route) => ({
    key: route.key,
    label: descriptors[route.key].options.title ?? route.name,
    emoji: EMOJI[route.name] ?? "•",
    badge: route.name === "Cart" ? totalQuantity : undefined, // ← BT7.3e: gắn badge cho tab Cart
  }));

  const onPress = (key: string) => {
    const route = state.routes.find((r) => r.key === key);
    if (!route) return;

    const isFocused = state.routes[state.index].key === key;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <TabBar
      items={items}
      activeKey={state.routes[state.index].key}
      onPress={onPress}
    />
  );
}