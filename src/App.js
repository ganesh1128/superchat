import './App.css';
import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCmDqwTGUyrl4GZGlyRGq1ykSwoejq9hcA",
  authDomain: "superchat-1234.firebaseapp.com",
  projectId: "superchat-1234",
  storageBucket: "superchat-1234.appspot.com",
  messagingSenderId: "737989154846",
  appId: "1:737989154846:web:13ffecc0ec1ba60599b60f"

});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const[user] = useAuthState(auth);

  return (
    <div className="App">
      <header >
      <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}


function SignIn(){
   const signInWithGoogle = () => {
   const provider = new firebase.auth.GoogleAuthProvider();
   auth.signInWithPopup(provider)
   }
  return(
    <button className="sign-in" onClick={signInWithGoogle}>signin with google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick = {() => auth.signOut()} >Sign Out</button>
  )

}

function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue,setFormValue] = useState("");

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text : formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({behavior : 'smooth'});
  }


  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} /> )}
      <span ref={dummy}></span>
    </main>
    <form onSubmit ={sendMessage}>
    
    <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

    <button type="submit" disabled={!formValue}>send</button>

    </form>
    </>
  )

}


function ChatMessage(props){
  const { text, uid,photoURL  } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
    </>
  )

}

export default App;
