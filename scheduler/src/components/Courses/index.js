import React, { useState, useEffect} from 'react';
import "rbx/index.css";
import { Button, Container, Message, Title } from "rbx";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDJfbRZA9erq5W8QVUEdaNZqMV4FeSVOEE",
    authDomain: "quickreactcs397.firebaseapp.com",
    databaseURL: "https://quickreactcs397.firebaseio.com",
    projectId: "quickreactcs397",
    storageBucket: "quickreactcs397.appspot.com",
    messagingSenderId: "794521535199",
    appId: "1:794521535199:web:5fefd7908a299792d89f6a"
};


firebase.initializeApp(firebaseConfig);
export const db = firebase.database().ref();
