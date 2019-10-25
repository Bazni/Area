import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    StatusBar,
    Alert
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { user, actualArea, colors } from '../helpers/Global';
import { servers, ports } from '../helpers/Server';
import { BorderlessButton } from 'react-native-gesture-handler';

export default class ServicesView extends Component {
    constructor(props) {
        super(props);
        this.state = { isDataLoaded: false };
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

    cancel(navigation) {
        navigation.navigate('Home', { reload: true });
    }

    newAction(navigation, item) {
        navigation.navigate('NewAction', item);
    }

    async getServices() {
        const uri = `http://${servers.devURI}:${ports.devPort}/services`;

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
                actualArea.services = await JSON.parse(response._bodyInit);
                this.setState(() => ({ isDataLoaded: true }));
                return actualArea.services;
            } else {
                Alert.alert('Error', `${response.errorMessage}`, [
                    { text: 'Okay' }
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    getColor(i) {
        return colors[i % colors.length].code;
    }

    render() {
        const { navigation } = this.props;
        if (!user.token) {
            navigation.navigate('Login');
        }

        if (this.state.isDataLoaded == false) this.getServices();

        let sections = [];
        if (this.state.isDataLoaded == true) {
            actualArea.services.forEach((elem, index) => {
                sections.push({
                    uuid: elem.uuid,
                    name: elem.name,
                    description: elem.description,
                    color: this.getColor(index + 5)
                });
            });
        }

        return (
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' />
                <Text style={styles.subTitle}>Select a service:</Text>
                {this.state.isDataLoaded == true ? (
                    <FlatGrid
                        itemDimension={150}
                        items={sections}
                        style={styles.gridView}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[
                                    styles.itemContainer,
                                    { backgroundColor: item.color }
                                ]}
                                onPress={(_) =>
                                    this.newAction(navigation, item)
                                }
                            >
                                <Text style={styles.itemCode}>{item.name}</Text>
                                <Text style={styles.itemName}>
                                    {item.description}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : null}
                <TouchableOpacity
                    style={styles.buttonCancelContainer}
                    onPress={(_) => this.cancel(navigation)}
                >
                    <Text
                        style={ styles.buttonText }
                        tabLabel='Home'
                    >
                        Cancel
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

    title: {
        marginBottom: 50,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 30,
        marginHorizontal: 15,
        textAlign: 'left',
        color: '#3c3c3c'
    },

    subTitle: {
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 20,
        marginHorizontal: 15,
        textAlign: 'left',
        color: '#3c3c3c'
    },

    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 18
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
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 30,
        borderRadius: 5,
        height: 40
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
        fontSize: 20,
        color: '#fff',
        fontWeight: '700'
    },
    itemCode: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#fff'
    }
});
