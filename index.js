
import { AppRegistry } from 'react-native';

import { StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';

/*Screens*/
import Upload from './screens/Upload';
import Home from './screens/Home';
import Authentification from './screens/Authentification';
import MyPictures from './screens/MyPictures';
import Albumz from './screens/Albumz';
import CreateAlbum from './screens/CreateAlbum';
import Search from './screens/Search';


import SideMenu from './screens/menu/sideMenu';

//Screens routes
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
    MyPicture: {
        screen: MyPictures
    },
    Albumz: {
        screen: Albumz
    },
    CreateAlbum:{
        screen: CreateAlbum
    },
    Search: {
        screen: Search
    },


}, {
    contentComponent: SideMenu,
    drawerWidth: 300
});



AppRegistry.registerComponent('AlbumzV2Ejected', () => drawerMenu);
