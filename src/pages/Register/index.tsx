import React, { useState, useCallback } from 'react';
import { InputForm } from '../../components/Form/InputForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';
import { useFocusEffect } from '@react-navigation/core';
import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsType,
    CategoryModal
} from './styles';
interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('O campo de nome é obrigatório!'),
    amount: Yup
        .number()
        .positive('O valor não pode ser um número negativo!')
        .required('O campo de preço é obrigatório!')
});

export function Register() {
    const { user } = useAuth();
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });

    const isMounted = React.useRef(true);

    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {
        if (!transactionType)
            return Alert.alert('Derrr.. parece que você esqueceu algum campo:', 'Por favor, selecione o tipo de transação.');

        if (category.key === 'category')
            return Alert.alert('Derrr.. parece que você esqueceu algum campo:', 'Por favor, selecione uma categoria.');

        const data = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const oldData = await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`);
            const transactionsData = oldData ? JSON.parse(oldData) : [];

            const dataFormatted = [
                ...transactionsData,
                data
            ];

            await AsyncStorage.setItem(`@gofinances:transactions_user:${user.id}`, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Item cadastrado com sucesso! 😊',
                visibilityTime: 2500,
                autoHide: true,
            });

        } catch (error) {
            console.log(error);

            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Infelizmente seu item não foi cadastrado! 😔',
                visibilityTime: 2500,
                autoHide: true,
            });
        }
    }

    useFocusEffect(useCallback(() => {
        reset();
        setTransactionType('');
        setCategory({
            key: 'category',
            name: 'Categoria'
        });

        return () => {
            isMounted.current = false;
        };
    }, []));

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionsType>
                            <TransactionTypeButton
                                type="positive"
                                title="Income"
                                onPress={() => handleTransactionsTypeSelect('positive')}
                                isActive={transactionType === "positive"}
                            />

                            <TransactionTypeButton
                                type="negative"
                                title="Outcome"
                                onPress={() => handleTransactionsTypeSelect('negative')}
                                isActive={transactionType === "negative"}
                            />
                        </TransactionsType>

                        <CategorySelectButton
                            onPress={handleOpenSelectCategoryModal}
                            title={category.name}
                        />
                    </Fields>

                    <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
                </Form>
                <CategoryModal visible={categoryModalOpen} >
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </CategoryModal>

                <Toast ref={(ref) => Toast.setRef(ref)} />
            </Container>
        </TouchableWithoutFeedback>
    );
};