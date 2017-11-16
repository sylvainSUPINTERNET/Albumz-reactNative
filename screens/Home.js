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
  View, AsyncStorage
} from 'react-native';



export default class Home extends Component<{}> {
    static navigationOptions = {
        drawerLabel: 'Home',
    };

    constructor(props){
        super(props);

        this.state = {
            token: null
        };

        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.log(err);

            this.setState({
                token : token
            })
        });
    }








    render() {
        console.log("YOUR TOKEN : " + this.state.token);
        if(this.state.token !== null){
            return (
                <View style={styles.container}>
                    <Text>Home page</Text>
                    <Text>Your token : {this.state.token}</Text>
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
