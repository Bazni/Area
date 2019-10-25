/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import { name as appName } from './app.json';

// Components
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Config from './components/Config';
import ManageUsers from './components/ManageUsers';
import NewAction from './components/NewAction';
import NewReaction from './components/NewReaction';
import EditUser from './components/EditUser';
import EditArea from './components/EditArea';
import ReactionView from './components/ReactionView';
import ServicesView from './components/ServicesView';
import ActionsView from './components/ActionsView';

const App = createStackNavigator(
    {
        Login: { screen: Login },
        Register: { screen: Register },
        Config: { screen: Config },
        ManageUsers: { screen: ManageUsers },
        EditUser: { screen: EditUser },
        EditArea: { screen: EditArea },
        NewAction: { screen: NewAction },
        NewReaction: { screen: NewReaction },
        ReactionView: { screen: ReactionView },
        ServicesView: { screen: ServicesView },
        ActionsView: { screen: ActionsView },
        Home: {
            screen: Home,
            navigationOptions: {
                gesturesEnabled: false
            }
        }
    },
    { headerMode: 'none' }
);
const tmp = createAppContainer(App);

AppRegistry.registerComponent(appName, () => tmp);
