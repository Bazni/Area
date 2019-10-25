import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    StatusBar
} from 'react-native';
import { SectionGrid } from 'react-native-super-grid';
import { user, allServices } from '../helpers/Global';

export default class ActionsView extends Component {
    render() {
        const { navigation } = this.props;
        if (!user.token) {
            navigation.navigate('Login');
        }

        let sections = [];

        allServices.list.forEach((elem) => {
            sections.push({
                title: elem.name,
                headerColor: this.getHeaderColor(elem.name),
                data: [{ name: 'Add', color: allServices.colors.lightgray }]
            });
        });

        sections.sort((a, b) => {
            var textA = a.title.toUpperCase();
            var textB = b.title.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        return (
            <SectionGrid
                itemDimension={90}
                sections={sections}
                style={styles.gridView}
                renderItem={({ item, section, index }) => (
                    <View>
                        <StatusBar barStyle='dark-content' />
                        {this.renderGrid(
                            navigation,
                            item,
                            section,
                            index,
                            sections
                        )}
                    </View>
                )}
                renderSectionHeader={({ section }) => (
                    <View
                        style={[
                            styles.sectionHeader,
                            { backgroundColor: section.headerColor }
                        ]}
                    >
                        <Text style={styles.sectionText}>{section.title}</Text>
                    </View>
                )}
            />
        );
    }

    renderGrid(navigation, item, section, index, sections) {
        if (item.name == 'Add') {
            return (
                <TouchableOpacity
                    style={[
                        styles.buttonContainer,
                        { backgroundColor: item.color }
                    ]}
                    onPress={async (_) =>
                        this.newAction(
                            navigation,
                            item,
                            section,
                            index,
                            sections
                        )
                    }
                >
                    <Text style={styles.buttonLabel}>+</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <View
                    style={[
                        styles.itemContainer,
                        { backgroundColor: item.color }
                    ]}
                >
                    <Text style={styles.itemName}>{item.name}</Text>
                </View>
            );
        }
    }

    getHeaderColor(name) {
        if (name == 'Weather') {
            return allServices.colors.weather;
        } else if (name == 'Time') {
            return allServices.colors.time;
        } else if (name == 'RSS') {
            return allServices.colors.rss;
        } else if (name == 'Email') {
            return allServices.colors.email;
        } else if (name == 'Github') {
            return allServices.colors.github;
        } else if (name == 'TMDB') {
            return allServices.colors.tmdb;
        } else if (name == 'Football') {
            return allServices.colors.football;
        } else if (name == 'Crypto') {
            return allServices.colors.crypto;
        } else {
            return '#828A95';
        }
    }

    newAction(navigation, item, section, index, sections) {
        let currentService = allServices.list.filter(
            (x) => x.name == section.title
        )[0];

        navigation.navigate('NewAction', {
            serviceName: section.title,
            serviceColor: section.headerColor,
            currentService: currentService
        });
    }
}

const styles = StyleSheet.create({
    gridView: {
        marginTop: 40,
        flex: 1
    },
    itemContainer: {
        borderRadius: 10,
        padding: 10,
        height: 150
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600'
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff'
    },
    sectionHeader: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'center',
        color: 'white',
        padding: 10
    },
    sectionText: {
        color: 'white'
    },
    buttonContainer: {
        borderRadius: 10,
        padding: 10,
        height: 150
    },
    buttonLabel: {
        textAlign: 'center',
        fontSize: 100,
        color: '#fff',
        fontWeight: '200'
    }
});
