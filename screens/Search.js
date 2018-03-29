/**
 * Created by SYLVAIN on 08/02/2018.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View, AsyncStorage,Image,FlatList
} from 'react-native';



import Moment from 'moment';

import QRCode from 'react-native-qrcode';


import { Header, Card, SearchBar } from 'react-native-elements';

import HeaderLeft from './menu/headerLeft';
import HeaderRight from './menu/headerRight';

import StyleElement from './style/style_element';


export default class Home extends Component<{}> {
    static navigationOptions = {
        drawerLabel: 'Search',
    };

    constructor(props){
        super(props);

        this.state = {
            token: null,
            searchValue: "",
            error_search: "",
            dataForList: ""
        };


        this.search = this.search.bind(this);




        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.error(err);

            this.setState({
                token : token
            })
        });

        }


    search(textSearch){
        console.info("call search");
        console.log(`search for ${textSearch}`)

            let data = new FormData();
            data.append('searchValue', textSearch.toString());

            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: data,
            };

            var self = this; // get instance of this

            fetch("http://10.0.2.2:8000/pictures/search", config)
                .then((responseData) => {
                    console.log(responseData);
                    try {
                        let json = JSON.parse(responseData._bodyText);
                        console.log(json)

                            if(json[0].error === true){
                                this.setState({
                                    error_search: json[0].message,
                                    dataForList: ""
                                })
                            }else{
                                this.setState({
                                    error_search: `${json[0].nb_results_total} résultats trouvés`,
                                    dataForList : json
                                })
                            }
                    } catch (err) {
                        //if not valid json
                        console.error(err);
                        this.setState({
                            error: err
                        })
                    }

                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        error: err
                    })
                })
    };

    render() {
        if(this.state.token !== null){
            console.log("search value STATE", this.state.searchValue)
            if(this.state.searchValue === ""){
                return (
                    <View>
                        <Header
                            leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                            centerComponent={{ text: 'Search', style: { color: '#fff' } }}
                            rightComponent={<HeaderRight navigation={this.props.navigation} />}
                        />


                        <Card title="Recherche une photo ?">
                            <View>
                                <SearchBar
                                    lightTheme
                                    showLoading
                                    round

                                    onChangeText={(textSearch) => {
                                        this.setState({
                                            searchValue: textSearch
                                        });

                                        this.search(textSearch);
                                    }}
                                    icon={{ type: 'font-awesome', name: 'search' }}
                                    placeholder='Rechercher ...' />
                            </View>
                        </Card>
                    </View>
                )
            }else{
                return (
                    <View>
                        <Header
                            leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                            centerComponent={{ text: 'Search', style: { color: '#fff' } }}
                            rightComponent={<HeaderRight navigation={this.props.navigation} />}
                        />


                        <Card title="Recherche une photo ?">
                            <View>
                                <SearchBar
                                    lightTheme
                                    showLoading
                                    round
                                    onChangeText={(textSearch) => {
                                        this.setState({
                                            searchValue: textSearch
                                        });

                                        this.search(textSearch);
                                    }}

                                    icon={{ type: 'font-awesome', name: 'search' }}
                                    placeholder='Rechercher ...' />
                            </View>
                        </Card>

                        <View>
                            <Text>Résultat pour {this.state.searchValue}</Text>
                            <Text>{this.state.error_search}</Text>
                        </View>

                        <FlatList
                            data={this.state.dataForList}
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
                                        <View>
                                            <Text style={{textAlign: 'right'}}>Catégorie : {item.category}</Text>
                                        </View>
                                    </Card>
                            }
                        />
                    </View>
                );
            }
        }else{
            return (
                <View>
                    <Header
                        leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                        centerComponent={{ text: 'Search (déconnecté)', style: { color: '#fff' } }}
                        rightComponent={<HeaderRight navigation={this.props.navigation} />}
                    />

                    <View style={{marginTop:20}}>
                        <Card title="Recherche une photo">
                                <View>
                                    <Text>Vous devez vous connecté pour rechercher une photo</Text>
                                </View>

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

