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
  View, AsyncStorage, Animated, Easing, Settings, Image
} from 'react-native';



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
            return (
                <View style={styles.container}>
                    <Text>Home page</Text>
                    <Text>Your token : {this.state.token}</Text>
                    <Animated.Image
                        style={{
                            width: 227,
                            height: 200,
                            transform: [{rotate: spin}] }}
                        source={{uri: 'https://s3.amazonaws.com/media-p.slid.es/uploads/alexanderfarennikov/images/1198519/reactjs.png'}}
                    />


                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <Text>Home page</Text>
                    <Text>Please, go to signup or login before use us app :)</Text>
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
