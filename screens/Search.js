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
    Platform,
    StyleSheet,
    Text,
    ImageStore,
    View, AsyncStorage, Animated, Easing, Settings, Image, Button, Linking
} from 'react-native';





import { Header, Card, SearchBar } from 'react-native-elements';




import HeaderLeft from './menu/headerLeft';
import HeaderRight from './menu/headerRight';

import Hyperlink from 'react-native-hyperlink'


import StyleElement from './style/style_element';


export default class Home extends Component<{}> {
    static navigationOptions = {
        drawerLabel: 'Search',
    };

    constructor(props){
        super(props);

        this.state = {
            token: null,
            searchValue: ""
        };

        AsyncStorage.getItem('user_token', (err, token) => {
            if(err)
                console.log(err);

            this.setState({
                token : token
            })
        });

        //bind here

    }


    render() {
        if(this.state.token !== null){
            console.log("search value STATE", this.state.searchValue)
            if(this.state.searchValue === ""){
                return (
                    <View>
                        <Header
                            leftComponent={<HeaderLeft navigation={this.props.navigation} />}
                            centerComponent={{ text: 'Search BAR HERE', style: { color: '#fff' } }}
                            rightComponent={<HeaderRight navigation={this.props.navigation} />}
                        />


                        <Card title="Recherche une photo ?">
                            <View>
                                <SearchBar
                                    lightTheme
                                    showLoading
                                    round
                                    onChangeText={(textSearch) => this.setState({
                                        searchValue: textSearch
                                    })}
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
                            centerComponent={{ text: 'Search BAR HERE', style: { color: '#fff' } }}
                            rightComponent={<HeaderRight navigation={this.props.navigation} />}
                        />


                        <Card title="Recherche une photo ?">
                            <View>
                                <SearchBar
                                    lightTheme
                                    showLoading
                                    round
                                    onChangeText={(textSearch) => this.setState({
                                        searchValue: textSearch
                                    })}
                                    icon={{ type: 'font-awesome', name: 'search' }}
                                    placeholder='Rechercher ...' />
                            </View>
                        </Card>

                        <View>
                            <Text>Résultat pour {this.state.searchValue} ... {"\n"}
                                sous forme de liste d'image cliquable (faire coté API le select * all LIKE todo</Text>
                        </View>

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
