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
    View, AsyncStorage, Button,FlatList, Image, WebView, ScrollView, SectionList, Alert
} from 'react-native';

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
                console.log(err);

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

        console.log('state atfter call',this.state.displayAlbums);
        console.log('state after call',this.state.albums);
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
            ).catch(err => console.log(err))

        console.log(this.state.pictureList);



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
                            ).catch(err => console.log(err))
                    }
                }
            ).catch(err => console.log(err))

    }


    /*
    componentDidMount(){
        this.getAlbums();
    }
    */




    render() {
        if(this.state.token !== null && this.state.displayAlbums === false){
            return(
                <View>
                    <Text>Gestionnaire d'albumz</Text>
                    <Button text="See more" title="see my albums" onPress={this.getAlbums}/>
                </View>
            )
        }else if(this.state.token !== null && this.state.displayAlbums === true && this.state.displayPicturesForAlbum === false)
        {
            return(
                <View>
                    <ScrollView>
                        <FlatList
                            data={this.state.albums}
                            renderItem={
                                ({item}) =>
                                    <View>
                                        <Text>{item.name}</Text>
                                        <Text>{"\n"}</Text>
                                        <Text>{item.description}</Text>
                                        <Text>{"\n"}</Text>
                                        <Text>{item.album_date_creation}</Text>
                                        <Text>{"\n"}</Text>
                                        <Button title="Delete" onPress={()=>this.deleteAlbum(item.album_id)} text="Delete this album"/>
                                        <Button text="Display pictures" title="See picture of this albums" onPress={()=>this.displayPicture(item.album_id)}/>
                                    </View>
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
                <Text>Display picture for this album</Text>
                <ScrollView>
                    <FlatList
                        data={this.state.pictureList}
                        renderItem={
                            ({item}) =>
                                <View>
                                    <Text>{"\n"}</Text>
                                    <Image style={{width: 150, height: 150}}
                                           source={{uri:`http://10.0.2.2/albumzAPI/var/public/upload/pictures/${item.picture_name}`}}/>
                                    <Text>{"\n"}</Text>
                                    <Text>{item.date_publicatio}</Text>
                                    <Button text="delete picture for album" title="delete picture for album" onPress={() => this.deletePicFromAlbum(item.picture_id) /* todo delete pic with this album use my route */}/>
                                    <Text>{"\n"}</Text>
                                </View>
                        }
                    />
                    <Button text="Fermer" title="back to album list" onPress={() => this.setState({displayPicturesForAlbum: false, pictureList: null, current_id_album:null})}/>
                </ScrollView>
            </View>
           )
        }
        else{
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
