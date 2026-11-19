import { Link, usePathname } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { VooaColors } from '@/constants/theme';

const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'Explorar', href: '/explore' },
  { label: 'Ofertas', href: '/ofertas' },
  { label: 'Diário', href: '/diario' },
  { label: 'Histórias', href: '/historias' },
  { label: 'Memórias', href: '/diario-inicio' },
  { label: 'Conta', href: '/conta' },
];

function HeaderLink({ label, href, active, compact }) {
  const [indicatorOpacity] = useState(
    () => new Animated.Value(active ? 1 : 0)
  );
  const hovered = useRef(false);

  const animateIndicator = visible => {
    Animated.timing(indicatorOpacity, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  useEffect(() => {
    if (!hovered.current) {
      Animated.timing(indicatorOpacity, {
        toValue: active ? 1 : 0,
        duration: 180,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [active, indicatorOpacity]);

  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        onHoverIn={() => {
          hovered.current = true;
          animateIndicator(true);
        }}
        onHoverOut={() => {
          hovered.current = false;
          animateIndicator(active);
        }}
        onFocus={() => animateIndicator(true)}
        onBlur={() => animateIndicator(active)}
        style={StyleSheet.flatten([styles.link, compact && styles.compactLink])}>
        <Text
          style={[
            styles.linkText,
            compact && styles.compactLinkText,
            active && styles.activeLinkText,
          ]}>
          {label}
        </Text>
        <Animated.View
          style={[
            styles.activeIndicator,
            compact && styles.compactActiveIndicator,
            { opacity: indicatorOpacity },
          ]}
        />
      </Pressable>
    </Link>
  );
}

export default function Header({ showNavigation = Platform.OS === 'web' }) {
  const pathname = usePathname();
  const isCompact = useWindowDimensions().width <= 480;

  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <View
        style={[
          styles.content,
          isCompact && styles.compactContent,
        ]}>
        <Text
          accessibilityRole="header"
          style={[styles.brand, isCompact && styles.compactBrand]}>
          Vooa
        </Text>

        {showNavigation && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[
              styles.navigationScroll,
              isCompact && styles.compactNavigationScroll,
            ]}
            contentContainerStyle={[
              styles.navigation,
              isCompact && styles.compactNavigation,
            ]}>
            {navigationLinks.map(({ label, href }) => {
              const active =
                href === '/'
                  ? pathname === '/'
                  : pathname === href || pathname.startsWith(`${href}/`);

              return (
                <HeaderLink
                  key={href}
                  label={label}
                  href={href}
                  active={active}
                  compact={isCompact}
                />
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: VooaColors.white,
    borderBottomColor: VooaColors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    width: '100%',
    maxWidth: 1200,
    height: 68,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactContent: {
    height: 50,
    paddingHorizontal: 14,
  },
  brand: {
    color: VooaColors.navy,
    fontSize: 23,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  compactBrand: {
    fontSize: 18,
    letterSpacing: 0.8,
  },
  navigation: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
    justifyContent: 'flex-end',
  },
  navigationScroll: {
    flex: 1,
    marginLeft: 12,
  },
  compactNavigationScroll: {
    marginLeft: 6,
  },
  compactNavigation: {
    gap: 8,
  },
  link: {
    height: 68,
    minWidth: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactLink: {
    height: 50,
    minWidth: 38,
  },
  linkText: {
    color: VooaColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  compactLinkText: {
    fontSize: 11,
  },
  activeLinkText: {
    color: VooaColors.navy,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: VooaColors.navy,
  },
  compactActiveIndicator: {
    bottom: 7,
  },
});
