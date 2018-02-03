/**
 * Created by SYLVAIN on 14/12/2017.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
    Text,View
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';



export default class HeaderRight extends Component<{}> {
    constructor(props){
        super(props);

        this.state = {};
    }

    render() {

        return(
            <Icon
                raised
                name='home'
                color='#fff'
                onPress={() => this.props.navigation.navigate('Home')} />
        )
    }
}









