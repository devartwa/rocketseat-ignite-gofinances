import React from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
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
    Transactions,
    Title,
    TransactionsList
} from "./styles";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const values: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: "Desenvolvimento de site",
            amount: "R$ 15.000,00",
            category: {
                name: "Vendas",
                icon: "dollar-sign",
            },
            date: "16/09/1994",
        },
        {
            id: '2',
            type: 'negative',
            title: "Pizza",
            amount: "R$ 59,00",
            category: {
                name: "Alimentação",
                icon: "coffee",
            },
            date: "16/09/1994",
        },
        {
            id: '3',
            type: 'negative',
            title: "Aluguel",
            amount: "R$ 1.000,00",
            category: {
                name: "Casa",
                icon: "home",
            },
            date: "16/09/1994",
        },
    ];
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{
                                uri: "https://avatars.githubusercontent.com/u/49029304?v=4",
                            }}
                        />
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

            <Transactions>
                <Title>Listagem</Title>
                <TransactionsList
                    data={values}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>
        </Container>
    );
}
