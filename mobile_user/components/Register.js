import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    StatusBar,
    TextInput,
    SafeAreaView,
    Keyboard,
    TouchableOpacity,
    Alert
} from 'react-native';

import { user } from '../helpers/Global';
import { servers, ports } from '../helpers/Server';

export default class Register extends Component {
    state = {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordConfirm: ''
    };

    checkRegister(navigation) {
        const {
            email,
            firstName,
            lastName,
            password,
            passwordConfirm
        } = this.state;

        const details = {
            email,
            firstName,
            lastName,
            password,
            passwordConfirm
        };

        let formBody = [];
        for (const property in details) {
            if (property) {
                const encodedKey = encodeURIComponent(property);
                const encodedValue = encodeURIComponent(details[property]);
                formBody.push(`${encodedKey}=${encodedValue}`);
            }
        }
        formBody = formBody.join('&');
        const uri = `http://${servers.devURI}:${ports.devPort}/auth/register`;

        fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: formBody
        })
            .then((response) => {
                if (response.status === 200) {
                    const data = JSON.parse(response._bodyInit);
                    if (data) {
                        user.email = data.email;
                        user.firstName = data.firstName;
                        user.lastName = data.lastName;
                        user.phone = data.phone;
                        user.photoUrl = data.photoUrl;
                        user.token = data.token;
                        user.uuid = data.uuid;

                        navigation.navigate('Login');
                    }
                } else {
                    Alert.alert('Error', `${response.errorMessage}`, [
                        { text: 'Okay' }
                    ]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    cancel(navigation) {
        navigation.navigate('Login');
    }

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='light-content' />
                <TouchableWithoutFeedback
                    style={styles.container}
                    onPress={Keyboard.dismiss}
                >
                    <View style={styles.logoContainer}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logo}>Register</Text>
                            <Text style={styles.title}>
                                Account information
                            </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder='Enter email'
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                keyboardType='email-address'
                                returnKeyType='next'
                                autoCorrect={false}
                                autoCapitalize='none'
                                onSubmitEditing={() =>
                                    this.refs.firstNameInput.focus()
                                }
                                onChangeText={(text) =>
                                    this.setState({ email: text })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Enter First Name'
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                returnKeyType='next'
                                autoCorrect={false}
                                autoCapitalize='sentences'
                                ref='firstNameInput'
                                onSubmitEditing={() =>
                                    this.refs.lastNameInput.focus()
                                }
                                onChangeText={(text) =>
                                    this.setState({ firstName: text })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Enter Last Name'
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                returnKeyType='next'
                                autoCorrect={false}
                                autoCapitalize='sentences'
                                ref='lastNameInput'
                                onSubmitEditing={() =>
                                    this.refs.passwordInput.focus()
                                }
                                onChangeText={(text) =>
                                    this.setState({ lastName: text })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Enter Password'
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                secureTextEntry
                                returnKeyType='next'
                                ref='passwordInput'
                                onSubmitEditing={() =>
                                    this.refs.passwordConfirmInput.focus()
                                }
                                onChangeText={(text) =>
                                    this.setState({ password: text })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Enter Password Confirm'
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                secureTextEntry
                                returnKeyType='go'
                                ref='passwordConfirmInput'
                                onChangeText={(text) =>
                                    this.setState({ passwordConfirm: text })
                                }
                            />
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={(_) => this.checkRegister(navigation)}
                            >
                                <Text style={styles.buttonText} tabLabel='Home'>
                                    Register
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonCancelContainer}
                                onPress={(_) => this.cancel(navigation)}
                            >
                                <Text
                                    style={styles.buttonText}
                                    tabLabel='Register'
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column'
    },
    logoContainer: {
        alignItems: 'center',
        flex: 1
    },
    infoContainer: {
        position: 'absolute',
        padding: 20,
        left: 0,
        right: 0,
        top: 100
    },
    title: {
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#f7c744'
    },
    logo: {
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 23,
        marginBottom: 20,
        color: 'white'
    },
    input: {
        height: 40,
        color: '#FFF',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    buttonContainer: {
        backgroundColor: '#f2c744',
        paddingVertical: 15,
        marginBottom: 20,
        borderRadius: 5
    },
    buttonCancelContainer: {
        backgroundColor: '#f27843',
        paddingVertical: 15,
        marginBottom: 20,
        borderRadius: 5
    },
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 18
    }
});
