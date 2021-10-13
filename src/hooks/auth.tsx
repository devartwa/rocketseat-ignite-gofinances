import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Facebook from 'expo-facebook';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

//google
const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

//facebook
const { APP_ID } = process.env;

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthResponse {
    params: {
        access_token: string;
    };
    type: string;
}

interface AuthContextData {
    user: User;
    userLoading: boolean;
    googleAuth(): Promise<void>;
    appleAuth(): Promise<void>;
    facebookAuth(): Promise<void>;
    signOut(): Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const [userLoading, setUserLoading] = useState(true);

    async function googleAuth() {
        try {
            const RESPONSE_TYPE = "token";
            const SCOPE = encodeURI("profile email");

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession.startAsync({ authUrl }) as AuthResponse;

            if (type === "success") {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();

                const userLogged = {
                    id: String(userInfo.id),
                    email: userInfo.email,
                    name: userInfo.name,
                    photo: userInfo.picture,
                };
                setUser(userLogged);
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async function appleAuth() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            });

            if (credential) {
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name: credential.fullName!.givenName!,
                    photo: `https://ui-avatars.com/api/?name=${credential.fullName?.givenName}+${credential.fullName?.familyName}&length=2`,
                };
                setUser(userLogged);
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async function facebookAuth() {
        try {

            await Facebook.initializeAsync({
                appId: Platform.OS === 'android' ? `${APP_ID}` : APP_ID,
            });

            const response = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });

            if (response.type === 'success') {
                const req = await fetch(`https://graph.facebook.com/me?access_token=${response.token}&fields=id,name,email,picture`);
                const userInfo = await req.json();
                const userLogged = {
                    id: String(userInfo.id),
                    email: userInfo.email,
                    name: userInfo.name,
                    photo: userInfo.picture.data.url,
                };
                setUser(userLogged);
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async function signOut() {
        setUser({} as User);
        await AsyncStorage.removeItem('@gofinances:user');
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStoraged = await AsyncStorage.getItem('@gofinances:user');
            if (userStoraged) {
                const userLogged = JSON.parse(userStoraged) as User;
                setUser(userLogged);
            }
            setUserLoading(false);
        }
        loadUserStorageData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userLoading, googleAuth, appleAuth, facebookAuth, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth };
