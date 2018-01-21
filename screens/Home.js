/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
    ImageStore,
  View, AsyncStorage, Animated, Easing, Settings, Image, Button, Linking
} from 'react-native';





import { Header } from 'react-native-elements';

import { Card } from 'react-native-elements'




import HeaderMenu from './menu/header';


import Hyperlink from 'react-native-hyperlink'


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
                console.log(err);

            this.setState({
                token : token
            })
        });

        this.spin = this.spin.bind(this);
    }


    componentDidMount () {
        this.spin()
    }
    spin () {
        this.state.spinValue.setValue(0)
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

        console.log("YOUR TOKEN : " + this.state.token);
        if(this.state.token !== null){
            // TODO// header on each page and see why we cant navigate ???
            return (

                <View>
                    <Header
                        leftComponent={<HeaderMenu navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Albumz', style: { color: '#fff' } }}
                        rightComponent={{ icon: 'home', color: '#fff' }}
                    />

                        <View>
                            <Animated.Image
                                style={{
                                    width: 100,
                                    height: 100,
                                    transform: [{rotate: spin}] }}
                                source={{uri: 'http://bleach.lyndir.com/roster/img/Interface/Icons/inv_sword_2h_ashbringercorrupt.jpg'}}
                            />
                        </View>

                    <Card title="Welcom on Albumz :)">
                        {
                        <View>
                            <Text>Welcom on Albumz application, you are allowed to upload your picture and create your albums. You also can share your albums and pictures to your all friends !</Text>
                            <Text>Your token : {this.state.token}</Text>
                        </View>

                        }
                    </Card>

                </View>
            );
        }else{
            return (
                <View>
                    <Header
                        leftComponent={<HeaderMenu navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Albumz', style: { color: '#fff' } }}
                        rightComponent={{ icon: 'home', color: '#fff' }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
