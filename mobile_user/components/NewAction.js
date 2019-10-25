import React, { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import { user, actualArea, colors } from '../helpers/Global';
import { servers, ports } from '../helpers/Server';
import { FlatGrid } from 'react-native-super-grid';

export default class NewAction extends Component {
    constructor(props) {
        super(props);
        this.state = { isDataLoaded: false };
    }

    addButtonClicked(navigation) {
        navigation.navigate('ActionsView', { reload: true });
    }

    cancelButtonClicked(navigation) {
        navigation.navigate('ServicesView', { reload: true });
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

    async getActions(uuid) {
        const uri = `http://${servers.devURI}:${ports.devPort}/Actions/${uuid}`;

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
                actualArea.actions = await JSON.parse(response._bodyInit);
                this.setState(() => ({ isDataLoaded: true }));
                return actualArea.actions;
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

    navigateToReactions(navigation, item, params) {
        navigationParams = {
            action: item,
            params: params
        };
        navigation.navigate('ReactionView', navigationParams);
    }

    render() {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;

        if (this.state.isDataLoaded == false) this.getActions(params.uuid);

        return (
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' />
                <Text style={styles.title}>{params.name}</Text>
                <Text style={styles.subTitle}>Select an action:</Text>
                {this.state.isDataLoaded == true ? (
                    <FlatGrid
                        itemDimension={130}
                        items={actualArea.actions}
                        style={styles.gridView}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[
                                    styles.itemContainer,
                                    { backgroundColor: this.getColor(index) }
                                ]}
                                onPress={(_) =>
                                    this.navigateToReactions(
                                        navigation,
                                        item,
                                        params
                                    )
                                }
                            >
                                <Text style={styles.itemName}>{item.name}</Text>

                                <Text style={styles.itemCode}>
                                    {item.description}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : null}

                {/* Buttons */}
                <TouchableOpacity
                    style={styles.buttonCancelContainer}
                    onPress={(_) => this.cancelButtonClicked(navigation)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            { fontFamily: 'lucida grande', fontWeight: 'bold' }
                        ]}
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
        fontFamily: 'lucida grande',
        marginTop: 40,
        backgroundColor: 'white',
        flex: 1
    },

    title: {
        marginBottom: 40,
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
        fontFamily: 'lucida grande',
        color: 'white',
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
