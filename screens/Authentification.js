/**
 * Created by SYLVAIN on 14/11/2017.
 */


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    AsyncStorage
} from 'react-native';


export default class Authentification extends Component<{}> {
    static navigationOptions = {
        drawerLabel: 'Authentification',
    };

    constructor(props){
        super(props);
        this.state = {
            token: null
        }

        //set token if user already connected
        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.log(err);

            this.setState({
                token : token
            })
        });


        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.disconnect = this.disconnect.bind(this);

    }

    register(){
        console.log("test clicked register");

        let data = new FormData();
        data.append('user_firstname', this.state.register_firstname);
        data.append('user_lastname', this.state.register_lastname);
        data.append('user_email', this.state.register_email);
        data.append('user_password', this.state.register_password);

        // Create the config object for the POST
        // You typically have an OAuth2 token that you use for authentication
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: data,
        };

        fetch("http://10.0.2.2:8000/user/register", config)
            .then((responseData) => {
                //console.log(responseData);
               //if response error == false setState token ELSE setState error.message
                try {
                    let json = JSON.parse(responseData._bodyText);
                    if(json[0].error === false){
                        this.setState({
                            token: json[0].token
                        })
                        console.log(this.state.token);
                        AsyncStorage.setItem('user_token', this.state.token);
                        AsyncStorage.getItem('user_token').then(function(token){
                            console.log(token);
                        }).catch(err => console.log(err))
                    }else{
                        this.setState({
                            error : json[0].message
                        })
                        console.log(this.state.error);
                    }
                } catch (err) {
                    //if not valid json
                    console.error(err);
                    this.setState({
                        error: err
                    })
                }

            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: err
                })
            })

    }

    login(){
        let data = new FormData();
        data.append('user_firstname', this.state.login_firstname);
        data.append('user_lastname', this.state.login_lastname);
        data.append('user_email', this.state.login_email);
        data.append('user_password', this.state.login_password);

        // Create the config object for the POST
        // You typically have an OAuth2 token that you use for authentication
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: data,
        };

        fetch("http://10.0.2.2:8000/user/login", config)
            .then((responseData) => {
                //console.log(responseData);
                //if response error == false setState token ELSE setState error.message
                try {
                    let json = JSON.parse(responseData._bodyText);
                    if(json[0].error === false){
                        this.setState({
                            token: json[0].token
                        })
                        console.log(this.state.token);
                        AsyncStorage.setItem('user_token', this.state.token);
                         AsyncStorage.getItem('user_token').then(function(token){
                            console.log(token);
                            }).catch(err => console.log(err))

                    }else{
                        this.setState({
                            error : json[0].message
                        })
                        console.log(this.state.error);
                    }
                } catch (err) {
                    //if not valid json
                    console.error(err);
                    this.setState({
                        error: err
                    })
                }

            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: err
                })
            })
    }


    disconnect(){
        AsyncStorage.removeItem("user_token")
        this.setState({
            token: null
        })
    }



    render() {
        if(this.state.token !== null) {
            return (
                <View>
                    <Text>You are already connected ! </Text>
                    <Button title="disconnectd" onPress={this.disconnect} text="Disconnected now"/>
                </View>
            );
        }else{
            return (
                <View>
                    <Text>Authentification</Text>
                    <View>
                        <Text>Register</Text>
                        <Text>Firstname</Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(firstname) => this.setState({register_firstname: firstname})}
                        />
                        <Text>Lastname</Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(lastname) => this.setState({register_lastname: lastname})}
                        />
                        <Text>Email</Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(email) => this.setState({register_email: email})}
                        />
                        <Text>Password</Text>
                        <TextInput
                            secureTextEntry={true}
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(password) => this.setState({register_password: password})}
                        />
                        <Button title="register" onPress={this.register} text="Register now !"/>
                    </View>

                    <View>
                        <Text>Login</Text>
                        <Text>Firstname</Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(firstname) => this.setState({login_firstname: firstname})}
                        />
                        <Text>Lastname</Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(lastname) => this.setState({login_lastname: lastname})}
                        />
                        <Text>Email</Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(email) => this.setState({login_email: email})}
                        />
                        <Text>Password</Text>
                        <TextInput
                            secureTextEntry={true}
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(password) => this.setState({login_password: password})}
                        />
                        <Button title="login" onPress={this.login} text="Login now !"/>
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
