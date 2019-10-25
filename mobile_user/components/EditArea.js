import React, { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';

import { user, actualArea } from '../helpers/Global';
import { servers, ports } from '../helpers/Server';

export default class EditArea extends Component {
    cancelButtonClicked(navigation) {
        navigation.navigate('Home', { reload: true });
    }

    async updateRequest(navigation, area) {
        const uri = `http://${servers.devURI}:${ports.devPort}/area/${
            area.uuid
        }`;

        const details = {
            actionUUID: area.actionUUID,
            reactionUUID: area.reactionUUID,
            actionConfig: JSON.stringify(area.actionConfig),
            reactionConfig: JSON.stringify(area.reactionConfig)
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + '=' + encodedValue);
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

            if (response.status == 200) {
                console.log(response);
                navigation.navigate('ActionsView', { reload: true });
            } else {
                Alert.alert('Error', `${response.errorMessage}`, [
                    { text: 'Okay' }
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async deleteRequest(navigation, area) {
        const uri = `http://${servers.devURI}:${ports.devPort}/area/${
            area.uuid
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

            if (response.status == 200) {
                navigation.navigate('Home', { reload: true });
            } else {
                Alert.alert('Error', `${response.errorMessage}`, [
                    { text: 'Okay' }
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    inputAction(action) {
        return Object.keys(action.actionConfig).map(function(key) {
            actualArea.area.push(
                <TextInput
                    key={`${key}`}
                    style={styles.input}
                    placeholder={`${action.actionConfig[key]}`}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    keyboardType='email-address'
                    returnKeyType='next'
                    autoCorrect={false}
                    autoCapitalize='none'
                    ref={`${key}`}
                    onChangeText={(text) => (action.actionConfig[key] = text)}
                />
            );
        });
    }

    inputReaction(reaction) {
        return Object.keys(reaction.reactionConfig).forEach((key) => {
            actualArea.area.push(
                <TextInput
                    key={`${key}`}
                    style={styles.input}
                    placeholder={`${reaction.reactionConfig[key]}`}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    keyboardType='email-address'
                    returnKeyType='next'
                    autoCorrect={false}
                    autoCapitalize='none'
                    ref={`${key}`}
                    onChangeText={(text) =>
                        (reaction.reactionConfig[key] = text)
                    }
                />
            );
        });
    }

    inputRender(area) {
        this.inputAction(area);
        this.inputReaction(area);
    }

    render() {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;

        actualArea.area = [];
        this.inputRender(params);

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content' />
                <ScrollView style={styles.infoContainer}>
                    {actualArea.area}
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={(_) => this.updateRequest(navigation, params)}
                    >
                        <Text
                            style={[
                                styles.buttonTextAdd,
                                {
                                    fontFamily: 'lucida grande',
                                    fontWeight: 'bold'
                                }
                            ]}
                        >
                            Update
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonCancelContainer}
                        onPress={(_) => this.cancelButtonClicked(navigation)}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                {
                                    fontFamily: 'lucida grande',
                                    fontWeight: 'bold'
                                }
                            ]}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonDeleteContainer}
                        onPress={(_) => this.deleteRequest(navigation, params)}
                    >
                        <Text
                            style={[
                                styles.buttonDeleteText,
                                {
                                    fontFamily: 'lucida grande',
                                    fontWeight: 'bold'
                                }
                            ]}
                        >
                            Delete
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(32, 53, 70)',
        flex: 1
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20
    },
    buttonTextAdd: {
        color: 'white',
        fontSize: 20
    },
    buttonDeleteText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2c744',
        marginTop: 50,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 5,
        height: 50
    },
    buttonCancelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f27843',
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 5,
        height: 50
    },
    buttonDeleteContainer: {
        backgroundColor: '#d9534f',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginVertical: 40,
        marginHorizontal: 40,
        borderRadius: 5,
        height: 40
    },
    infoContainer: {
        position: 'absolute',
        padding: 20,
        left: 0,
        right: 0,
        top: 100
    },
    input: {
        fontFamily: 'lucida grande',
        height: 40,
        color: '#FFF',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5
    }
});
