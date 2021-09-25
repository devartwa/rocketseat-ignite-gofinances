import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/core";
import React, { useState, useEffect, useCallback } from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import theme from "../../global/styles/theme";
import NoData from '../../assets/no-data.svg';
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
    LogoutButton,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    ContainerLoading,
    Loading,
    EmptyView,
    EmptyText,
    TitleWrapper,
    ClearButton,
    ClearText,
} from "./styles";
import { Alert } from "react-native";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}
interface HighlightData {
    entries: HighlightProps;
    expensive: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [data, setData] = useState<DataListProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [highlightData, setHighlignData] = useState({} as HighlightData);

    async function loadTransactions() {
        const data = await AsyncStorage.getItem('@gofinances:transactions');
        const transactions = data ? JSON.parse(data) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map(
            (item: DataListProps) => {
                if (item.type === "positive") {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                const amount = Number(item.amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount: amount,
                    type: item.type,
                    category: item.category,
                    date: date,
                }
            });

        setData(transactionsFormatted);

        let total = entriesTotal - expensiveTotal;

        setHighlignData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }
        })

        setLoading(false);
    }

    async function clearTransactions() {
        Alert.alert(
            "Cuidado! Suas ações não poderão ser desfeitas.",
            "Tem certeza que deseja limpar as transações?",
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        await AsyncStorage.removeItem('@gofinances:transactions');
                        setData([]);
                    },
                    style: 'destructive'
                }
            ]
        );
    }

    useEffect(() => {
        loadTransactions();
    }, [data]);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <>
            {
                loading
                    ?
                    <ContainerLoading>
                        <Loading size="small" color={theme.colors.primary} />
                    </ContainerLoading>
                    :
                    <>
                        {
                            data === null || data.length <= 0
                                ?

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
                                            <LogoutButton onPress={() => { }}>
                                                <Icon name="power" />
                                            </LogoutButton>
                                        </UserWrapper>
                                    </Header>

                                    <HighlightCards>
                                        <HighlightCard
                                            type="up"
                                            title="Entradas"
                                            amount={highlightData.entries.amount}
                                            lastTransaction="Última entrada dia 13 de abril"
                                        />
                                        <HighlightCard
                                            type="down"
                                            title="Saídas"
                                            amount={highlightData.expensive.amount}
                                            lastTransaction="Saída dia 10 de abril"
                                        />
                                        <HighlightCard
                                            type="total"
                                            title="Total"
                                            amount={highlightData.total.amount}
                                            lastTransaction="Última saída dia 11 de abril"
                                        />
                                    </HighlightCards>

                                    <Transactions>
                                        <TitleWrapper>
                                            <Title>Listagem</Title>
                                            {
                                                data.length > 0 && <ClearButton onPress={clearTransactions}>
                                                    <ClearText>Limpar</ClearText>
                                                </ClearButton>
                                            }
                                        </TitleWrapper>
                                        <EmptyView>
                                            <NoData width="150" height="150" />
                                            <EmptyText>Não há itens a serem exibidos.</EmptyText>
                                        </EmptyView>
                                    </Transactions>
                                </Container>
                                :
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
                                            <LogoutButton onPress={() => { }}>
                                                <Icon name="power" />
                                            </LogoutButton>
                                        </UserWrapper>
                                    </Header>

                                    <HighlightCards>
                                        <HighlightCard
                                            type="up"
                                            title="Entradas"
                                            amount={highlightData.entries.amount}
                                            lastTransaction="Última entrada dia 13 de abril"
                                        />
                                        <HighlightCard
                                            type="down"
                                            title="Saídas"
                                            amount={highlightData.expensive.amount}
                                            lastTransaction="Saída dia 10 de abril"
                                        />
                                        <HighlightCard
                                            type="total"
                                            title="Total"
                                            amount={highlightData.total.amount}
                                            lastTransaction="Última saída dia 11 de abril"
                                        />
                                    </HighlightCards>

                                    <Transactions>
                                        <TitleWrapper>
                                            <Title>Listagem</Title>
                                            <ClearButton onPress={clearTransactions}>
                                                <ClearText>Limpar</ClearText>
                                            </ClearButton>
                                        </TitleWrapper>
                                        <TransactionsList
                                            data={data}
                                            keyExtractor={item => item.id}
                                            renderItem={({ item }) => <TransactionCard data={item} />}
                                        />
                                    </Transactions>
                                </Container>
                        }
                    </>
            }
        </>
    );
}
