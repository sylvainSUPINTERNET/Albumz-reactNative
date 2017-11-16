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
    View, AsyncStorage, Button,FlatList
} from 'react-native';



export default class Home extends Component<{}> {
    static navigationOptions = {
        drawerLabel: 'My pictures',
    };

    constructor(props){
        super(props);


        this.state = {
            token: null,
            pictures: null,
            displayPictures: false,
        };

    this.seeMyPictures = this.seeMyPictures.bind(this);

        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.log(err);

            this.setState({
                token : token
            })
        });
    }

    //TODO: clear token -get only id numeric- THEN call api get all pictures
    // TODO: THEN get path of picture and send into QRcode (npm install before) and regarder

    seeMyPictures(){
        this.state.displayPictures = true;
        if(this.state.token !== null){
            let user_id_from_token = this.state.token.replace(/\D/g,'');

            let data = new FormData();
            data.append('pictures_uploaded_by_user_token', user_id_from_token);


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

            fetch("http://10.0.2.2:8000/pictures/my/uploaded", config)
                .then((responseData) => {
                    try{
                        let json = JSON.parse(responseData._bodyText);
                        let arrayPictures = json.map(function(item){
                            return item.name.toString();
                        });
                        //TODO: ICI avec le tableau => utiliser une listView pour afficher toutes les images name + date_publication
                        //TODO: Une fois ca fait proposer pour chacune un QRCODE (npm install) qui prendre le name image + URL (API a crééer une route pour display l'image selon son name) sur un clik

                        this.setState({
                            pictures: arrayPictures,
                        });
                        console.log(this.state.pictures);

                    }catch (err){
                        console.log(err);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }else{
            console.log("vous êtes DECO LA PUTEIN DE VOUS");
        }
    }






    render() {
        if(this.state.token !== null && this.state.displayPictures === false){
            return (
                <View style={styles.container}>
                    <Text>Your pictures uploaded</Text>
                    <Button title="seeMyPictures" onPress={this.seeMyPictures} text="Show my pictures"/>
                </View>
            );
        }else if(this.state.pictures !== null && this.state.displayPictures === true){
            //TODO listView of pictures avec leur element + porposer un QRcode en fonction du nom + URL (localhost) (a faire coté api pour display)
            return(
                <Text>
                    {this.state.pictures}
                </Text>
            );
        } else{
            return (
                <View style={styles.container}>
                    <Text>No account or not connected ? let's start go to Authentification ! :)</Text>
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
