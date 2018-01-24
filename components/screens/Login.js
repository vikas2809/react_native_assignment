import React, {Component, PropTypes } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    AsyncStorage,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import { 
         Header,
         Button,
         Avatar
        }   from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { authenticateUser } from '../networkCalls/backend';
import { StackNavigator,NavigationActions } from 'react-navigation';
// import * as CryptoJS from 'crypto-js';

export default class Login extends Component{
    static navigationOptions={
        header: null
    };
    constructor(props)
    {
        super(props);
    }
    state={
        email: '',
        password: ''
    }
    handleEmail = (text) =>{
        this.setState({email: text})
    }
    handlePassword = (text) =>{
        this.setState({password: text})
    }
    onPress(){
        this.props.navigation.navigate('sign_up');
    }
    login=(email,pass)=>
    {
        if(email===''&&pass==='')
        alert('invalid user');
    if(email!==''&&pass!=='')
    {
        console.log(email+''+pass);
        // var key = CryptoJS.enc.Base64.parse("#base64Key#");
        // var iv  = CryptoJS.enc.Base64.parse("#base64IV#");
        // var encrypted = CryptoJS.AES.encrypt(pass,key,{iv: iv});
        // var password=encrypted.toString();
       // console.log(password);
        console.log(email);
        authenticateUser(email,pass)
        .then((responseData)=>{
            console.log(responseData);
            if(responseData.success===false)
                alert(responseData.message);
            if(responseData.success===true)
            {
                AsyncStorage.setItem('token',responseData.token);
               // console.log(AsyncStorage.setItem('token',responseData.token));
                console.log(responseData.token);
                console.log('token',typeof responseData.token);
                      this.props.navigation.navigate('home');
            }       
        })
    }
    else
    alert('Please Enter Correct Value');
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={loginStyle.loginContainer}>
                    <View>
                        <Header
                            backgroundColor='#FFF'
                            centerComponent={{ text: 'Sign In', style: {fontSize: 20, color: '#000' } }}
                        />
                    </View>
                    <View style={loginStyle.userImage}>
                        <Avatar
                            large
                            rounded
                            source={{uri: "https://indue.com.au/wp-content/uploads/dct-login-icon-blue.png"}}
                            onPress={() => console.log("Works!")}
                            activeOpacity={0.7}
                        />
                    </View>
                    <View style={loginStyle.userForm}>
                        <TextInput style={loginStyle.input}
                            placeholder="E-mail"
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.handleEmail}
                            underlineColorAndroid='transparent' />

                        <TextInput style={loginStyle.input}
                            placeholder="Password"
                            secureTextEntry
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.handlePassword}
                            underlineColorAndroid='transparent' />
                    </View>
                    <View>
                    <TouchableOpacity
                            onPress = {()=>this.login(this.state.email,this.state.password)}>
                        <LinearGradient colors={['#FFB7AA','#FF816D']}
                         start={{x: 1, y: 0}}
                         end={{x: 0, y: 1}}
                         style={loginStyle.linearGradient}>
                            <Text style = {loginStyle.submitButtonText}> Sign In </Text>
                        </LinearGradient>
                        </TouchableOpacity>
                        <Text style={{ marginLeft: '25%'}}>Forgot your details?</Text>
                    </View>
                    <View style={loginStyle.signUpNavStyle}>
                            <TouchableOpacity
                                onPress={()=>this.onPress()}
                            >
                            <Text style={{fontSize: 20}}> Create a new account </Text>
                            </TouchableOpacity>
                    </View>
                </View>
        );
    }
}


const loginStyle=StyleSheet.create({
    loginContainer:{
        backgroundColor: "#FFF",
        flex: 1
    },
    input: {
		backgroundColor: '#FFF',
		height: 80,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E3E3E3',
		paddingLeft: 20,
		borderRadius: 0,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
      },
      userImage: {
        marginTop: '10%',
        marginLeft: '40%'
    },
    userForm: {
        marginTop: '5%',
        padding: '3%'
    },
     submitButtonText:{
         marginTop: '5%',
         fontSize: 20,
        color: 'white'
     },
    signUpNavStyle :{
        marginTop: '10%',
        marginLeft: '10%',
        marginBottom: '5%'
    },
    linearGradient: {
        height: 80,
         borderRadius: 5,
        padding: 10,
        margin: 20,
        marginTop: '1%',
        height: 80,
        alignItems: 'center',
        marginBottom: 20
      }
})