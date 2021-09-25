import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(113)}px;
    background-color: ${({ theme }) => theme.colors.primary};
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 19px;
`;
export const Title = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
`;

export const Content = styled.ScrollView.attrs({
    contentContainerStyle: { flex: 1, padding: 24 },
})``;

export const ContainerLoading = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const Loading = styled.ActivityIndicator``;

export const EmptyView = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const EmptyText = styled.Text`
    margin-top: 25px;
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({ theme }) => theme.colors.primary}
`;
