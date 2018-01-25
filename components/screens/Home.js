import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    FlatList,
    ActivityIndicator
} from 'react-native';
import {
    Header,
    Avatar,
    List, 
    ListItem,
    SearchBar
} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { StackNavigator} from 'react-navigation';
import { getUserList } from '../networkCalls/backend';
import jwt_decode from "jwt-decode";
import { observable } from 'mobx';
import {observer} from 'mobx-react/native';


@observer export default class Home extends Component{
   @observable token= '';
   @observable email='';
//    @observable page=1;
   @observable result=20;
//    @observable seed=1;
   @observable updatedSeed=0;

    static navigationOptions={
        header: null
    };

    state={
        loading: false,
        data: [],
        error: null,
        page: 1,
        seed: 1,
        refreshing: false
    } 

    constructor(props){
        super(props);
        AsyncStorage.getItem('token')
        .then((value)=>{  
            var decoded=jwt_decode(value);
            console.log(decoded);
                this.token= value,
                this.email= decoded.email,
            console.log(this.email); 
        this.getCompleteUserList(this.email);
        });
    }

    async getCompleteUserList(email){
        console.log('inside the get user list');
        console.log(email);
        await AsyncStorage.getItem(email)
        .then((value)=>{     
            console.log(value);
            var userInfo=JSON.parse(value);
            console.log(userInfo);
            this.setState({
                image: userInfo.image,
            })
           }); 
           console.log(this.token);
           this.getCompleteFlatListData(this.token);
       // console.log(this.state.token);
    }

    getCompleteFlatListData(token){
       // console.log(token);
        // const {page,seed} = this.state;
        if(this.updatedSeed!==0)
            this.seed=this.updatedSeed;
        console.log("TOKEN "+token);
        console.log(this.token);
        console.log(this.state.seed);
        setTimeout(()=>{
            getUserList(this.state.page,this.state.seed,this.result,token).then((res)=>{
                console.log(res);
                console.log(typeof res);
                if(res.status===true)
                {
                    //var listData=res.message;
                    console.log(res.message);
                  
                    var listData=JSON.parse(res.message.body);
                    console.log(listData.info);
                    console.log(listData.info.seed);
                    console.log(typeof listData.info.seed);
                    //console.log(listData.results);
                  //  this.updatedSeed=parseInt(listData.info.seed);
                    // AsyncStorage.setItem('seed',listData.info.seed)
                    console.log(typeof listData.results);
                    this.setState({
                      data: [...this.state.data,...listData.results],
                      error: res.error || null,
                      loading: false,
                      refreshing: false
                  });
                }
                console.log(this.state.data);
        })
        },1500);
    }

    
    goToProfileDetail(){
       this.props.navigation.navigate('profile');
    }

        renderFooter = () => {
            if(!this.state.loading) return null;
            return(
                <View
                    style={{
                        paddingVertical: 1,
                        borderTopWidth: 1,
                        borderColor: "#CED0CE"
                    }}
                    >

                    <ActivityIndicator animating size="large" />

                </View>
        );
        }

        async handleRefresh(){
           console.log('inside the handle refresh');
           console.log(this.state.seed);
           console.log(this.state.page);
            // var tokenValue='';
            //     await AsyncStorage.getItem('token')
            //     .then((value)=>{  
            //     // console.log(value);
            //         tokenValue= value
            //     });
            //     this.setState({
            //         page:1,
            //         refreshing: true,
            //         seed: this.state.seed+1
            //     },()=>this.getCompleteFlatListData(tokenValue))
        }

       async handleLoadMore(){
        console.log('inside the handle load more');
        console.log(this.state.seed);
        console.log(this.state.page);
            var tokenValue='';
                await AsyncStorage.getItem('token')
                .then((value)=>{  
                // console.log(value);
                    tokenValue= value
                });
                this.setState({
                    page:this.state.page+1,
                },()=>this.getCompleteFlatListData(tokenValue))
        }

        renderSeparator = () => {
            return(
                <View
                    style={{
                        height:1,
                        width: "86%",
                        backgroundColor: "#CED0CE",
                        marginLeft: "14%"
                    }}
                />
            );
        };


    render(){
       const { navigate } = this.props.navigation;
        return(
            <View style={homeStyle.homeContainer}>
                         <View style={{height: '10%',width: '100%'}}>
                              <LinearGradient colors={['#FFB7AA','#FF816D']}
                               start={{x: 1, y: 0}}
                               end={{x: 0, y: 1}}
                                >
                                <View>
                                    <View style={{alignItems: 'center',marginTop:'4%',marginBottom: '-4%'}}>
                                        <Text style={homeStyle.homeTitle}> User List </Text>
                                    </View>

                                    <View style={homeStyle.userImageStyle}>
                                      <Avatar
                                        small
                                        rounded
                                        source={{uri: 'http://192.168.12.73:7000/'+this.state.image}}
                                        onPress={() => this.goToProfileDetail()}
                                        activeOpacity={0.7}
                                        />
                                    </View>
                                  </View>
                        </LinearGradient>
                        </View>
                        <View style={homeStyle.listStyle}>
                            <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0}}> 
                                <FlatList
                                    data= {this.state.data}
                                    renderItem={({ item })=>(
                                        <ListItem
                                            roundAvatar
                                            title={`${item.name.first} ${item.name.last}`}
                                            subtitle={item.email}
                                            avatar={{ uri:item.picture.thumbnail }}
                                            containerStyle={{ borderBottomWidth: 0}}
                                        />
                                    )}
                                    keyExtractor={item => item.email}
                                    ItemSeparatorComponent= {this.renderSeparator}
                                    ListFooterComponent = {this.renderFooter}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.handleRefresh}
                                />
                            </List>
                        </View>
            </View>
        )
    }
}


const homeStyle=StyleSheet.create({
    homeContainer:{

    },
    customHeader: {
        height: '10%',
        width: '100%',
    },
    homeTitle:{
        fontSize: 25,
    },
    userImageStyle:{
        alignItems: 'flex-end',
        marginTop: '-5%',
        marginBottom: '4%'
       // marginTop: '-40%'
    },
    listStyle: {
        marginTop: '-8%',
    }
})
