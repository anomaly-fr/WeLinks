import React from 'react';
import App from './App';
import AuthProvider, {AuthContext, useAuth} from './src/services/auth-service';

export default function AuthApp(props){

    return (
        <AuthProvider children={App}/>
    )
}