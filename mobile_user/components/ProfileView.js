import React, { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    ImageBackground,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import FBLoginButton from './FBLoginButton';
import { user } from '../helpers/Global';

export default class ProfileView extends Component {
    clearUser() {
        user.firstName = '';
        user.lastName = '';
        user.email = '';
        user.phone = '';
        user.photoUrl = '';
        user.token = '';
        user.uuid = '';
        user.role = '';
    }

    manageUsers(navigation) {
        navigation.navigate('ManageUsers');
    }

    EditUser(navigation, user) {
        navigation.navigate('EditUser', user);
    }

    logOut(navigation) {
        this.clearUser();
        navigation.navigate('Login');
    }

    componentWillReceiveProps() {
        console.log('Update props');
    }

    render() {
        const { navigation } = this.props;
        if (!user.token) {
            navigation.navigate('Login');
        }
        return (
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' />
                <ImageBackground
                    style={styles.headerBackground}
                    source={require('../assets/images/profilePictureBackground.png')}
                    blurRadius={5}
                >
                    <View style={styles.header}>
                        <View style={styles.profilePictureWrap}>
                            <Image
                                style={styles.profilePicture}
                                source={require('../assets/images/profile.png')}
                            />
                        </View>
                        <Text style={styles.name}>
                            {' '}
                            {user.firstName} {user.lastName}{' '}
                        </Text>
                        <Text style={styles.email}> {user.email} </Text>
                    </View>
                </ImageBackground>
                <View style={styles.profileContent}>
                    <Text style={styles.title}> Profile </Text>
                    <FBLoginButton />
                    {user.role === 42 ? (
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={(_) => this.manageUsers(navigation)}
                        >
                            <Text
                                style={styles.buttonText}
                                tabLabel='ManageUsers'
                            >
                                Manage Users
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={(_) => this.EditUser(navigation, user)}
                        >
                            <Text
                                style={styles.buttonText}
                                tabLabel='ManageYourProfile'
                            >
                                Manage your profile
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.logOutButtonContainer}
                        onPress={(_) => this.logOut(navigation)}
                    >
                        <Text
                            style={styles.logOutbuttonText}
                            tabLabel='Register'
                        >
                            Log out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        backgroundColor: 'white',
        flex: 1
    },

    headerBackground: {
        width: null,
        height: 300,
        alignSelf: 'stretch'
    },

    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },

    profilePictureWrap: {
        width: 180,
        height: 180,
        borderRadius: 100,
        borderColor: '#f9f8ef',
        borderWidth: 3
    },

    profilePicture: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 85
    },

    name: {
        marginTop: 20,
        fontSize: 25,
        color: '#f9f8ef',
        fontFamily: 'lucida grande',
        fontWeight: 'bold'
    },

    email: {
        fontSize: 15,
        marginTop: 5,
        color: '#f9f8ef',
        fontFamily: 'lucida grande',
        fontWeight: 'bold'
    },

    profileContent: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 30
    },

    title: {
        marginBottom: 20,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        color: '#3c3c3c'
    },

    buttonContainer: {
        backgroundColor: '#e2e2e2',
        paddingVertical: 15,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 5
    },

    logOutButtonContainer: {
        backgroundColor: '#d9534f',
        paddingVertical: 8,
        marginVertical: 40,
        marginHorizontal: 60,
        borderRadius: 5
    },

    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 15
    },

    logOutbuttonText: {
        textAlign: 'center',
        color: '#f9f8ef',
        fontWeight: 'bold',
        fontSize: 15
    }
});
