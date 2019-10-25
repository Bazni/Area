import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    StatusBar
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { user, actualArea, colors } from '../helpers/Global';
import { servers, ports } from '../helpers/Server';

export default class ReactionsView extends Component {
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
        navigation.navigate('NewAction', { reload: true });
    }

    getColor(i) {
        return colors[i % colors.length].code;
    }

    newReaction(navigation, params, reaction) {
        navigation.navigate('NewReaction', {
            action: params.action,
            reaction: reaction,
            params: params.params
        });
    }

    async getServicesWithReaction() {
        const uri = `http://${servers.devURI}:${ports.devPort}/reactions`;

        try {
            let response = await fetch(uri, {
                method: 'GET',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded; charset=UTF-8',
                    authorization: `Bearer ${user.token}`
                }
            });

            if (response.status === 200) {
                actualArea.reactions = await JSON.parse(response._bodyInit);
                this.setState(() => ({ isDataLoaded: true }));
            } else {
                Alert.alert('Error', `${response.errorMessage}`, [
                    { text: 'Okay' }
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;

        if (!user.token) {
            navigation.navigate('Login');
        }

        let sections = [];
        if (this.state.isDataLoaded == true) {
            actualArea.reactions.forEach((elem, index) => {
                sections.push({
                    title: elem.name,
                    description: elem.description,
                    uuid: elem.uuid,
                    config: elem.config,
                    color: this.getColor(index)
                });
            });
        } else {
            this.getServicesWithReaction();
        }

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{params.params.name}</Text>
                <Text style={styles.subTitle}>Select a reaction:</Text>
                <StatusBar barStyle='dark-content' />
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
                                    this.newReaction(navigation, params, item)
                                }
                            >
                                <Text style={styles.itemName}>
                                    {item.title}
                                </Text>

                                <Text style={styles.itemCode}>
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
                        style={[
                            styles.buttonText,
                            { fontFamily: 'lucida grande', fontWeight: 'bold' }
                        ]}
                        tabLabel='ProfileView'
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

    subTitle: {
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 20,
        marginHorizontal: 15,
        textAlign: 'left',
        color: '#3c3c3c'
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

    gridView: {
        marginTop: 20,
        flex: 1
    },

    itemContainer: {
        borderRadius: 10,
        padding: 10,
        height: 150,
        justifyContent: 'flex-end'
    },

    itemName: {
        fontSize: 30,
        color: '#fff',
        fontWeight: '600'
    },

    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff'
    },

    buttonCancelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f27843',
        marginBottom: 20,
        marginTop: 10,
        marginHorizontal: 30,
        borderRadius: 5,
        height: 40
    },

    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    }
});
