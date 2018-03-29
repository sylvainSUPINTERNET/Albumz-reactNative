/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View, AsyncStorage, Animated, Easing
} from 'react-native';




//React-native-elements for  UI
import { Header, Card } from 'react-native-elements';

//Menu left / right (header logo droite gauche)
import HeaderLeft from './menu/headerLeft';
import HeaderRight from './menu/headerRight';

import Hyperlink from 'react-native-hyperlink'

//Custom CSS
import StyleElement from './style/style_element';


export default class Home extends Component<{}> {
    static navigationOptions = {
        drawerLabel: 'Home',
    };

    constructor(props){
        super(props);

        this.state = {
            token: null,
            spinValue: new Animated.Value(0)
        };

        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.error(err);

            this.setState({
                token : token
            })
        });

        this.spin = this.spin.bind(this);
    }


    componentDidMount () {
        this.spin()
    }

    //Animation (non used)
    spin () {
        this.state.spinValue.setValue(0);
        Animated.timing(
            this.state.spinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear
            }
        ).start(() => this.spin())
    }




    render() {
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        console.info("YOUR TOKEN : " + this.state.token);

        //if not connected
        if(this.state.token !== null){
            return (

                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Albumz', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />
                    {/*
                        <View>
                            <Animated.Image
                                style={{
                                    width: 100,
                                    height: 100,
                                    transform: [{rotate: spin}] }}
                                source={{uri: 'http://bleach.lyndir.com/roster/img/Interface/Icons/inv_sword_2h_ashbringercorrupt.jpg'}}
                            />
                        </View>
                        */}

                    <Card title="Welcom on Albumz :)">
                        {
                        <View>
                            <Text>Welcom on Albumz application, you are allowed to upload your picture and create your albums.
                                <Text>{"\n"}</Text>
                                <Text>{"\n"}</Text>
                                You also can share your albums and pictures to your all friends !
                                <Text>{"\n"}</Text>
                            </Text>
                            <Text>Your access token is :
                                <Text style={{color: 'green'}}>{this.state.token}</Text>
                            </Text>
                        </View>

                        }
                    </Card>

                </View>
            );
        }else{
            return (
                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Albumz', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />

                    <View style={{marginTop:20}}>
                        <Card title="Welcom on Albumz :)">
                            {
                                <View>
                                    <Text>Bienvenue sur Albumz application.</Text>
                                    <Hyperlink linkDefault={ true }>
                                        <Text style={ { fontSize: 15 } }>
                                            Rtrouver Albumz sur votre PC : http://10.0.2.2:8000/.
                                        </Text>
                                    </Hyperlink>
                                </View>
                            }
                        </Card>
                    </View>


                    <View style={{padding:10, marginTop:60}}>
                        <StyleElement choix="button" backgroundColor="#121d42" text="S'authentifier / login" icon='cached' navigation={this.props.navigation} />
                    </View>

                </View>
            );
        }

  }
}

