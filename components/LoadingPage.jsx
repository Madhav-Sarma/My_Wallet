import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, Animated, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS, THEMES } from "../constants/colors";

const LoadingPage = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const themeAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Detect current theme
  const getCurrentTheme = () => {
    for (const [themeName, themeColors] of Object.entries(THEMES)) {
      if (themeColors.background === COLORS.background && 
          themeColors.card === COLORS.card) {
        return themeName;
      }
    }
    return 'ocean'; // fallback
  };

  const currentTheme = getCurrentTheme();

  useEffect(() => {
    // Main fade and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the loading indicator
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Theme-specific animation
    const themeAnimation = Animated.loop(
      Animated.timing(themeAnim, {
        toValue: 1,
        duration: getThemeAnimationDuration(currentTheme),
        useNativeDriver: true,
      })
    );

    // Animated dots
    const createDotAnimation = (animValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const dotAnimations = dotsAnim.map((anim, index) =>
      createDotAnimation(anim, index * 200)
    );

    pulseAnimation.start();
    themeAnimation.start();
    dotAnimations.forEach(animation => animation.start());

    return () => {
      pulseAnimation.stop();
      themeAnimation.stop();
      dotAnimations.forEach(animation => animation.stop());
    };
  }, [fadeAnim, scaleAnim, pulseAnim, themeAnim, dotsAnim, currentTheme]);

  const getThemeAnimationDuration = (theme) => {
    const durations = {
      ocean: 3000,
      coffee: 4000,
      forest: 3500,
      purple: 2500,
      sunset: 3000,
      midnight: 5000,
      blossom: 2000,
    };
    return durations[theme] || 3000;
  };

  const getThemeMessage = (theme) => {
    const messages = {
      ocean: "Diving into your financial ocean...",
      coffee: "Brewing your financial insights...",
      forest: "Growing your financial forest...",
      purple: "Crafting your financial magic...",
      sunset: "Painting your financial horizon...",
      midnight: "Illuminating your financial stars...",
      blossom: "Blooming your financial garden...",
    };
    return messages[theme] || "Please wait while we prepare everything for you";
  };

  const renderThemeElements = () => {
    switch (currentTheme) {
      case 'ocean':
        return (
          <Animated.View
            style={[
              loadingStyles.themeContainer,
              {
                transform: [
                  {
                    translateX: themeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 50],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[loadingStyles.themeElement, loadingStyles.wave1]} />
            <View style={[loadingStyles.themeElement, loadingStyles.wave2]} />
          </Animated.View>
        );

      case 'coffee':
        return (
          <Animated.View style={loadingStyles.themeContainer}>
            {[...Array(5)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  loadingStyles.coffeeBean,
                  {
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 60}%`,
                    transform: [
                      {
                        rotate: themeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'forest':
        return (
          <Animated.View style={loadingStyles.themeContainer}>
            {[...Array(6)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  loadingStyles.leaf,
                  {
                    left: `${10 + i * 13}%`,
                    top: `${5 + Math.random() * 80}%`,
                    transform: [
                      {
                        translateY: themeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 20],
                        }),
                      },
                      {
                        rotate: themeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '15deg'],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'purple':
        return (
          <Animated.View style={loadingStyles.themeContainer}>
            {[...Array(8)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  loadingStyles.magicSparkle,
                  {
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    transform: [
                      {
                        scale: themeAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 1.2, 0.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'sunset':
        return (
          <Animated.View
            style={[
              loadingStyles.themeContainer,
              {
                opacity: themeAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.8, 0.3],
                }),
              },
            ]}
          >
            <View style={[loadingStyles.sunsetSun]} />
            <View style={[loadingStyles.sunsetGlow]} />
          </Animated.View>
        );

      case 'midnight':
        return (
          <Animated.View style={loadingStyles.themeContainer}>
            {[...Array(12)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  loadingStyles.star,
                  {
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 90 + 5}%`,
                    opacity: themeAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.2, 1, 0.2],
                    }),
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      case 'blossom':
        return (
          <Animated.View style={loadingStyles.themeContainer}>
            {[...Array(10)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  loadingStyles.petal,
                  {
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    transform: [
                      {
                        translateY: themeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 30],
                        }),
                      },
                      {
                        rotate: themeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '180deg'],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.loadingContainer, loadingStyles.overlay]}>
      {/* Background gradient effect */}
      <View style={loadingStyles.backgroundGradient} />
      
      {/* Theme-specific elements */}
      {renderThemeElements()}
      
      {/* Floating particles */}
      <View style={loadingStyles.particlesContainer}>
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              loadingStyles.particle,
              {
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              }
            ]}
          />
        ))}
      </View>

      {/* Main loading content */}
      <Animated.View
        style={[
          loadingStyles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Pulsing circle behind spinner */}
        <Animated.View
          style={[
            loadingStyles.pulseCircle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Main loading spinner */}
        <View style={loadingStyles.spinnerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>

        {/* Loading text with animated dots */}
        <View style={loadingStyles.textContainer}>
          <Text style={loadingStyles.loadingText}>Loading</Text>
          <View style={loadingStyles.dotsContainer}>
            {dotsAnim.map((anim, index) => (
              <Animated.Text
                key={index}
                style={[
                  loadingStyles.dot,
                  {
                    opacity: anim,
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -5],
                        }),
                      },
                    ],
                  },
                ]}
              >
                .
              </Animated.Text>
            ))}
          </View>
        </View>

        {/* Theme-specific subtitle */}
        <Animated.Text
          style={[
            loadingStyles.subtitle,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8],
              }),
            },
          ]}
        >
          {getThemeMessage(currentTheme)}
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const loadingStyles = {
  overlay: {
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
  themeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    opacity: 0.2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  pulseCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },
  spinnerContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 50,
    padding: 20,
    marginBottom: 32,
    zIndex: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  dot: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginHorizontal: 1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    fontWeight: '500',
  },
  
  // Ocean theme
  themeElement: {
    position: 'absolute',
  },
  wave1: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    opacity: 0.6,
  },
  wave2: {
    bottom: 10,
    left: 25,
    right: 25,
    height: 40,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    opacity: 0.2,
  },
  
  // Coffee theme
  coffeeBean: {
    position: 'absolute',
    width: 12,
    height: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    opacity: 0.3,
  },
  
  // Forest theme
  leaf: {
    position: 'absolute',
    width: 8,
    height: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    opacity: 0.4,
  },
  
  // Purple theme
  magicSparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    opacity: 0.6,
  },
  
  // Sunset theme
  sunsetSun: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    opacity: 0.3,
  },
  sunsetGlow: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -50,
    width: 100,
    height: 100,
    backgroundColor: COLORS.card,
    borderRadius: 50,
    opacity: 0.2,
  },
  
  // Midnight theme
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  
  // Blossom theme
  petal: {
    position: 'absolute',
    width: 6,
    height: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    opacity: 0.4,
  },
};

export default LoadingPage;