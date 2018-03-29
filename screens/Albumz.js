/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Text,
    View, AsyncStorage,FlatList, Image, ScrollView, Alert, TouchableOpacity
} from 'react-native';


import HeaderLeft from './menu/headerLeft';
import HeaderRight from './menu/headerRight';

import StyleElement from './style/style_element';

import { Header, Card, Button, Icon } from 'react-native-elements';

import Moment from 'moment'; //formatted hour / date


export default class Albumz extends Component<{}> {
    static navigationOptions = {
        drawerLabel: 'My Albumz',
    };

    constructor(props){
        super(props);


        this.state = {
            token: null,
            albums: null,
            displayAlbums: false,

            /* display pictures for albums */
            displayPicturesForAlbum: false,
            pictureList: null,
            current_id_album: null,
        };

        this.getAlbums = this.getAlbums.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
        this.displayPicture = this.displayPicture.bind(this);

        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.error(err);

            this.setState({
                token : token
            })
        });
    }


    getAlbums(){
        let user_id_from_token = this.state.token.replace(/\D/g,'');

        let data = new FormData();
        data.append('user_id', user_id_from_token);

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: data,
        };

        fetch("http://10.0.2.2:8000/album/list", config)
            .then((responseData) =>
                {
                    let json = JSON.parse(responseData._bodyText);
                        console.log(json);
                        if(json[0].error === true){ // true beause, No image to display error return from API
                            Alert.alert(json[0].message);
                            console.log("VOUS AVEZ PAS ALBUMS");
                            //If every image have been deleted => redirect on button "Display image"
                            this.setState({
                                displayAlbums: false
                            })
                    }else{
                            this.setState({
                                displayAlbums: true,
                                albums: json
                            })
                        }
                }
            ).catch(err => console.log(err))

        console.debug('state atfter call',this.state.displayAlbums);
        console.debug('state after call',this.state.albums);
    }


    deleteAlbum(id_album){
        let data = new FormData();
        data.append('album_id', id_album);

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: data,
        };

        fetch("http://10.0.2.2:8000/album/delete", config)
            .then((responseData) => {
                let json = JSON.parse(responseData._bodyText);
                if(json[0].error === true){
                    Alert.alert(json[0].message)
                }else{
                    //refresh data
                    let user_id_from_token = this.state.token.replace(/\D/g,'');

                    let data = new FormData();
                    data.append('user_id', user_id_from_token);

                    const config = {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'multipart/form-data;',
                        },
                        body: data,
                    };

                    fetch("http://10.0.2.2:8000/album/list", config)
                        .then((responseData) =>
                            {
                                let json = JSON.parse(responseData._bodyText);
                                console.log(json);
                                if(json[0].error === true){ // true beause, No image to display error return from API
                                    Alert.alert(json[0].message);
                                    console.log("VOUS AVEZ PAS ALBUMS");
                                    //If every image have been deleted => redirect on button "Display image"
                                    this.setState({
                                        displayAlbums: false
                                    })
                                }else{
                                    this.setState({
                                        displayAlbums: true,
                                        albums: json
                                    })
                                }
                            }
                        ).catch(err => console.log(err))
                }
            })


    }

    displayPicture(album_id){
        this.setState({
            displayPicturesForAlbum: true,
            current_id_album:album_id
        });

        let data = new FormData();
        data.append('album_id', album_id);

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: data,
        };

        fetch("http://10.0.2.2:8000/album/get/pictures", config)
            .then((responseData) =>
                {
                    let json = JSON.parse(responseData._bodyText);
                    console.log(json);
                    if(json[0].error === true){ // true beause, No image to display error return from API
                        console.log(json[0].message);
                    }else{
                        this.setState({
                            pictureList: json
                        })
                    }
                }
            ).catch(err => console.error(err))

        console.debug(this.state.pictureList);



    }

    deletePicFromAlbum(picture_id){
        let album_id = this.state.current_id_album; // set automaticly on click and by default and reset at null when back on list album
        console.log("call on api with id album " + album_id);
        console.log("call on api with id picture " + picture_id);
        ///album/picture/delete

        let data = new FormData();
        data.append('album_id', album_id);
        data.append('picture_id', picture_id);

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: data,
        };

        fetch("http://10.0.2.2:8000/album/picture/delete", config)
            .then((responseData) =>
                {
                    let json = JSON.parse(responseData._bodyText);
                    console.log(json);
                    if(json[0].error === true){ // true beause, No image to display error return from API
                        console.log(json[0].message);
                    }else{

                        let data = new FormData();
                        data.append('album_id', album_id);

                        const config = {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'multipart/form-data;',
                            },
                            body: data,
                        };

                        fetch("http://10.0.2.2:8000/album/get/pictures", config)
                            .then((responseData) =>
                                {
                                    let json = JSON.parse(responseData._bodyText);
                                    console.log(json);
                                    if(json[0].error === true){ // true beause, No image to display error return from API
                                        console.log(json[0].message);
                                    }else{
                                        this.setState({
                                            pictureList: json
                                        })
                                    }
                                }
                            ).catch(err => console.error(err))
                    }
                }
            ).catch(err => console.error(err))

    }



    render() {
        if(this.state.token !== null && this.state.displayAlbums === false){
            return(
                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'My albums', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />
                    <Card title="Acceder au gestionnaire d'albums">
                        {
                            <View>
                                <Text>Vous pouvez accéder à vos albums créer ici, et ainsi consulter chaque photos qu'il contient !</Text>
                                <Text>{"\n"}</Text>
                                <Text>Pas encore d'album ?</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateAlbum')}>
                                    <Text style={{color: 'blue'}}>Cliquez ici</Text>
                                </TouchableOpacity>
                                <Text>{"\n"}</Text>
                                    <TouchableOpacity onPress={this.getAlbums}>
                                        <Icon
                                            name='arrow-forward'
                                            color='#c0392b'
                                            size={60}
                                        />
                                    </TouchableOpacity>
                            </View>

                        }
                    </Card>
                </View>
            )
        }else if(this.state.token !== null && this.state.displayAlbums === true && this.state.displayPicturesForAlbum === false)
        {
            return(
                <View>
                    <ScrollView>
                        <Header
                            leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                            centerComponent={{ text: 'My albums', style: { color: '#fff' } }}
                            rightComponent={<HeaderRight navigation={this.props.navigation} />}
                        />
                        <FlatList
                            data={this.state.albums}
                            keyExtractor={(item, index) => index}
                            renderItem={
                                ({item}) =>
                                    <Card title={item.name}>
                                        <Text>{"\n"}</Text>
                                        <Text style={{fontSize: 16, textAlign: "justify"}}>{item.description}</Text>
                                        <Text>{"\n"}</Text>
                                        <Text style={{textAlign:'right', fontSize:12 ,fontWeight: 'bold'}} icon={{name: 'clock', type: 'font-awesome'}}  >
                                            {Moment(item.album_date_creation).format('DD-MM-YYYY à hh:mm')}
                                        </Text>
                                        <Text>{"\n"}</Text>
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 30}}>
                                            <TouchableOpacity onPress={()=>this.displayPicture(item.album_id)}>
                                                <Icon
                                                    name='input'
                                                    color='#2c3e50'
                                                    size={45}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>this.deleteAlbum(item.album_id)}>
                                                <Icon
                                                    name='close'
                                                    color='#c0392b'
                                                    size={45}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </Card>
                            }
                        />
                    </ScrollView>
                </View>
            )
        }
        else if(this.state.token !== null && this.state.displayAlbums === true && this.state.displayPicturesForAlbum === true){
            console.log(this.state.pictureList);
           return(
            <View>
                <ScrollView>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'My albums', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />
                    <FlatList
                        data={this.state.pictureList}
                        keyExtractor={(item, index) => index}
                        renderItem={
                            ({item}) =>
                                <View>
                                    <Card title={item.label}>
                                        <View   style={{justifyContent: 'center',
                                            alignItems: 'center',}}>
                                            <Image style={{width: 150, height: 150}}
                                                   source={{uri:`http://10.0.2.2/albumzAPI/var/public/upload/pictures/${item.picture_name}`}}/>
                                        </View>
                                        <Text>{"\n"}</Text>
                                        <Text style={{textAlign:'right', fontSize:12 ,fontWeight: 'bold'}} icon={{name: 'clock', type: 'font-awesome'}}  >
                                            {Moment(item.date_publication).format('DD-MM-YYYY à hh:mm')}
                                        </Text>
                                        <TouchableOpacity onPress={() => this.deletePicFromAlbum(item.picture_id)} >
                                            <Icon
                                                name='close'
                                                color='#c0392b'
                                                size={45}
                                            />
                                        </TouchableOpacity>
                                        <View>
                                            <Text style={{textAlign: 'right'}}>Catégorie : {item.category}</Text>
                                        </View>
                                    </Card>
                                </View>
                        }
                    />
                    <Text>{"\n"}</Text>
                    <Button text="Fermer" title="Back to albums" borderRadius={10} backgroundColor="#008080" fontSize={16} onPress={() => this.setState({displayPicturesForAlbum: false, pictureList: null, current_id_album:null})}/>
                    <Text>{"\n"}</Text>
                </ScrollView>
            </View>
           )
        }
        else{
            return(
                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'My albums (non connecté)', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />
                    <Card title="Regarder vos albums !">
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

