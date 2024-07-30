import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from "react-native";
export function PulseLoader({ isLoaderInAction = false }) {
    const dots = 3;
    const timeOut = 500;
    const animations = useRef(new Array(dots).fill(0).map(() => new Animated.Value(0))).current;
    const animate = () => {
        const fadeInSequence = animations.map((animation, index) =>
            Animated.timing(animation, {
                toValue: 1, 
                duration: timeOut, 
                useNativeDriver: true, 
                delay: index * timeOut, 
            })
        );
        const fadeOutSequence = animations.map((animation, index) =>
            Animated.timing(animation, {
                toValue: 0,
                duration: timeOut,
                useNativeDriver: true,
                delay: index * timeOut,
            })
        );

        Animated.loop(
            Animated.sequence([
                Animated.sequence(fadeInSequence),
                Animated.delay(timeOut),
                Animated.sequence(fadeOutSequence),
                Animated.delay(timeOut)
            ])
        ).start();
    };

    useEffect(() => {isLoaderInAction ? animate() : animations.forEach(animation => animation.setValue(0));}, [isLoaderInAction]);
    return (
        <View style={{ display: "flex", flexDirection: "row", width: "100%", paddingHorizontal: 40, alignItems: "center" }}>
            <View style={{ display: "flex", flexDirection: "row", width: "65%" }}>
                {animations.map((animation, i) => (
                    <Animated.View
                        key={i}
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: "#3D9C91",
                            borderRadius: 50,
                            marginHorizontal: 5,
                            opacity: animation,
                        }}
                    />
                ))}

            </View>
            <View style={{ display: "flex", flexDirection: "row", width: "35%" }}>
                {isLoaderInAction && (<Text style={{ color: "#DD7C2E", fontSize: 16, fontWeight: '600' }}>Please wait...</Text>)}

            </View>
        </View>
    )
}