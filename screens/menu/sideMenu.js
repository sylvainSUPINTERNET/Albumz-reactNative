/**
 * Created by SYLVAIN on 31/01/2018.
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './sideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Image} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';


class SideMenu extends Component {
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    render () {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{backgroundColor: 'whitesmoke'}}>
                        <Image style={styles.logo}
                               source={require('../../assets/logo.png')}
                        />
                    </View>

                    <View>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
                                Home
                                <Icon
                                raised
                                name='bars'
                                color='black'/>
                            </Text>
                        </View>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Authentification')}>
                                Authentification
                            </Text>
                        </View>
                    </View>
                    <View>

                        <Text>{"\n"}</Text>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Upload')}>
                                Upload
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('MyPicture')}>
                                My pictures
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Albumz')}>
                                Albumz
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('CreateAlbum')}>
                                Album Creation
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.footerContainer}>
                    <Text>Nous soutenir ? c'est ici !</Text>
                    <View>
                        <Text>Nous contacter ?</Text>
                        <Text>sylvain.joly@supinternet.fr | 0642561130</Text>
                    </View>
                </View>
            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;