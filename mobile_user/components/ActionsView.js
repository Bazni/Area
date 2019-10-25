import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    StatusBar,
    Alert,
    RefreshControl
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { user, colors } from '../helpers/Global';
import { servers, ports } from '../helpers/Server';

export default class ActionsView extends Component {
    constructor(props) {
        super(props);
        this.state = { isDataLoaded: false };
    }

    componentDidMount() {
        this.setState({
            isDataLoaded: false
        });
    }

    componentWillReceiveProps() {
        console.log('reload');
        this.setState({
            isDataLoaded: false
        });
    }

    servicesView(navigation) {
        navigation.navigate('ServicesView');
    }

    editArea(navigation, item) {
        navigation.navigate('EditArea', item);
    }

    async getAreas() {
        const uri = `http://${servers.devURI}:${ports.devPort}/areas`;

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
                user.areas = await JSON.parse(response._bodyInit);
                this.setState(() => ({ isDataLoaded: true }));
                return user.areas;
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

    _onRefresh = () => {
        this.setState({ isDataLoaded: false });
    };

    capitalizeString(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showAction(config) {
        let message = '';
        for (var property in config) {
            if (config.hasOwnProperty(property)) {
                message = message + `${this.capitalizeString(property)}: `;
                message = message + `${config[property]}\t`;
            }
        }

        return message.slice(0, -1);
    }

    showReaction(config) {
        let message = '';
        for (var property in config) {
            if (config.hasOwnProperty(property)) {
                message = message + `${this.capitalizeString(property)}: `;
                message = message + `${config[property]}\t`;
            }
        }

        return message.slice(0, -1);
    }

    render() {
        const { navigation } = this.props;
        if (!user.token) {
            navigation.navigate('Login');
        }

        if (this.state.isDataLoaded == false) this.getAreas();

        let sections = [];
        if (this.state.isDataLoaded == true) {
            user.areas.forEach((elem, index) => {
                sections.push({
                    uuid: elem.uuid,
                    actionUUID: elem.actionUUID,
                    reactionUUID: elem.reactionUUID,
                    actionConfig: elem.actionConfig,
                    reactionConfig: elem.reactionConfig,
                    color: this.getColor(index)
                });
            });
        }
        return (
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' />
                {this.state.isDataLoaded == true ? (
                    <FlatGrid
                        itemDimension={400}
                        items={sections}
                        style={styles.gridView}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[
                                    styles.areaBlock,
                                    {
                                        backgroundColor: item.color,
                                        flex: 1,
                                        flexDirection: 'column'
                                    }
                                ]}
                                onPress={(_) => this.editArea(navigation, item)}
                            >
                                <Text style={styles.itemOperator}>IF</Text>
                                <Text style={styles.itemConfig}>
                                    {this.showAction(item.actionConfig)}
                                </Text>
                                <Text style={styles.itemOperator}>THEN</Text>
                                <Text style={styles.itemConfig}>
                                    {this.showReaction(item.reactionConfig)}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : null}
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={(_) => this.servicesView(navigation)}
                >
                    <Text style={[styles.buttonText, { fontSize: 30 }]}>+</Text>
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
        fontSize: 18
    },

    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2c744',
        marginVertical: 10,
        marginHorizontal: 40,
        borderRadius: 40,
        height: 40
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
    areaBlock: {
        justifyContent: 'space-between',
        borderRadius: 5,
        marginHorizontal: 10,
        padding: 10,
        height: 150
    },
    itemName: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '700'
    },
    itemOperator: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff'
    },
    itemConfig: {
        fontWeight: 'bold',
        fontSize: 14,
        marginHorizontal: 20,
        color: '#fff'
    }
});
