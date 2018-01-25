import React, { Component } from 'react';
import { View, Text, StyleSheet ,TextInput, TouchableOpacity, AsyncStorage,Image,Button,Alert ,PermissionsAndroid} from 'react-native';
import {
        Header,
        Avatar
} from 'react-native-elements';
import { StackNavigator,NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { updateUserInfo, updateUserImage } from '../networkCalls/backend';
import ImagePicker from 'react-native-image-picker';
import jwt_decode from "jwt-decode";

var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


export default class Profile extends Component{
    static navigationOptions={
        header: null
    };


    state={
        name : '',
        image: '',
        email: '',
        password : '',
        token: '',
        avatarSource: '',

    }    
    constructor(props){
        super(props);
        AsyncStorage.getItem('token')
        .then((value)=>{  
            var decoded=jwt_decode(value);
            console.log(decoded);
            this.setState({
                token: value,
                email: decoded.email,
            })
            console.log(this.state.email); 
        this.getCompleteUserList(this.state.email);
           });  
    }

    getCompleteUserList(email){
        console.log(email);
        AsyncStorage.getItem(email)
        .then((value)=>{     
            console.log(value);
            var userInfo=JSON.parse(value);
            console.log(userInfo);
            this.setState({
                image: userInfo.image,
                name: userInfo.name,
                password: userInfo.password
            })
           }); 
    }

   handleName = (text) =>{
        this.setState({name: text})
    }

    handlePassword = (text) =>{
        this.setState({password: text})
    }
    saveUserData(name,password){
      //  alert(name+" "+password);
      console.log(this.state.token);
        updateUserInfo(name,password,this.state.token).then((response)=>{
            console.log(response);
            if(response.status===true)
            {
                alert(response.message);
                console.log(response.data.email);
                AsyncStorage.setItem(response.data.email,JSON.stringify(response.data));
            } 
            if(response.status===false)
                alert(response.message);
        })
       //alert(this.state.token);
    }


    goBack(){
        this.props.navigation.navigate('home');
    }
    logout(){
        this.props.navigation.navigate('login');
    }

    onPressLearnMore() {                   
                ImagePicker.showImagePicker(options,(response) => {
                    console.log('Response = ', response);
                   // console.log(this.state.photoPermission)
                    if (response.didCancel) {
                      console.log('User cancelled image picker');
                    }
                    else if (response.error) {
                      console.log('ImagePicker Error: ', response.error);
                    }
                    else if (response.customButton) {
                      console.log('User tapped custom button: ', response.customButton);
                    }
                    else {
                    //  let source = { uri: response.uri };
                    let source = { uri: 'data:image/jpeg;base64,' + response.data };
                       // console.log(source);
                       // console.log(source.uri);
                      this.setState({
                        avatarSource: source.uri
                      });
                     // console.log(this.state.avatarSource);
                    }
                    if(this.state.avatarSource!=='')
                    {
                        console.log(this.state.avatarSource);
                        updateUserImage(this.state.email,this.state.avatarSource,this.state.token)
                        .then((response)=>{
                            console.log(response);
                            if(response.status===true)
                            {
                                alert(response.message);
                                console.log(response.data);
                                console.log(response.data.image);
                                this.setState({
                                    image: response.data.image
                                })
                            }
                        })
                    }
                  });
    }

    render(){
        const { navigate } = this.props.navigation;
        // const dpr= this.state.dp ? ()
        return(
            <View>
                <View>
                    <Header
                        leftComponent={{ icon: 'backspace',onPress:()=>this.goBack(), color: '#fff' }}
                        centerComponent={{ text: 'Profile', style: {fontSize: 20, color: '#fff' } }}
                        rightComponent={<TouchableOpacity 
                                        onPress = {()=> this.logout()}>
                                            <Text style={{fontSize: 15,color: 'black'}}>Logout</Text>
                                        </TouchableOpacity>}
                    />
                </View>
                <View style={profileStyle.userImage}>
                    <Avatar
                        xlarge
                        rounded
                        source={{uri: 'http://192.168.12.73:7000/'+this.state.image}}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                    />
                </View>
                <View style={{marginTop: '2%', alignItems: 'center'}}>
                    <TouchableOpacity 
                        style={profileStyle.uploadImageButton}
                        onPress={()=>this.onPressLearnMore()} >
                        <Text style={{fontSize: 20, color: '#FFAD9F'}}>Upload Image</Text>
                    </TouchableOpacity>
                </View>
                <View style={profileStyle.userForm}>
                        <TextInput style={profileStyle.input}
                            placeholder="Name"
                            autoCorrect={false}
                            autoCapitalize="none"
                            defaultValue={this.state.name}
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.handleName}
                            underlineColorAndroid='transparent' />

                            <TextInput style={profileStyle.input}
                            placeholder="Password"
                            secureTextEntry
                            autoCorrect={false}
                            autoCapitalize="none"
                            defaultValue={this.state.password}
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.handlePassword}
                            underlineColorAndroid='transparent' />
                </View>
                <View style={profileStyle.saveButtonStyle}>
                        <TouchableOpacity
                            onPress = {()=>this.saveUserData(this.state.name,this.state.password)}>
                             <LinearGradient colors={['#FFB7AA','#FF816D']}
                              start={{x: 1, y: 0}}
                              end={{x: 0, y: 1}}
                              style={profileStyle.linearGradient}>
                              <Text style = {profileStyle.submitButtonText}> Save </Text>
                        </LinearGradient>  
                        </TouchableOpacity>
                </View>
            </View>
        );
    }
}



const profileStyle=StyleSheet.create({
        profileContainer: {

        },
        input: {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            height: 80,
            marginHorizontal: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#E3E3E3',
            paddingLeft: 20,
            borderRadius: 0,
        },
        userImage: {
            marginTop: '5%',
            marginLeft: '30%'
        },
        userForm: {
            marginTop: '2%',
            padding: '2%'
        },
        submitButton: {
            backgroundColor: '#D8B6B6',
            padding: 10,
            margin: 15,
            height: 80,
            alignItems: 'center'
         },
         submitButtonText:{
             marginTop: '5%',
             fontSize: 20,
            color: 'white'
         },
         saveButtonStyle: {
             marginTop: '10%'
         },
         linearGradient: {
            height: 80,
            // paddingLeft: 15,
            // paddingRight: 15,
             borderRadius: 5,
            padding: 10,
            margin: 20,
            marginTop: '1%',
            height: 80,
            alignItems: 'center',
            marginBottom: 20
          },
          uploadImageButton:{
             // backgroundColor: '#FFAD9F'
          }
    })

  