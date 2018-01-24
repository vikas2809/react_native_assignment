import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Profile from '../screens/Profile';

export const Nav= StackNavigator({
    login: { screen: Login },
    sign_up: { screen: SignUp }, 
    home: { screen : Home },
    profile: { screen: Profile },
})