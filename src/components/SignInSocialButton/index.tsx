import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';
import theme from '../../global/styles/theme';

import {
    Button,
    ImageContainer,
    Title,
    TitleLoading,
} from './styles';

interface Props extends RectButtonProps {
    title: string;
    svg: React.FC<SvgProps>;
}

export function SignInSocialButton({ title, svg: Svg, ...rest }: Props) {
    return (
        <Button {...rest}>
            <ImageContainer>
                <Svg />
            </ImageContainer>
            <Title>
                {title}
            </Title>
        </Button>
    );
};