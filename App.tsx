import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import { Routes } from './src/routes';
import {
    useFonts,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/hooks/auth';

export default function App() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold
    });

    const { userLoading } = useAuth();

    if (!fontsLoaded || userLoading) {
        return <AppLoading />
    }

    return (
        <ThemeProvider theme={theme}>
            <StatusBar style="light" />
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </ThemeProvider>
    )
}

