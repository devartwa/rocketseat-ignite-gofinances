import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/core";
import React, { useState, useEffect, useCallback } from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { Alert } from "react-native";
import { useAuth } from "../../hooks/auth";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import theme from "../../global/styles/theme";
import NoData from "../../assets/no-data.svg";
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

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  date: string;
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
  const { signOut, user } = useAuth();

  const isMounted = React.useRef(true);

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    const collectionFilttered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFilttered.length === 0) return 0;

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFilttered.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    if (lastTransaction)
      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
        "pt-BR",
        { month: "long" }
      )}`;
  }

  async function loadTransactions() {
    const data = await AsyncStorage.getItem(
      `@gofinances:transactions_user:${user.id}`
    );

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

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount: amount,
          type: item.type,
          category: item.category,
          date: date,
        };
      }
    );

    setData(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactionExpensives = getLastTransactionDate(
      transactions,
      "negative"
    );

    const totalInterval =
      lastTransactionExpensives === 0
        ? "Não há transações de saída"
        : `Período: 01 a ${lastTransactionExpensives}`;

    let total = entriesTotal - expensiveTotal;

    setHighlignData({
      entries: {
        amount: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        date:
          lastTransactionEntries !== 0
            ? `Última entrada dia ${lastTransactionEntries}`
            : "Não há transações",
      },
      expensive: {
        amount: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        date:
          lastTransactionExpensives !== 0
            ? `Última saída dia ${lastTransactionExpensives}`
            : "Não há transações",
      },
      total: {
        amount: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        date: totalInterval,
      },
    });

    setLoading(false);
  }

  async function clearTransactions() {
    Alert.alert(
      "Cuidado! Essa ação não poderá ser desfeita.",
      "Tem certeza que deseja limpar as suas transações?",
      [
        {
          text: "Cancelar",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            await AsyncStorage.removeItem(
              `@gofinances:transactions_user:${user.id}`
            );
            setData([]);
            setHighlignData({
              entries: {
                amount: 'R$ 0,00',
                date: 'Não há transações',
              },
              expensive: {
                amount: 'R$ 0,00',
                date: 'Não há transações',
              },
              total: {
                amount: 'R$ 0,00',
                date: 'Não há transações',
              },
            });
          },
          style: "destructive",
        },
      ]
    );
  }

  async function handleSignOut() {
    Alert.alert(
      "Ops! Parece que você está de saída.",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: signOut,
          style: "destructive",
        },
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();

      return () => {
        isMounted.current = false;
      };
    }, [])
  );

  return (
    <React.Fragment>
      {loading ? (
        <ContainerLoading>
          <Loading size="small" color={theme.colors.primary} />
        </ContainerLoading>
      ) : (
        <Container>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={handleSignOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.date}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.expensive.amount}
              lastTransaction={highlightData.expensive.date}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.date}
            />
          </HighlightCards>

          {data === null || data.length <= 0 ? (
            <Transactions>
              <TitleWrapper>
                <Title>Listagem</Title>
                {data.length > 0 && (
                  <ClearButton onPress={clearTransactions}>
                    <ClearText>Limpar</ClearText>
                  </ClearButton>
                )}
              </TitleWrapper>
              <EmptyView>
                <NoData width="150" height="150" />
                <EmptyText>Não há itens a serem exibidos.</EmptyText>
              </EmptyView>
            </Transactions>
          ) : (
            <Transactions>
              <TitleWrapper>
                <Title>Listagem</Title>
                <ClearButton onPress={clearTransactions}>
                  <ClearText>Limpar</ClearText>
                </ClearButton>
              </TitleWrapper>
              <TransactionsList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />
            </Transactions>
          )}
        </Container>
      )}
    </React.Fragment>
  );
}
