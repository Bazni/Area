import React, { Component } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { AccessToken, LoginButton } from 'react-native-fbsdk';

import { ports, servers } from '../helpers/Server'; 

export default class FBLoginButton extends Component {
    infoRequest(accessToken) {
        const details = {
            fbAccessToken: accessToken
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
        const uri = `http://${servers.devURI}:${ports.devPort}/auth/facebook`;

        fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: formBody
        })
            .then((response) => {
                if (response.status != 200) {
                    Alert.alert('Error', 'Server error.', [{ text: 'Okay' }]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View>
                <LoginButton
                    style={styles.fbButton}
                    readPermissions={['public_profile', 'email']}
                    onLoginFinished={(error, result) => {
                        if (error) {
                            alert('Login failed with error: ' + error.message);
                        } else if (result.isCancelled) {
                        } else {
                            AccessToken.getCurrentAccessToken().then((data) => {
                                this.infoRequest(data.accessToken.toString());
                            });
                        }
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fbButton: {
        marginBottom: 20,
        marginHorizontal: 20,
        height: 40,
        borderRadius: 5
    }
});
