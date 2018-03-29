/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View, AsyncStorage, Alert
} from 'react-native';

import HeaderLeft from './menu/headerLeft';
import HeaderRight from './menu/headerRight';



import StyleElement from './style/style_element';

import { Header, Card, Button, FormLabel, FormInput } from 'react-native-elements';


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
                console.error(err);

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

            console.debug("ok (todo refresh fields)");
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
                ).catch(err => console.error(err))

        }

    }


    render() {
        if(this.state.token !== null){
            return(
                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Crée un album', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />

                    <Card title="Ajouter un album">
                            <FormLabel>Nom de l'album</FormLabel>
                            <FormInput onChangeText={(name) => this.setState({album_name: name})}/>

                            <FormLabel>Description</FormLabel>
                            <FormInput onChangeText={(description) => this.setState({album_description: description})}/>
                        <Text>{"\n"}</Text>
                            <Button backgroundColor={'#2ed573'} borderRadius={5} icon={{name: 'check', type: 'font-awesome'}} text="Ajouter" title="Ajouter" onPress={this.addAlbum}/>
                        <Text>{"\n"}</Text>
                    </Card>

                </View>
            )
        }else{
            return(
                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Crée un album (non connecté)', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />
                    <Card title="Crée un album sur Albumz">
                        {
                            <View>
                                <Text>Afin de profiter de cette fonctionnalité, vous devez d'abord vous identifier !</Text>
                                <View style={{padding:10, marginTop:60}}>
                                    <StyleElement choix="button" backgroundColor="#121d42" text="S'authentifier / login" icon='cached' navigation={this.props.navigation} />
                                </View>
                            </View>

                        }
                    </Card>
                </View>
            )
        }

    }

}
