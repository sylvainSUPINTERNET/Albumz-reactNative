/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet, View, Text, ScrollView, AsyncStorage, Alert, Vibration, Picker
} from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';

import {Card, FormLabel, FormInput , Header, Button} from 'react-native-elements'


import StyleElement from './style/style_element';

import HeaderLeft from './menu/headerLeft';
import HeaderRight from './menu/headerRight';

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
            message_selected: "",


            album_selected: null, // json response from api
            album_selected_array: [], //convert to array of name of album (for picker)
            album_choose_name: "", //choose album name selected from picker
            picture_label: "",
            picture_category: "",
        };


        //set token if user already connected
        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.error(err);

            this.setState({
                token : token
            })
        });

        this.getSelectedImages = this.getSelectedImages.bind(this); //to use this.state
        this.upload = this.upload.bind(this); //to use this.state
        this.makeIdForPic = this.makeIdForPic.bind(this); //to use this.state
    }


    getSelectedImages(picturesSelected){

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
        console.info(this.state.nb_pictures_selected);
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


    //generate random string for the picture
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
                            console.error(err);
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


                    if(uriList.length > 0){
                        //convert uri to url
                        //en base de donnée il y aura les deux
                        /*
                         for(let x = 0; x < uriList.length; x++){
                         console.log(uriList[x]);
                         }
                         */

                        let data = new FormData();
                        let renamePic = this.makeIdForPic();
                        let salt = this.makeIdForPic();
                        data.append('picture_upload', {uri: uriList[0], name: salt + renamePic + '.jpg', type: 'image/jpg'});


                        //trim token to get only id to find user for insert with OneToMany
                        let id_from_token = this.state.token.replace(/\D/g,'');
                        data.append('picture_user_token', id_from_token);


                        data.append('picture_label', this.state.picture_label.toString())
                        data.append('picture_category',  this.state.picture_category.toString())


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
                                                console.error(err);
                                            })



                                    }
                                }
                            })
                            .catch(err => {
                                console.error(err);
                            })


                    }else{
                        Alert.alert("Please minimum 1 picture to upload !!!")
                    }
                }

            }

    }




  render() {
      console.log("albums",     this.state.album_selected_array)
               let albumItem = this.state.album_selected_array.map( (album_name, i) => {
                    return <Picker.Item key={i} value={album_name} label={album_name} />
                });
      if(this.state.token !== null){
          return (
              <ScrollView style={styles.container}>
                  <Header
                      leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                      centerComponent={{ text: 'Vos photos', style: { color: '#fff' } }}
                      rightComponent={<HeaderRight navigation={this.props.navigation} />}
                  />
                  <CameraRollPicker
                      callback={this.getSelectedImages}
                      maximum = {1}
                      emptyText = "Aucune photo trouvé sur votre téléphone !"/>
                  <Picker        itemStyle={{ backgroundColor: 'lightgrey', marginLeft: 0, paddingLeft: 15 }}
                                 itemTextStyle={{ fontSize: 18, color: 'black' }}
                          selectedValue={this.state.album_choose_name}
                      onValueChange={(itemValue, itemIndex) => this.setState({album_choose_name: itemValue})}>
                      <Picker.Item label=" " value= " "/>
                      {albumItem}
                  </Picker>
                  <FormLabel>Label de la photo</FormLabel>
                  <FormInput onChangeText={(labelPic) => this.setState({picture_label: labelPic})}/>

                  <FormLabel>Catégory</FormLabel>
                  <FormInput onChangeText={(categoryPic) => this.setState({picture_category: categoryPic})}/>

                  <View style={{flex:2}}>
                      <Text style={{paddingLeft: 10, color: 'red', fontSize: 16}}>{this.state.message_selected}</Text>
                      <Button text="Upload" title="Upload" onPress={this.upload} borderRadius={10} backgroundColor="#008080" fontSize={16}/>
                  </View>
              </ScrollView>
          );
      }else{
          return (
              <View>
                  <Header
                      leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                      centerComponent={{ text: 'Vos photos (non connecté)', style: { color: '#fff' } }}
                      rightComponent={<HeaderRight navigation={this.props.navigation} />}
                  />

                  <Card title="Uploader vos photos à volonter !">
                      {
                          <View>
                                <Text>Afin de profiter de la fonctionnalité "Uploader votre photo", vous devez d'abord vous connecter</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
