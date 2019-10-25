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
import { user, allServices } from '../helpers/Global';
import { servers, ports } from '../helpers/Server';

export default class Login extends Component {
    state = { username: 'kaww@test.com', password: 'pwd' };

    getServices(navigation) {
        const uri = `http://${servers.devURI}:${ports.devPort}/services`;

        fetch(uri, {
            method: 'GET',
            headers: {
                Authorization: user.token
            }
        })
            .then((response) => {
                if (response.status == 200) {
                    const data = JSON.parse(response._bodyInit);
                    if (data) {
                        allServices.list = data;
                        navigation.navigate('Home');
                    }
                } else {
                    console.log('Error', 'Services Error.', [{ text: 'Okay' }]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    checkLogin(navigation) {
        const { username, password } = this.state;

        const details = {
            email: username,
            password
        };

        let formBody = [];
        for (const property in details) {
            if (property && details[property]) {
                formBody.push(
                    `${encodeURIComponent(property)}=${encodeURIComponent(
                        details[property]
                    )}`
                );
            }
        }
        formBody = formBody.join('&');
        const uri = `http://${servers.devURI}:${ports.devPort}/auth/login`;

        console.log(uri);

        fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: formBody
        })
            .then((response) => {
                if (response.status == 200) {
                    const data = JSON.parse(response._bodyInit);
                    if (data) {
                        user.email = data.email;
                        user.firstName = data.firstName;
                        user.lastName = data.lastName;
                        user.phone = data.phone;
                        user.photoUrl = data.photoUrl;
                        user.token = data.token;
                        user.uuid = data.uuid;
                        user.role = data.role;
                        this.getServices(navigation);
                    }
                } else {
                    Alert.alert('Error', 'User/Password mismatch.', [
                        { text: 'Okay' }
                    ]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    register(nav) {
        nav.navigate('Register');
    }

    config(nav) {
        nav.navigate('Config');
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
                            <Text style={styles.logo}>Login</Text>
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
                                    this.refs.txtPassword.focus()
                                }
                                onChangeText={(text) =>
                                    this.setState({ username: text })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Enter password'
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                secureTextEntry={true}
                                returnKeyType='go'
                                autoCorrect={false}
                                ref={'txtPassword'}
                                onChangeText={(text) =>
                                    this.setState({ password: text })
                                }
                            />
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={(_) => this.checkLogin(navigation)}
                            >
                                <Text style={styles.buttonText} tabLabel='Home'>
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={(_) => this.register(navigation)}
                            >
                                <Text
                                    style={styles.buttonText}
                                    tabLabel='Register'
                                >
                                    Register
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={(_) => this.config(navigation)}
                            >
                                <Text
                                    style={styles.buttonText}
                                    tabLabel='Config'
                                >
                                    Config
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
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 18
    }
});
