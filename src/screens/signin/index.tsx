import React, { useCallback, useEffect } from "react";
import { View, Image, Alert, Keyboard, TouchableOpacity } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "../../../config/firebase";
import { PulseLoader } from "../../components/PulseLoader";
import { useDispatch } from "react-redux";
import { beLogged } from "../../../store/modules/auth.store";
import { useNavigation } from "@react-navigation/native";
export function Signin() {
  const [isLoaderInAction, setIsLoaderInAction] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
  const [user, setUser] = React.useState({ userEmail: "", userPassword: "", userName: "" });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoaderInAction) {
      timer = setTimeout(() => {
        setIsLoaderInAction(false);
        dispatch(beLogged({ userEmail: user.userEmail, userRole: "user", userName: user.userName, userPassword: user.userPassword }));
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isLoaderInAction]);
  const handleSignIn = useCallback(() => {
    signInWithEmailAndPassword(auth, user.userEmail, user.userPassword)
      .then((userCredential) => {
        if (!userCredential.user.emailVerified) {
          sendEmailVerification(userCredential.user)
            .then(() => {
              Alert.alert('Keep coding', 'Verification email sent. Please verify your email.');
            })
            .catch((error) => {
              const errorMessage = error.message; Alert.alert('Keep Conding', errorMessage);
            });
          return;
        } //? Retrieve user document from Firestore
        const db = getFirestore();
        const docRef = doc(db, "users", userCredential.user.uid);
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            const userName = doc.data().userName;
            setUser({ ...user, userName: userName });
            setIsLoaderInAction(true);
          } else {
            Alert.alert("Keep Coding", "User not found. Please try again.");
          }
        });
      })
      .catch((error) => {
        let errorMessage = "Something went wrong. Please try again.";
        if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email.";
        } else if (error.code === "auth/user-not-found") {
          errorMessage = "User not found.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Password or email is incorrect.";
        }
        Alert.alert("Keep Coding", errorMessage);
      });
  }, [user.userEmail, user.userPassword]);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });
    return () => { keyboardDidShowListener.remove(); keyboardDidHideListener.remove(); };
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Image source={require('../../assets/character.png')} style={{ width: isKeyboardVisible ? 100 : 300, height: isKeyboardVisible ? 100 : 300, marginTop: isKeyboardVisible ? 60 : 100, marginBottom: 10 }} />

      <PulseLoader isLoaderInAction={isLoaderInAction} />

      <View style={{ display: "flex", flexDirection: "column", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 10 }}>

        <View style={{ display: "flex", flexDirection: "column", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 10 }}>
          <TextInput
            label="E-mail @" theme={{ roundness: 20 }} mode="outlined"
            style={{ height: 50, borderRadius: 20, padding: 10, width: 300, marginTop: 10, fontSize: 18 }}
            onChangeText={(text) =>
              setUser({
                ...user,
                userEmail: text,
              })
            }
          />
        </View>
        <TextInput
          label="Password ***" theme={{ roundness: 20 }} mode="outlined"
          style={{ height: 50, borderRadius: 20, padding: 10, width: 300, marginTop: 10, fontSize: 18 }}
          onChangeText={(text) =>
            setUser({
              ...user,
              userPassword: text,
            })
          }
          secureTextEntry={isPasswordVisible}
          right={
            isPasswordVisible ?
              <TextInput.Icon style={{ marginTop: 35 }} icon="eye" onPress={
                () => setIsPasswordVisible(!isPasswordVisible)
              } />
              :
              <TextInput.Icon style={{ marginTop: 35 }} icon="eye-off" onPress={
                () => setIsPasswordVisible(!isPasswordVisible)
              } />
          }
        />
      </View>
      <View style={{ display: "flex", flexDirection: "row", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 10 }}>
        <View style={{ flex: 1, alignItems: "center" }}>

          <Button mode="contained" buttonColor="#F3810F" textColor="#121212" labelStyle={{ fontSize: 16, fontWeight: '500' }}
            onPress={() =>
              handleSignIn()


            } style={{ width: 135, marginTop: 10, borderRadius: 12, borderColor: "#121212", borderWidth: 1 }}>SignIn</Button>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>

          <Button mode="contained" buttonColor="#F3810F" textColor="#121212" labelStyle={{ fontSize: 16, fontWeight: '500' }}
            onPress={() => {
              setIsLoaderInAction(false);
              navigation.navigate("Signup");
            }} style={{ width: 135, marginTop: 10, borderRadius: 12, borderColor: "#121212", borderWidth: 1 }}>SignUp</Button>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Recovery")}>
      <Text style={{marginTop:20}}>Forgot your password?</Text>
      </TouchableOpacity>
    </View>
  );
}