import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryCard } from '../../components/HistoryCard';
import NoData from '../../assets/no-data.svg';

import {
    Container,
    Header,
    Title,
    ContainerLoading,
    Loading,
    EmptyText,
    EmptyView,
    Content,
} from './styles';

import theme from '../../global/styles/theme';
import { categories } from '../../utils/categories';

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
    total: string;
    color: string;
}

export function Resume() {
    const [loading, setLoading] = useState(true);
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    async function loadData() {
        const data = await AsyncStorage.getItem('@gofinances:transactions');
        const responseFormatted = data ? JSON.parse(data) : [];

        const expensives = responseFormatted
            .filter((expensive: TransactionData) => expensive.type === 'negative');

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

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total,
                });
            }
        });

        setLoading(false);
        setTotalByCategories(totalByCategory);
    }

    useEffect(() => {
        loadData();
    }, [])
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
                            totalByCategories === null || totalByCategories.length <= 0
                                ?
                                <Container>
                                    <Header>
                                        <Title>Resumo por categoria</Title>
                                    </Header>

                                    <EmptyView>
                                        <NoData width="150" height="150" />
                                        <EmptyText>Não há itens a serem exibidos.</EmptyText>
                                    </EmptyView>

                                </Container>
                                :
                                <Container>
                                    <Header>
                                        <Title>Resumo por categoria</Title>
                                    </Header>
                                    <Content >
                                        {totalByCategories.map(item =>
                                            <HistoryCard
                                                key={item.key}
                                                title={item.name}
                                                amount={item.total}
                                                color={item.color}
                                            />
                                        )}
                                    </Content>
                                </Container>
                        }
                    </>
            }
        </>
    );
};