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
    TouchableOpacity
} from 'react-native';

import { ports, servers } from '../helpers/Server';

export default class Config extends Component {
    state = {
        ip: '',
        port: ''
    };

    validateIP(navigation) {
        const { ip, port } = this.state;

        servers.devURI = ip;
        if (ip == '') ip = '10.19.253.210';

        ports.devPort = port;
        if (port == '') ports.devPort = '8080';
        navigation.navigate('Login');
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
                            <Text style={styles.logo}>Config</Text>
                            <Text style={styles.title}>
                                IP and port configuration
                            </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter IP address, default: ${
                                    servers.devURI
                                }`}
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                keyboardType='email-address'
                                returnKeyType='next'
                                autoCorrect={false}
                                autoCapitalize='none'
                                onSubmitEditing={() => this.refs.port.focus()}
                                onChangeText={(text) =>
                                    this.setState({ ip: text })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter port, default: ${
                                    ports.devPort
                                }`}
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                returnKeyType='go'
                                autoCorrect={false}
                                ref='port'
                                onChangeText={(text) =>
                                    this.setState({ port: text })
                                }
                            />
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={(_) => this.validateIP(navigation)}
                            >
                                <Text
                                    style={styles.buttonText}
                                    tabLabel='Login'
                                >
                                    OK
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonCancelContainer}
                                onPress={(_) => this.cancel(navigation)}
                            >
                                <Text
                                    style={styles.buttonText}
                                    tabLabel='Login'
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
