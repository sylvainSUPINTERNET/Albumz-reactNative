
import { AppRegistry } from 'react-native';

import { StackNavigator, DrawerNavigator } from 'react-navigation';

/*Screens*/
import Upload from './screens/Upload';
import Home from './screens/Home';
import Authentification from './screens/Authentification';


//faire le logout (check if one key user_token is not empty in storage
//if not empty => user is connected so display the button "logout" into the menu and create a method to remove th keyItem


const drawerMenu = DrawerNavigator({
    Home: {
        screen: Home,
    },
    Authentification: {
        screen: Authentification
    },
    Upload: {
        screen: Upload,
    },
});

AppRegistry.registerComponent('AlbumzV2Ejected', () => drawerMenu);