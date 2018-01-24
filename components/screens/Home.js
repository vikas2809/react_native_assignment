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
export default class Home extends Component{
    static navigationOptions={
        header: null
    };
    constructor(props){
        super(props);
        this.state={
            image : '',
            email: '',
            token: '',
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            result: 20,
            error: null,
            refreshing: false
        } 
    }


async getCompleteUserList(email){
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
}
    
    goToProfileDetail(){
        //alert('hello user');
       this.props.navigation.navigate('profile');
    }
    async componentWillMount(){
        await AsyncStorage.getItem('token')
        .then((value)=>{     
            console.log(value);
            this.setState({
                token: value
            });
            var decoded=jwt_decode(value);
            console.log(decoded);
            this.setState({
                email: decoded.email
            })
          this.getCompleteUserList(this.state.email);
         console.log(this.state.token);
      //   token=this.state.tokenValue;
           console.log(this.state.email);
    })
    console.log(this.state.token);
        
      }
      componentDidMount()
      {
          const {page,seed} = this.state;
          //const {token}=this.state;
          console.log(this.state.token);
       //   this.setState({loading:true});
            getUserList(page,seed,this.state.result,this.state.token).then((res)=>{
              console.log(res);
              console.log(typeof res);
              if(res.status===true)
              {
                  //var listData=res.message;
                  console.log(res.message);
                
                  var listData=JSON.parse(res.message.body);
                  //console.log(listData.results);
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
    }
   
        renderHeader = () => {
            return <SearchBar placeholder="Type Here..." lightTheme round />
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
