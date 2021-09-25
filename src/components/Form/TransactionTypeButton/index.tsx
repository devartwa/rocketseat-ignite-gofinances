import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import {
    Container,
    Icon,
    Title,
    Button,
} from './styles';

const icons = {
    positive: 'arrow-up-circle',
    negative: 'arrow-down-circle'
}

interface Props extends RectButtonProps {
    type: 'positive' | 'negative'
    title: string;
    isActive: boolean;
}

export function TransactionTypeButton({ type, title, isActive, ...rest }: Props) {
    return (
        <Container isActive={isActive} type={type}>
            <Button {...rest}>
                <Icon type={type} isActive={isActive} name={icons[type]} />
                <Title type={type} isActive={isActive}>{title} </Title>
            </Button>
        </Container>
    );
};