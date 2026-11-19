import { Link, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
  { route: '/', label: 'Início', icon: 'home', matches: ['/'] },
  { route: '/explore', label: 'Explorar', icon: 'compass', matches: ['/explore', '/historias'] },
  { route: '/ofertas', label: 'Ofertas', icon: 'ticket', matches: ['/ofertas'] },
  { route: '/diario', label: 'Diário', icon: 'book', matches: ['/diario', '/diario-inicio'] },
  { route: '/conta', label: 'Conta', icon: 'user-o', matches: ['/conta'] },
];

export default function RouteTabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      {tabs.map(({ route, label, icon, matches }) => {
        const selected = matches.includes(pathname);

        return (
          <Link key={route} href={route} asChild>
            <Pressable
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected }}
              style={styles.tab}
            >
              <FontAwesome
                name={icon}
                size={20}
                color={selected ? colors.active : colors.inactive}
              />
              <Text style={[styles.label, selected && styles.selectedLabel]}>
                {label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const colors = {
  background: '#303B59',
  border: '#465373',
  active: '#4BAFB3',
  inactive: '#D5D9E3',
};

const styles = StyleSheet.create({
  bar: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 2,
  },
  label: {
    color: colors.inactive,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  selectedLabel: {
    color: colors.active,
  },
});
