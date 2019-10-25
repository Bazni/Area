import { createBottomTabNavigator } from 'react-navigation';

import ActionsView from './ActionsView';
import ProfileView from './ProfileView';

export default createBottomTabNavigator({
    Areas: { screen: ActionsView },
    Profile: { screen: ProfileView }
});
