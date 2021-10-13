import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../../components/HistoryCard';
import NoData from '../../assets/no-data.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';
import { categories } from '../../utils/categories';
import { useFocusEffect } from '@react-navigation/core';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    Title,
    ContainerLoading,
    Loading,
    EmptyText,
    EmptyView,
    Content,
    ChartContainer,
    Month,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
} from './styles';


interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const isMounted = React.useRef(true);

    function handleDateChange(action: 'next' | 'prev') {
        setLoading(true);
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        } else {
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }

    async function loadData() {
        const data = await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`);
        const responseFormatted = data ? JSON.parse(data) : [];

        const expensives = responseFormatted
            .filter((expensive: TransactionData) =>
                expensive.type === 'negative' &&
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            );

        const expensiveTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
            return acumullator + Number(expensive.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            });
            if (categorySum > 0) {
                const total = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })

                const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    totalFormatted: total,
                    total: categorySum,
                    percent,
                });
            }
        });

        setTotalByCategories(totalByCategory);
        setLoading(false);
    }

    useFocusEffect(useCallback(() => {
        loadData();

        return () => {
            isMounted.current = false;
        };
    }, [selectedDate]));

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            <MonthSelect>
                <MonthSelectButton onPress={() => handleDateChange('prev')}>
                    <MonthSelectIcon name="chevron-left" />
                </MonthSelectButton>

                <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

                <MonthSelectButton onPress={() => handleDateChange('next')}>
                    <MonthSelectIcon name="chevron-right" />
                </MonthSelectButton>
            </MonthSelect>

            {
                loading ?
                    <ContainerLoading>
                        <Loading size="small" color={theme.colors.primary} />
                    </ContainerLoading>
                    :
                    <React.Fragment>
                        {
                            totalByCategories === null || totalByCategories.length <= 0
                                ?
                                <EmptyView>
                                    <NoData width="150" height="150" />
                                    <EmptyText>Não há itens a serem exibidos.</EmptyText>
                                </EmptyView>
                                :
                                <React.Fragment>
                                    <ChartContainer>
                                        <VictoryPie
                                            data={totalByCategories}
                                            colorScale={totalByCategories.map(category => category.color)}
                                            style={{
                                                labels: {
                                                    fontSize: RFValue(18),
                                                    fontWeight: 'bold',
                                                    fill: theme.colors.shape,
                                                }
                                            }}
                                            height={325}
                                            labelRadius={50}
                                            x="percent"
                                            y="total"
                                        />
                                    </ChartContainer>
                                    <Content
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{
                                            paddingHorizontal: 24,
                                        }}
                                    >
                                        {totalByCategories.map(item =>
                                            <HistoryCard
                                                key={item.key}
                                                title={item.name}
                                                amount={item.totalFormatted}
                                                color={item.color}
                                            />
                                        )}
                                    </Content>
                                </React.Fragment>
                        }
                    </React.Fragment>
            }
        </Container >
    );
};