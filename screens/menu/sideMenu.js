/**
 * Created by SYLVAIN on 31/01/2018.
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './sideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Image, Button, Linking  } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';


import Hyperlink from 'react-native-hyperlink'

import { SocialIcon, Divider } from 'react-native-elements'



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
                    <View style={styles.centerContainer}>
                        <Image style={styles.logo}
                               source={require('../../assets/logo.png')}
                        />
                    </View>

                    <View>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
                                Home
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


                        <Text>{"\n"}</Text>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Search')}>
                                Rechercher
                            </Text>
                        </View>

                    </View>
                </ScrollView>
                <View style={styles.footerContainer}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row', padding: 50}}>
                        <SocialIcon
                            raised={false}
                            type='github'
                            iconSize={35}
                            onPress={
                                () => Linking.canOpenURL("https://github.com/sylvainSUPINTERNET/Albumz-reactNative").then(supported => {
                                    if (!supported) {
                                        console.log('error supported')
                                    } else {
                                        return Linking.openURL("https://github.com/sylvainSUPINTERNET/Albumz-reactNative")
                                    }
                                }).catch(err => console.error('An error occurred', err))
                            }
                        />
                        <SocialIcon
                            raised={false}
                            type='gitlab'
                            iconSize={35}
                            onPress={
                                () => Linking.canOpenURL("https://github.com/sylvainSUPINTERNET/Albumz-reactNative").then(supported => {
                                    if (!supported) {
                                        console.log('error supported')
                                    } else {
                                        return Linking.openURL("https://github.com/sylvainSUPINTERNET/Albumz-reactNative")
                                    }
                                }).catch(err => console.error('An error occurred', err))
                            }
                        />
                        <SocialIcon
                            raised={false}
                            type='instagram'
                            iconSize={35}
                            onPress={
                                () => Linking.canOpenURL("https://github.com/sylvainSUPINTERNET/Albumz-reactNative").then(supported => {
                                    if (!supported) {
                                        console.log('error supported')
                                    } else {
                                        return Linking.openURL("https://github.com/sylvainSUPINTERNET/Albumz-reactNative")
                                    }
                                }).catch(err => console.error('An error occurred', err))
                            }
                        />
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