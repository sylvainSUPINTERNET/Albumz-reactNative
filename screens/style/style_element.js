/**
 * Created by SYLVAIN on 20/01/2018.
 */

//todo: This class is for manage every elemnts from react-native-elemnts in simple component (to avoid conflict with react basic elemtns)


import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements'

export default class StyleElement extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        if(this.props.choix === 'button'){
            let icon = this.props.icon;
            return(
                <Button
                    raised
                    icon={{name: icon}}
                    backgroundColor={this.props.backgroundColor}
                    title={this.props.text}
                    onPress={() => this.props.navigation.navigate('Authentification')}
                />
            )
        }
    }
}