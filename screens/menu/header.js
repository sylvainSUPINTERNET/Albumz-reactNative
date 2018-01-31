/**
 * Created by SYLVAIN on 14/12/2017.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';


/*
const HeaderMenu = ({ }) => (
    <Icon
        raised
        name='dots-three-vertical'
        color='#f50'
        onPress={() => this.props.navi.navigate('OpenDrawer')} />
);

export default HeaderMenu
*/


export default class HeaderMenu extends Component<{}> {
    constructor(props){
        super(props);

        this.state = {};
    }

    render() {

        return(
            <Icon
                    raised
                    name='bars'
                    color='#fff'
                onPress={() => this.props.navigation.navigate('DrawerOpen')} />
        )
    }
}