import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput ,TouchableOpacity,AsyncStorage} from 'react-native';
import { Header } from 'react-native-elements';
import { saveUserData } from '../networkCalls/backend';
import LinearGradient from 'react-native-linear-gradient';

export default class SignUp extends Component{
    static navigationOptions={
        header: null
    };
    constructor(props)
    {
        super(props);
    }

    state={
        name : '',
        email : '',
        password : ''
    }

    handleName = (text) =>{
        this.setState({name: text})
    }

    handleEmail = (text) =>{
        this.setState({email: text})
    }
    handlePassword = (text) =>{
        this.setState({password: text})
    }

    signUpForm(name,email,password){
        // alert('Inside the sign up'+name+" "+email+ " "+password);
        data= {
            name: name,
            email: email,
            password: password
        }
        let userResponse=saveUserData(data).then((response)=>{
            console.log(response.success);
            if(response.success===true)
            {
                alert('User registered Successfully!!!');
                console.log(response.data);
                console.log(response.data.email)
                console.log(typeof response.data.email);
                AsyncStorage.setItem(response.data.email,JSON.stringify(response.data));
                this.props.navigation.navigate('login');
            }
               
            if(response.status===false)
                alert(response.message);
        });
        console.log(userResponse);
    }
    goBack()
    {
        this.props.navigation.navigate('login');
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={signUpStyle.signUpContainer}>
                <View>
                        <Header
                            leftComponent={{ icon:'backspace',onPress:()=>this.goBack(), color: '#000' }}
                            backgroundColor='#FFF'
                            centerComponent={{ text: 'Sign Up', style: {fontSize: 20, color: '#000' } }}
                        />
                </View>
                <View style={signUpStyle.userForm}>
                        <TextInput style={signUpStyle.input}
                            placeholder="Name"
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.handleName}
                            underlineColorAndroid='transparent' />

                        <TextInput style={signUpStyle.input}
                            placeholder="Email"
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.handleEmail}
                            underlineColorAndroid='transparent' />

                            <TextInput style={signUpStyle.input}
                            placeholder="Password"
                            secureTextEntry
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.handlePassword}
                            underlineColorAndroid='transparent' />
                </View>
                <View style={{marginLeft:5,marginRight:5,marginTop:'15%'}}>
                        <TouchableOpacity
                            onPress = {()=>this.signUpForm(this.state.name,this.state.email,this.state.password)}>
                              <LinearGradient colors={['#FFB7AA','#FF816D']}
                               start={{x: 1, y: 0}}
                               end={{x: 0, y: 1}}
                              style={signUpStyle.linearGradient}>
                              <Text style = {signUpStyle.submitButtonText}> Sign Up </Text>
                        </LinearGradient>  
                        </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const signUpStyle=StyleSheet.create({
    signUpContainer: {
        backgroundColor: "#FFF",
        flex: 1
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
    userForm: {
        marginTop: '20%',
        padding: '3%'
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
      }
})