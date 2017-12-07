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
    View, AsyncStorage, Button,FlatList, Image, WebView, ScrollView, SectionList, Alert, TextInput
} from 'react-native';

export default class CreateAlbum extends Component<{}> {
    static navigationOptions = {
        drawerLabel: 'Create Album',
    };

    constructor(props){
        super(props);


        this.state = {
            token: null,

            album_description: null,
            album_name: null,
        };


        this.addAlbum = this.addAlbum.bind(this);

        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.log(err);

            this.setState({
                token : token,


            })
        });
    }


    addAlbum(){
        console.log("call api create album (before check token")
        let user_id_from_token = this.state.token.replace(/\D/g,'');
        console.log(user_id_from_token);
        console.log("desc", this.state.album_description);
        console.log("name", this.state.album_name);

        if(this.state.album_description === null || this.state.album_name === null){
            Alert.alert('error creation album', 'Fields are not filled')
        }else{

            console.log("ok (todo refresh fields)");
            let data = new FormData();
            data.append('album_name', this.state.album_name);
            data.append('album_description', this.state.album_description);
            data.append('user_id', user_id_from_token)

            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: data,
            };

            fetch("http://10.0.2.2:8000/album/create", config)
                .then((responseData) =>
                    {
                        let json = JSON.parse(responseData._bodyText);
                        if(json.error === true){
                            Alert.alert("error", json.message)
                        }else{
                            this.props.navigation.navigate('Albumz')
                        }
                    }
                ).catch(err => console.log(err))

        }

    }


    render() {
        if(this.state.token !== null){
            return(
                <View>
                    <Text>Creer un album</Text>
                    <Text>Name</Text>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(name) => this.setState({album_name: name})}
                    />
                    <Text>Description</Text>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(description) => this.setState({album_description: description})}
                    />
                    <Button text="Add album" title="create album" onPress={this.addAlbum}/>
                </View>
            )
        }else{
            return(
                <View>
                    <Text>Vous n'est pas connecté</Text>
                </View>
            )
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
