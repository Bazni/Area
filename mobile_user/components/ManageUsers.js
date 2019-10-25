import React, { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { user, allUsers, colors } from '../helpers/Global';
import { servers, ports } from '../helpers/Server';

export default class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = { isDataLoaded: false };
    }

    async getUsers() {
        const uri = `http://${servers.devURI}:${ports.devPort}/users`;

        try {
            let response = await fetch(uri, {
                method: 'GET',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded; charset=UTF-8',
                    authorization: `Bearer ${user.token}`
                }
            });

            if (response.status == 200) {
                users = await JSON.parse(response._bodyInit);
                allUsers.list = users;
                this.setState(() => ({ isDataLoaded: true }));
                return users;
            } else {
                Alert.alert('Error', `${response.errorMessage}`, [
                    { text: 'Okay' }
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    }

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

    manageUser() {
        navigation.navigate('ManageUsers');
    }

    cancel(navigation) {
        navigation.navigate('Home', { reload: true });
    }

    editUser(navigation, user) {
        navigation.navigate('EditUser', user);
    }

    getColor(i) {
        return colors[i % colors.length].code;
    }

    componentWillReceiveProps() {
        this.setState({
            isDataLoaded: false
        });
    }

    componentDidMount() {
        this.setState({
            isDataLoaded: false
        });
    }

    render() {
        const { navigation } = this.props;

        if (!user.token) {
            navigation.navigate('Login');
        }

        if (this.state.isDataLoaded == false) this.getUsers();

        if (this.state.isDataLoaded == true) {
            allUsers.sections = [];
            allUsers.list.forEach((elem, index) => {
                allUsers.sections.push({
                    email: elem.email,
                    firstName: elem.firstName,
                    lastName: elem.lastName,
                    phone: elem.phone,
                    photoUrl: elem.photoUrl,
                    token: elem.token,
                    uuid: elem.uuid,
                    role: elem.role,
                    color: this.getColor(index)
                });
            });
        }

        return (
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' />
                {this.state.isDataLoaded == true ? (
                    <FlatGrid
                        itemDimension={150}
                        items={allUsers.sections}
                        style={styles.gridView}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[
                                    styles.itemContainer,
                                    { backgroundColor: item.color }
                                ]}
                                onPress={(_) => this.editUser(navigation, item)}
                            >
                                <Text style={styles.itemCode}>
                                    {item.lastName}
                                </Text>

                                <Text style={styles.itemCode}>
                                    {item.firstName}
                                </Text>
                                <Text style={styles.itemName}>
                                    {item.email}
                                </Text>
                                <Text style={styles.itemRight}>
                                    {item.role}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : null}

                <TouchableOpacity
                    style={styles.buttonCancelContainer}
                    onPress={(_) => this.cancel(navigation)}
                >
                    <Text style={styles.buttonText} tabLabel='ProfileView'>
                        OK
                    </Text>
                </TouchableOpacity>
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
    gridView: {
        marginTop: 20,
        flex: 1
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600'
    },
    itemCode: {
        fontWeight: 'bold',
        fontSize: 35,
        color: '#fff'
    },
    itemRight: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
        textAlign: 'right'
    },
    buttonCancelContainer: {
        backgroundColor: '#f27843',
        paddingVertical: 15,
        marginBottom: 20,
        borderRadius: 5,
        marginHorizontal: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 18
    }
});
