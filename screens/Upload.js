/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet, View, Button, Text, ScrollView, AsyncStorage, Alert
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
            message_selected: "Veuillez sélectionner les photos pour votre albumz "
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


    }


    makeIdForPic(){
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }



        upload(){
        //console.log(`Photo qui vont etre upload => ${this.state.pictures}`);
            if(this.state.token === null){
                Alert.alert("Please make sure you are connected !")
            }else{

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

            fetch("http://10.0.2.2:8000/pictures/add", config)
                .then((responseData) => {
                    console.log(responseData);
                })
                .catch(err => {
                    console.log(err);
                })


        }

            }

        //Faire un fetch post vers notre api symfony qui va recuperer la liste des uri passer en parametre et les uploads

    }




  render() {
    return (
      <ScrollView style={styles.container}>
          <Text>Vos photos</Text>
        <CameraRollPicker
            callback={this.getSelectedImages} />
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