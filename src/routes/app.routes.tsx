import React from "react";
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'styled-components'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Pages
import { Dashboard } from '../pages/Dashboard';
import { Register } from '../pages/Register';
import { Resume } from '../pages/Resume';
import { getBottomSpace } from "react-native-iphone-x-helper";
import { Platform } from "react-native";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {

    const theme = useTheme();

    return (
        <Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.colors.secondary,
                tabBarInactiveTintColor: theme.colors.text,
                tabBarLabelPosition: 'beside-icon',
                headerShown: false,
                tabBarStyle: {
                    paddingVertical: Platform.OS === "ios" ? 20 : 0,
                    height: getBottomSpace() + 68,
                }
            }}
        >
            <Screen
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <Screen
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="attach-money"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <Screen
                name="Resumo"
                component={Resume}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="pie-chart"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
        </Navigator>
    );
};