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
    View, AsyncStorage, Button,FlatList, Image, WebView, ScrollView, SectionList, Alert, Share, Linking
} from 'react-native';

import QRCode from 'react-native-qrcode';


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
    this.deletePicture = this.deletePicture.bind(this);
    this.sharePicture = this.sharePicture.bind(this);

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
                console.log(responseData);
                //TODO: If not pictures, checker la response API et display 'vous n'avez pas encor d'image !'

                    try{
                        let json = JSON.parse(responseData._bodyText);
                        if(json[0].error === true){ // true beause, No image to display error return from API
                            Alert.alert(json[0].message);
                            console.log("VOUS AVEZ PAS D4IMAGE");
                            //If every image have been deleted => redirect on button "Display image"
                            this.setState({
                                displayPictures: false
                            })
                        }

                        let arrayPictures = json.map(function(item){
                            return item.name.toString();
                        });

                            this.setState({
                                json_pictures: json,
                                pictures: arrayPictures,
                            });
                            console.log("your_pictures",this.state.pictures);


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

    //TODO:: Ajouter une route coté API return le QRcode => (a mettre sur le bouton linking)

    sharePicture(url_pic){
        Share.share({
            message: url_pic, //TODO // add a route in API to send a file and convert into QRcode php and display on share
            url: url_pic,
            title: 'Albumz - PC'
        }, {
            // Android only:
            dialogTitle: 'Albumz',
        })
    }

    deletePicture(picture_id){
        const config = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
        };

        fetch(`http://10.0.2.2:8000/pictures/delete/${picture_id}`, config)
            .then((responseData) => {
                console.log(responseData);
                let json = JSON.parse(responseData._bodyText);
                if(json[0].error === false){
                    //TODO: refresh la scene
                    console.log("success_delete", "refresh scene")
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
                                console.log(responseData);

                                try{
                                    let json = JSON.parse(responseData._bodyText);

                                    console.log(json[0]);

                                    /*
                                    if(json[0].error === true){ // true beause, No image to display error return from API
                                        Alert.alert(json[0].message);
                                        console.log("VOUS AVEZ PAS D4IMAGE");
                                        //If every image have been deleted => redirect on button "Display image"
                                        this.setState({
                                            displayPictures: false
                                        })
                                    }
                                    */

                                    let arrayPictures = json.map(function(item){
                                        return item.name.toString();
                                    });

                                    this.setState({
                                        json_pictures: json,
                                        pictures: arrayPictures,
                                    });

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

            })

        //fetch delete SI json return error = false => on setState le tableau d'image entier, ou enlever l'image qui vient d'être delete
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
            console.log("LENGTH", this.state.pictures.length)
            //console.log("flat_list_array(json)", this.state.json_pictures);
            console.log("flat_list_json", this.state.json_pictures[0].name);

            return(
            <ScrollView>
                <FlatList
                    data={this.state.json_pictures}
                    renderItem={
                        ({item}) =>
                        <View>
                            <Text>Publié le : {item.date_publication}</Text>
                            <Image style={{width: 150, height: 150}}
                                   source={{uri:`http://10.0.2.2/albumzAPI/var/public/upload/pictures/${item.name}`}}/>
                            <Text>{"\n"}</Text>
                            <Text>QRcode</Text>
                            <QRCode
                                value={`http://localhost:8000/pictures/${item.name}/display`}
                                size={200}
                                bgColor='purple'
                                fgColor='white'/>

                            <Text>{"\n"}</Text>
                            <Text>Share pictures</Text>
                            <Button text="See on Web App" title="See picture on web app" onPress={() => Linking.openURL(`http://10.0.2.2/albumzAPI/var/public/upload/pictures/${item.name}`).catch(err => console.error('An occured error', err))}/>
                            <Button text="Get QRcode" title="See QRCode on web app" onPress={() => Linking.openURL(`http://10.0.2.2:8000/pictures/${item.name}/QRCode/display`).catch(err => console.error('An occured error', err))}/>

                            <Button text="Share this picture" title="sharePic" onPress={() => this.sharePicture(`http://localhost/albumzAPI/var/public/upload/pictures/${item.name}`)}/>

                            <Button title="Delete" onPress={()=>this.deletePicture(item.id)} text="Delete this picture"/>
                        </View>
                    }
                />
            </ScrollView>
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
