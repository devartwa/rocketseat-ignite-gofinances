import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface ActiveProps {
    isActive: boolean;
}

export const Container = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(113)}px;
    background-color: ${({ theme }) => theme.colors.primary};
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 19px;
`;
export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.colors.shape};
`;

export const Category = styled.TouchableOpacity<ActiveProps>`
    width: 100%;
    padding: ${RFValue(15)}px;
    flex-direction: row;
    align-items: center;
    background-color: ${({ isActive, theme }) => isActive ? theme.colors.secondary : theme.colors.background};
`;
export const Icon = styled(Feather) <ActiveProps>`
    font-size: ${RFValue(20)}px;
    margin-right: 16px;
    color: ${({ isActive, theme }) => isActive ? theme.colors.shape : theme.colors.text};
`;
export const Name = styled.Text<ActiveProps>`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${({ isActive, theme }) => isActive ? theme.colors.shape : theme.colors.text};
`;

export const Divider = styled.View<ActiveProps>`
    height: 1px;
    width: 100%;
    align-self: center;
    background-color: ${({ isActive, theme }) => isActive ? theme.colors.secondary : theme.colors.text};
`;

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;