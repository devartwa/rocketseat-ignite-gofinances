import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface TypeProps {
    type: 'up' | 'down';
    isActive: boolean;
}

export const Container = styled.View<TypeProps>`
    width: 48%;
    border-width: ${({ isActive }) => isActive ? 0 : 1.5}px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.text};
    border-radius: 5px;

    ${({ isActive, type }) => isActive && type === 'up' && css`
        background-color: ${({ theme }) => theme.colors.success_light};
    `};

    ${({ isActive, type }) => isActive && type === 'down' && css`
        background-color: ${({ theme }) => theme.colors.attention_light};
    `};
`;

export const Button = styled(RectButton)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 16px;
`;

export const Icon = styled(Feather) <TypeProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;

    color: ${({ isActive, theme, type }) => {
        if (isActive && type === 'down') {
            return theme.colors.shape;
        } else if (type === 'down') {
            return theme.colors.attention;
        } else if (isActive && type === 'up') {
            return theme.colors.shape;
        } else {
            return theme.colors.success;
        }
    }};
`;

export const Title = styled.Text<TypeProps>`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};

    ${({ isActive, type }) => isActive && type === 'up' && css`
        color: ${({ theme }) => theme.colors.shape};
    `};

    ${({ isActive, type }) => isActive && type === 'down' && css`
        color: ${({ theme }) => theme.colors.shape};
    `};
`;