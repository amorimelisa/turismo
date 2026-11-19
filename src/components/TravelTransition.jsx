import React from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
} from 'react-native-svg';

const logoAgencia = require('../../assets/imagem/logo.png');

export default function TravelTransition({ progresso, alturaTela }) {
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width * 0.46, 180);
  const logoHeight = logoWidth / 2.68;
  const alturaPainel = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [alturaTela * 0.34, alturaTela * 0.91],
    extrapolate: 'clamp',
  });
  const logoTop = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [
      alturaTela * 0.17 - logoHeight / 2,
      Math.max(18, alturaTela * 0.11 - logoHeight / 2),
    ],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.painel, { height: alturaPainel }]}
    >
      <View style={StyleSheet.absoluteFill}>
        <Svg
          width={width}
          height="100%"
          viewBox="0 0 390 844"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient id="spacerSky" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#2469B2" />
              <Stop offset="0.5" stopColor="#347FC3" />
              <Stop offset="1" stopColor="#58A5D8" />
            </LinearGradient>
          </Defs>
          <Path d="M0 0 H390 V844 H0 Z" fill="url(#spacerSky)" />
        </Svg>
      </View>

      <Animated.View
        style={[styles.logoSlot, { top: logoTop, height: logoHeight }]}
      >
        <Image
          source={logoAgencia}
          resizeMode="contain"
          style={{ width: logoWidth, height: logoHeight }}
          accessibilityLabel="Logo da agência"
        />
      </Animated.View>

      <View pointerEvents="none" style={styles.cloudBoundary}>
        <Svg
          width={width}
          height={60}
          viewBox="0 0 390 120"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient id="cloudDistant" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#7FA5C8" stopOpacity="0.5" />
              <Stop offset="0.54" stopColor="#C5D9E8" stopOpacity="0.78" />
              <Stop offset="1" stopColor="#F1F3F5" />
            </LinearGradient>
            <LinearGradient id="cloudBlue" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#A9C9E0" />
              <Stop offset="0.55" stopColor="#D8E7F0" />
              <Stop offset="1" stopColor="#F1F3F5" />
            </LinearGradient>
            <LinearGradient id="cloudShade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#7299BC" stopOpacity="0.58" />
              <Stop offset="0.55" stopColor="#B8D0E1" stopOpacity="0.76" />
              <Stop offset="1" stopColor="#F1F3F5" />
            </LinearGradient>
            <LinearGradient id="cloudWhite" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" />
              <Stop offset="0.5" stopColor="#FCFDFE" />
              <Stop offset="1" stopColor="#F1F3F5" />
            </LinearGradient>
            <RadialGradient id="cloudPuff" cx="34%" cy="22%" r="82%">
              <Stop offset="0" stopColor="#FFFFFF" />
              <Stop offset="0.58" stopColor="#FFFFFF" />
              <Stop offset="1" stopColor="#F8FAFC" />
            </RadialGradient>
            <RadialGradient id="cloudDepth" cx="50%" cy="38%" r="64%">
              <Stop offset="0" stopColor="#7698B7" stopOpacity="0.28" />
              <Stop offset="0.58" stopColor="#9BB8D0" stopOpacity="0.14" />
              <Stop offset="1" stopColor="#BFD2E1" stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id="cloudBody" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" />
              <Stop offset="0.42" stopColor="#FCFDFE" />
              <Stop offset="1" stopColor="#F1F3F5" />
            </LinearGradient>
          </Defs>

          <Path
            d="M0 23 C45 20 75 36 108 54 C143 73 171 80 198 81 C228 82 258 63 292 45 C328 26 359 22 390 25 V120 H0 Z"
            fill="url(#cloudDistant)"
          />
          <Path
            d="M0 31 C43 28 73 43 106 62 C140 82 170 89 198 90 C229 91 260 72 294 53 C329 34 360 30 390 33 V120 H0 Z"
            fill="url(#cloudBlue)"
          />
          <Ellipse cx="0" cy="38" rx="30" ry="18" fill="url(#cloudBlue)" />
          <Ellipse cx="52" cy="44" rx="39" ry="22" fill="url(#cloudBlue)" />
          <Ellipse cx="111" cy="61" rx="37" ry="20" fill="url(#cloudBlue)" />
          <Ellipse cx="278" cy="58" rx="35" ry="20" fill="url(#cloudBlue)" />
          <Ellipse cx="337" cy="43" rx="40" ry="21" fill="url(#cloudBlue)" />
          <Ellipse cx="392" cy="36" rx="29" ry="18" fill="url(#cloudBlue)" />

          <Ellipse cx="181" cy="79" rx="72" ry="37" fill="url(#cloudDepth)" />
          <Ellipse cx="169" cy="82" rx="38" ry="23" fill="url(#cloudShade)" />
          <Ellipse cx="206" cy="76" rx="39" ry="27" fill="url(#cloudShade)" />
          <Ellipse cx="239" cy="83" rx="34" ry="22" fill="url(#cloudShade)" />

          <Path
            d="M0 46 C43 43 73 55 108 72 C141 89 168 95 194 94 C222 94 253 80 288 64 C326 47 359 44 390 47 V120 H0 Z"
            fill="url(#cloudWhite)"
          />
          <Ellipse cx="0" cy="51" rx="31" ry="20" fill="url(#cloudPuff)" />
          <Ellipse cx="46" cy="56" rx="38" ry="23" fill="url(#cloudPuff)" />
          <Ellipse cx="105" cy="72" rx="40" ry="22" fill="url(#cloudPuff)" />
          <Ellipse cx="164" cy="83" rx="32" ry="22" fill="url(#cloudPuff)" />
          <Ellipse cx="185" cy="69" rx="34" ry="26" fill="url(#cloudPuff)" />
          <Ellipse cx="214" cy="71" rx="38" ry="27" fill="url(#cloudPuff)" />
          <Ellipse cx="238" cy="82" rx="29" ry="21" fill="url(#cloudPuff)" />
          <Ellipse cx="285" cy="69" rx="40" ry="22" fill="url(#cloudPuff)" />
          <Ellipse cx="346" cy="54" rx="39" ry="23" fill="url(#cloudPuff)" />
          <Ellipse cx="393" cy="51" rx="31" ry="20" fill="url(#cloudPuff)" />

          <Path
            d="M0 74 C36 72 68 77 101 84 C134 91 160 96 193 95 C228 94 259 88 291 79 C326 70 356 67 390 70 V120 H0 Z"
            fill="url(#cloudBody)"
          />
        </Svg>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  painel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'visible',
    backgroundColor: '#347FC3',
  },
  logoSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudBoundary: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -20,
    height: 60,
  },
});
