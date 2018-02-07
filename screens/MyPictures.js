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
    View, AsyncStorage,FlatList, Image, WebView, ScrollView, SectionList, Alert, Share, Linking, TouchableHighlight, TouchableOpacity
} from 'react-native';

import QRCode from 'react-native-qrcode';

import { Header, Card, Button, Tile, Icon } from 'react-native-elements';

import HeaderLeft from './menu/headerLeft';
import HeaderRight from './menu/headerRight';


import StyleElement from './style/style_element';

import Moment from 'moment';





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
            isVisible: false,
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
                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Vos photos', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />
                    <View>
                        <Tile
                            imageSrc={{require: ('./assets/are_you_sure_about_that.jpg')}}
                            title="Vous êtes sur le point d'accèder à votre gallerie photos "
                            contentContainerStyle={{height: 160}}>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
                                <Button                   icon={{name: 'times', type: 'font-awesome'}}  // optional
                                                                    backgroundColor="#CF000F" borderRadius={10} title="Annuler" onPress={() => this.props.navigation.navigate('Home')} text="Back"/>
                                <Button  icon={{name: 'check', type: 'font-awesome'}} backgroundColor="#008080" borderRadius={10}  title="Accéder" onPress={this.seeMyPictures} text="Pictures gallery"/>
                            </View>
                        </Tile>
                    </View>
                </View>
            );
        }else if(this.state.pictures !== null && this.state.displayPictures === true){
            console.log("LENGTH", this.state.pictures.length)
            //console.log("flat_list_array(json)", this.state.json_pictures);
            console.log("flat_list_json", this.state.json_pictures[0].name);

            return(
            <ScrollView>
                <Header
                    leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                    centerComponent={{ text: 'Vos photos', style: { color: '#fff' } }}
                    rightComponent={<HeaderRight navigation={this.props.navigation} />}
                />

                <FlatList
                    data={this.state.json_pictures}
                    keyExtractor={(item, index) => index}
                    renderItem={
                        ({item}) =>
                        <Card title={item.label}>
                                <Text style={{textAlign:'center', fontSize:16 ,fontWeight: 'bold'}} icon={{name: 'clock', type: 'font-awesome'}}  >
                                    {Moment(item.date_publication).format('DD-MM-YYYY à hh:mm')}
                                </Text>
                            <View style={{alignItems: 'center', justifyContent:'space-between', flex: 1, flexDirection: 'row', paddingTop: 35}}>
                                    <Image style={{width: 150, height: 150}}
                                           source={{uri:`http://10.0.2.2/albumzAPI/var/public/upload/pictures/${item.name}`}}
                                           resizeMode="cover"
                                    />
                                <QRCode
                                    value={`http://localhost:8000/pictures/${item.name}/display`}
                                    size={150}
                                    bgColor='purple'
                                    fgColor='white'/>
                            </View>
                            <Text>{"\n"}</Text>
                                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row', paddingTop: 35}}>
                                    <TouchableOpacity style={{padding: 10}} onPress={() => Linking.openURL(`http://10.0.2.2:8000/pictures/${item.name}/QRCode/display`).catch(err => console.error('An occured error', err))}>
                                        <Icon
                                            name='filter-center-focus'
                                            color='#7f8c8d'
                                            size={60}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{padding: 10}} onPress={() => this.sharePicture(`http://10.0.2.2/albumzAPI/var/public/upload/pictures/${item.name}`)}>
                                        <Icon
                                            name='send'
                                            color='#2980b9'
                                            size={60}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{padding:10}} onPress={() => Linking.openURL(`http://10.0.2.2/albumzAPI/var/public/upload/pictures/${item.name}`).catch(err => console.error('An occured error', err))}>
                                        <Icon
                                            name='dvr'
                                            color='#2c3e50'
                                            size={60}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{paddingLeft: 35}} onPress={()=>this.deletePicture(item.id)}>
                                        <Icon
                                            name='delete'
                                            color='#c0392b'
                                            size={60}
                                        />
                                    </TouchableOpacity>

                        </View>
                        <View>
                            <Text style={{textAlign: 'right'}}>Catégorie : {item.category}</Text>
                        </View>
                        </Card>
                            }
                />
            </ScrollView>
                );
        } else{
            return (
                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Vos photos (non connecté)', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />

                    <View style={{marginTop:20}}>
                        <Card title="Voir vos photo">
                            {
                                <View>
                                    <Text>Pour consulter vos images uploadé à volonté, veuillez vous authentifier</Text>
                                </View>
                            }
                        </Card>
                    </View>


                    <View style={{padding:10, marginTop:60}}>
                        <StyleElement choix="button" backgroundColor="#121d42" text="S'authentifier / login" icon='cached' navigation={this.props.navigation} />
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
