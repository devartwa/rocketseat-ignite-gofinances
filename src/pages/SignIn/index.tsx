import React, { useState } from 'react';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';

//SVGS
import Apple from '../../assets/apple.svg';
import Google from '../../assets/google.svg';
import Facebook from '../../assets/facebook.svg';
import Logo from '../../assets/logo-gofinances.svg';

export function SignIn() {
    const { googleAuth, appleAuth, facebookAuth } = useAuth();
    async function signInWithGoogle() {
        try {
            await googleAuth();
        } catch (error) {
            console.log(error);
        }
    }

    async function signInWithApple() {
        try {
            return await appleAuth();
        } catch (error) {
            console.log(error);
        }
    }

    async function signInWithFacebook() {
        try {
            return await facebookAuth();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <Logo
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>
                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        svg={Google}
                        title="Entrar com Google"
                        onPress={signInWithGoogle}
                    />

                    {Platform.OS === "ios" &&
                        <SignInSocialButton
                            svg={Apple}
                            title="Entrar com Apple"
                            onPress={signInWithApple}
                        />
                    }

                    <SignInSocialButton
                        svg={Facebook}
                        title="Entrar com Facebook"
                        onPress={signInWithFacebook}
                    />
                </FooterWrapper>
            </Footer>
        </Container>
    );
};