/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet, View, Button, Text, ScrollView, AsyncStorage, Alert, Vibration, Picker
} from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';


// IMPORTANT, if you used Emulator dont forget to take some pics ! .....


//UTILISER this.setState permet de faire l'asynchrone


//On peut aussi stocker un component dans une variabl et via le bind utilise desmethod avec des ref
//voir SuiteUI tp

export default class Upload extends Component<{}> {


    static navigationOptions = {
        drawerLabel: 'Upload',
    };



    constructor(props){
        super(props);

        this.state = {
            token: "",
            pictures: "", // array d'objet comprenant object => image : { uri height width }
            nb_pictures_selected: 0,
            message_selected: "Veuillez sélectionner les photos pour votre albumz ",


            album_selected: null, // json response from api
            album_selected_array: [], //convert to array of name of album (for picker)
            album_choose_name: "", //choose album name selected from picker
        };




        //set token if user already connected
        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.log(err);

            this.setState({
                token : token
            })
        });

        this.getSelectedImages = this.getSelectedImages.bind(this); //to use this.state
        this.upload = this.upload.bind(this); //to use this.state
        this.makeIdForPic = this.makeIdForPic.bind(this); //to use this.state
    }


    getSelectedImages(picturesSelected){

        //TO DO : fixed le soucis de sa commence a 1 sur le selectimage et pas à 0 ? donc message est erroné

        let nbOfPictures = picturesSelected.length;


        if(nbOfPictures > 0){
            console.log(`il y a ${nbOfPictures} selected`);
            this.setState({
                pictures : picturesSelected
            });

            this.setState({
                nb_pictures_selected : nbOfPictures
            })
        }

        //picturesSelected.width / uri / heigth


        //display message Vous avez select : X pictures
        console.log(this.state.nb_pictures_selected);
        if(this.state.nb_pictures_selected === 0){
            this.setState({
                message_selected : "Veuillez sélectionner les photos pour votre albumz "
            })

        }else{

            this.setState({
                message_selected : `${this.state.nb_pictures_selected} photos selectionnées `
            })
        }

        if(this.state.nb_pictures_selected === 1){
            Alert.alert("Vous avez déjà une photo séléctioné")
        }


    }


    makeIdForPic(){
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    componentDidMount(){
        //prepare list of album for picker
        AsyncStorage.getItem('user_token', (err, token) => {
            console.log("token exist ? ", token);
            if(err){
                console.log("ERROR GET ITEM ", err)
            }else{
                if(token !== null){
                    let data = new FormData();


                    //trim token to get only id to find user for insert with OneToMany
                    let id_from_token = token.replace(/\D/g,'');
                    console.log(id_from_token);

                    data.append('user_id', id_from_token);


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

                    fetch("http://10.0.2.2:8000/album/list", config)
                        .then((responseData) => {
                            let json = JSON.parse(responseData._bodyText);
                            console.log("YOUR ALBUMS => ", json);
                            if(json[0].error === true) {
                                Alert.alert(json[0].message);
                                console.log("Pas d'album");
                            }else{
                                //set album list
                                //convert into array

                                this.setState({
                                    album_selected: json,
                                });
                                let array_album_selected = this.state.album_selected.map(x => x.name);
                                this.setState({
                                    album_selected_array: array_album_selected
                                });

                                console.log("ARRAY CONVERT ALBUM LIST", this.state.album_selected_array)
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })

                }else{
                    this.state.token = null;
                    //do nothing
                }
            }
        });
    }


        upload(){
        //console.log(`Photo qui vont etre upload => ${this.state.pictures}`);
            //timer vibration
            const DURATION = 1000;
            const PATTERN = [1000, 2000, 3000]

            if(this.state.token === null){
                Alert.alert("Please make sure you are connected !")
                Vibration.vibrate(DURATION)

            }else{

                if(this.state.album_choose_name === null || this.state.album_choose_name === ""){
                    Alert.alert("Please select an album !");
                }else{
                    console.log("album selected : ", this.state.album_choose_name);



                    let uriList = [];
                    if(this.state.pictures.length > 0){
                        for(let i=0; i<this.state.pictures.length; i++){
                            uriList.push(this.state.pictures[i].uri);
                        }
                    }


                    //console.log(uriList);
                    if(uriList.length > 0){
                        //convert uri to url
                        //en base de donnée il y aura les deux
                        /*
                         for(let x = 0; x < uriList.length; x++){
                         console.log(uriList[x]);
                         }
                         */
                        //TODO: upload a group of pic ! - change API and manage an array not a simply variable
                        //TODO : so picture_upload (param to send its an array of file)

                        //TODO SUR L'API
                        //TODO : AJOUTER creation user PUIS sur l'entité image ID_user (revoir pictures/add aussi pour ajouter id user pour recuperr ensuite sur l'album)

                        let data = new FormData();
                        let renamePic = this.makeIdForPic();
                        let salt = this.makeIdForPic();
                        data.append('picture_upload', {uri: uriList[0], name: salt + renamePic + '.jpg', type: 'image/jpg'});


                        //trim token to get only id to find user for insert with OneToMany
                        let id_from_token = this.state.token.replace(/\D/g,'');
                        data.append('picture_user_token', id_from_token);


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

                        var self = this;
                        fetch("http://10.0.2.2:8000/pictures/add", config)
                            .then((responseData) => {
                                console.log(responseData);
                                //todo: get id ET ajouter ans lalbum (get picture_id from response pour prepare l'ajout picture
                                //add picture to album
                                let json = JSON.parse(responseData._bodyText);
                                if(self.state.album_choose_name === " "){
                                    //value default choose
                                    Alert.alert("Please choose an album !")
                                }else{
                                    if(json[0].error === true){
                                        Alert.alert(json[0].message)
                                    }else{
                                        let picture_id = json[0].picture_id;
                                        let album_name = self.state.album_choose_name;

                                        console.log(`add album : ${album_name} the picture ${picture_id}`)
                                        let data = new FormData();

                                        data.append('picture_id', picture_id);
                                        data.append('album_name', album_name);

                                        const config = {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'multipart/form-data;',
                                            },
                                            body: data,
                                        };

                                        fetch("http://10.0.2.2:8000/album/picture/add", config)
                                            .then((responseData) => {
                                                let json = JSON.parse(responseData._bodyText);
                                                console.log("PICTURE ADDED IN ALBUM => ", json);
                                                if(json[0].error === true) {
                                                    Alert.alert(json[0].message);
                                                    console.log("Error added picture into album");
                                                }else{
                                                    //SUCCESS
                                                    Alert.alert(json[0].message)
                                                }
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            })



                                    }
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })


                    }else{
                        Alert.alert("Please minimum 1 picture to upload !!!")
                    }
                }

            }

        //Faire un fetch post vers notre api symfony qui va recuperer la liste des uri passer en parametre et les uploads

    }




  render() {

            //todo : fixed bug (if only one album, the value is consider as no album selected
               let albumItem = this.state.album_selected_array.map( (album_name, i) => {
                    return <Picker.Item key={i} value={album_name} label={album_name} />
                });


            //todo: faire la gestion d'erreur (pas connecté, array album empty (juste display go create album), et affichage classique album list + picture)
                return (

                    <ScrollView style={styles.container}>
                        <Text>Vos photos</Text>
                        <CameraRollPicker
                            callback={this.getSelectedImages}
                            maximum = {1}
                            emptyText = "Aucune photo trouvé sur votre téléphone !"/>
                        <Picker
                            selectedValue={this.state.album_choose_name}
                            onValueChange={(itemValue, itemIndex) => this.setState({album_choose_name: itemValue})}>
                            <Picker.Item label=" " value= " " />
                            {albumItem}
                        </Picker>

                        <View style={{flex:2}}>
                            <Text>{this.state.message_selected}</Text>
                            <Button text="Upload" title="Upload your selected pictures" onPress={this.upload}/>
                        </View>
                    </ScrollView>
                );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
