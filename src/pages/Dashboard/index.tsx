import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
} from './styles';

export function Dashboard() {
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: "https://avatars.githubusercontent.com/u/49029304?v=4" }} />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Arthur</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power" />
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard
                    type="up"
                    title="Entradas"
                    amount="R$ 1.000,00"
                    lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount="R$ 500,00"
                    lastTransaction="Saída dia 10 de abril"
                />
                <HighlightCard
                    type="total"
                    title="Saídas"
                    amount="R$ 500,00"
                    lastTransaction="Última saída dia 11 de abril"
                />
            </HighlightCards>
        </Container>
    );
};