import React, { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';
import { user } from '../helpers/Global';
import { ports, servers } from '../helpers/Server';

export default class EditUser extends Component {
    async updateRequest(navigation, actualUser) {
        const uri = `http://${servers.devURI}:${ports.devPort}/user/${
            actualUser.uuid
        }`;

        let formBody = [];
        for (const property in actualUser) {
            if (property) {
                const encodedKey = encodeURIComponent(property);
                const encodedValue = encodeURIComponent(actualUser[property]);
                formBody.push(`${encodedKey}=${encodedValue}`);
            }
        }
        formBody = formBody.join('&');
        try {
            let response = await fetch(uri, {
                method: 'PUT',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded; charset=UTF-8',
                    authorization: `Bearer ${user.token}`
                },
                body: formBody
            });
            console.log(uri);
            if (response.status !== 200) {
                Alert.alert('Error', `${response.errorMessage}`, [
                    { text: 'Okay' }
                ]);
            } else if (response.status === 200) {
                const data = JSON.parse(response._bodyInit);
                if (user.role === 42) {
                    navigation.navigate('ManageUsers', { reload: true });
                } else if (user.role === 0) {
                    if (data) {
                        user.email = data.email;
                        user.firstName = data.firstName;
                        user.lastName = data.lastName;
                        user.phone = data.phone;
                        user.photoUrl = data.photoUrl;
                        user.role = data.role;
                    }
                    navigation.navigate('Home', { reload: true });
                }
            }
            return;
        } catch (error) {
            console.error(error);
        }
    }

    async deleteRequest(navigation, actualUser) {
        const uri = `http://${servers.devURI}:${ports.devPort}/user/${
            actualUser.uuid
        }`;

        try {
            let response = await fetch(uri, {
                method: 'DELETE',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded; charset=UTF-8',
                    authorization: `Bearer ${user.token}`
                }
            });
            console.log(uri);
            if (response.status !== 200) {
                Alert.alert(`${response.status}`, `${response.errorMessage}`, [
                    { text: 'Okay' }
                ]);
            }
            if (response.status === 200)
                if (user.role === 42) {
                    navigation.navigate('ManageUsers', { reload: true });
                }
        } catch (error) {
            console.error(error);
        }
    }

    cancel(navigation) {
        if (user.role == 42) {
            navigation.navigate('ManageUsers');
        } else {
            navigation.navigate('Home');
        }
    }

    render() {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;

        const details = {
            uuid: params.uuid,
            email: params.email,
            firstName: params.firstName,
            lastName: params.lastName,
            phone: params.phone,
            role: params.role
        };

        if (!user.token) {
            navigation.navigate('Login');
        }

        return (
            <View style={styles.main}>
                <View style={styles.container}>
                    <StatusBar barStyle='dark-content' />
                    <View style={styles.infoContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={`Actual email: ${params.email}`}
                            placeholderTextColor='rgba(255, 255, 255, 0.6)'
                            returnKeyType='next'
                            autoCorrect={false}
                            autoCapitalize='sentences'
                            ref='emailInput'
                            onSubmitEditing={() =>
                                this.refs.firstNameInput.focus()
                            }
                            onChangeText={(text) => (details.email = text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={`Actual first name: ${
                                params.firstName
                            }`}
                            placeholderTextColor='rgba(255, 255, 255, 0.6)'
                            returnKeyType='next'
                            autoCorrect={false}
                            autoCapitalize='sentences'
                            ref='firstNameInput'
                            onSubmitEditing={() =>
                                this.refs.lastNameInput.focus()
                            }
                            onChangeText={(text) => (details.firstName = text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={`Actual last name: ${params.lastName}`}
                            placeholderTextColor='rgba(255, 255, 255, 0.6)'
                            returnKeyType='next'
                            ref='lastNameInput'
                            onSubmitEditing={() =>
                                this.refs.phoneNumberInput.focus()
                            }
                            onChangeText={(text) => (details.lastName = text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={`Actual phone number: ${params.phone}`}
                            placeholderTextColor='rgba(255, 255, 255, 0.6)'
                            autoCorrect={false}
                            returnKeyType={user.role == 42 ? 'next' : 'go'}
                            ref='phoneNumberInput'
                            onSubmitEditing={() => this.refs.roleInput.focus()}
                            onChangeText={(text) => (details.phone = text)}
                        />
                        {user.role == 42 ? (
                            <TextInput
                                style={styles.input}
                                placeholder={`Actual role: ${params.role}`}
                                placeholderTextColor='rgba(255, 255, 255, 0.6)'
                                autoCorrect={false}
                                returnKeyType='go'
                                ref='roleInput'
                                onChangeText={(text) => (details.role = text)}
                            />
                        ) : null}
                        <TouchableOpacity
                            style={styles.updateButtonContainer}
                            onPress={(_) =>
                                this.updateRequest(navigation, details)
                            }
                        >
                            <Text style={styles.logOutbuttonText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButtonContainer}
                            onPress={(_) => this.cancel(navigation, details)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        {user.role === 42 ? (
                            <TouchableOpacity
                                style={styles.logOutButtonContainer}
                                onPress={(_) =>
                                    this.deleteRequest(navigation, params)
                                }
                            >
                                <Text style={styles.logOutbuttonText}>
                                    Delete user
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: 'rgb(32, 53, 70)' },
    container: {
        marginTop: 40,
        flexDirection: 'column'
    },
    updateButtonContainer: {
        backgroundColor: '#f2c744',
        paddingVertical: 8,
        marginBottom: 10,
        marginTop: 40,
        marginHorizontal: 40,
        height: 40,
        borderRadius: 5
    },

    cancelButtonContainer: {
        backgroundColor: '#f27843',
        paddingVertical: 8,
        marginBottom: 10,
        marginTop: 0,
        marginHorizontal: 40,
        height: 40,
        borderRadius: 5
    },

    cancelButtonText: {
        textAlign: 'center',
        color: '#f9f8ef',
        fontWeight: 'bold',
        fontSize: 15
    },

    logOutButtonContainer: {
        backgroundColor: '#d9534f',
        paddingVertical: 8,
        marginVertical: 40,
        marginHorizontal: 60,
        borderRadius: 5
    },
    logOutbuttonText: {
        textAlign: 'center',
        color: '#f9f8ef',
        fontWeight: 'bold',
        fontSize: 15
    },
    infoContainer: {
        position: 'absolute',
        padding: 20,
        left: 0,
        right: 0,
        top: 100
    },
    input: {
        height: 50,
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
    }
});
