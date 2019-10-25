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

export default class NewReaction extends Component {
    cancelButtonClicked(navigation) {
        navigation.navigate('Home', { reload: true });
    }

    async areaRequest(navigation, action, reaction) {
        const uri = `http://${servers.devURI}:${ports.devPort}/area`;
        const details = {
            actionUUID: action.uuid,
            reactionUUID: reaction.uuid,
            actionConfig: JSON.stringify(action.config),
            reactionConfig: JSON.stringify(reaction.config)
        };

        if (details.actionConfig == undefined) details.actionConfig = `{}`;

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        try {
            let response = await fetch(uri, {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded; charset=UTF-8',
                    authorization: `Bearer ${user.token}`
                },
                body: formBody
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
        return Object.keys(action.config).map(function(key) {
            actualArea.area.push(
                <TextInput
                    key={`${key}`}
                    style={styles.input}
                    placeholder={`${key}`}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    keyboardType='email-address'
                    returnKeyType='next'
                    autoCorrect={false}
                    autoCapitalize='none'
                    ref={`${key}`}
                    onChangeText={(text) => (action.config[key] = text)}
                />
            );
        });
    }

    inputReaction(reaction) {
        return Object.keys(reaction.config).forEach((key) => {
            actualArea.area.push(
                <TextInput
                    key={`${key}`}
                    style={styles.input}
                    placeholder={`${key}`}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    keyboardType='email-address'
                    returnKeyType='next'
                    autoCorrect={false}
                    autoCapitalize='none'
                    ref={`${key}`}
                    onChangeText={(text) => (reaction.config[key] = text)}
                />
            );
        });
    }

    inputRender(action, reaction) {
        console.info(action);
        if (action.config) this.inputAction(action);
        console.info(reaction);
        if (reaction.config) this.inputReaction(reaction);
    }

    render() {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;

        let action = params.action;
        let reaction = params.reaction;
        actualArea.area = [];
        this.inputRender(action, reaction);

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content' />
                <ScrollView style={styles.infoContainer}>
                    {actualArea.area}
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={(_) =>
                            this.areaRequest(navigation, action, reaction)
                        }
                    >
                        <Text
                            style={ styles.buttonTextAdd }
                        >
                            +
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
        fontSize: 18
    },
    buttonTextAdd: {
        color: 'white',
        fontSize: 40
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2c744',
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 5,
        height: 60
    },
    buttonCancelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f27843',
        marginBottom: 20,
        marginHorizontal: 30,
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
        height: 40,
        color: '#FFF',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5
    }
});
