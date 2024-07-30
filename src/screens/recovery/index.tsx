import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { Alert, Image, View, Keyboard } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { auth } from "../../../config/firebase";
import { useNavigation } from "@react-navigation/native";
export function Recovery(){
    const navigation = useNavigation();
    const [resetPasswordEmail, setResetPasswordEmail] = React.useState("");
    const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
    const handlePasswordReset = React.useCallback(() => {
        sendPasswordResetEmail(auth, resetPasswordEmail)
          .then(() => {
            Alert.alert("Keep Coding", "Recovery email sent. Please check your inbox.");
            navigation.navigate("Signin");
          })
          .catch((error) => {
            let errorMessage = "Something went wrong. Please try again.";
            if (error.code === "auth/invalid-email") {
              errorMessage = "Invalid email.";
            } else if (error.code === "auth/user-not-found") {
              errorMessage = "User not found.";
            }
            Alert.alert("Keep Coding", errorMessage);
          });
      }, [resetPasswordEmail]);
      React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
          setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
          setIsKeyboardVisible(false);
        });
        return () => { keyboardDidShowListener.remove(); keyboardDidHideListener.remove(); };
      }, []);
    return(
        <View style={{  flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 80 }}>
            <Image source={require('../../assets/character.png')} style={{ width: isKeyboardVisible ? 200 : 300, height: isKeyboardVisible ? 200 : 300,   marginBottom: 10 }} />
            <TextInput
            label="E-mail @" theme={{ roundness: 20 }} mode="outlined"
            style={{ height: 50, borderRadius: 20, padding: 10, width: 300, marginTop: 10, fontSize: 18 }}
            onChangeText={(text) => setResetPasswordEmail(text)}
          />
          <View style={{ display: "flex", flexDirection: "row", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 10 }}>
        <View style={{ flex: 1, alignItems: "center" }}>

          <Button mode="contained" buttonColor="#F3810F" textColor="#121212" labelStyle={{ fontSize: 16, fontWeight: '500' }}
            onPress={() => handlePasswordReset()} style={{ width: 135, marginTop: 10, borderRadius: 12, borderColor: "#121212", borderWidth: 1 }}>Send</Button>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Button mode="contained" buttonColor="#F3810F" textColor="#121212" labelStyle={{ fontSize: 16, fontWeight: '500' }}
            onPress={() => {
              navigation.navigate("Signin");
            }} style={{ width: 135, marginTop: 10, borderRadius: 12, borderColor: "#121212", borderWidth: 1 }}>SignIn</Button>
        </View>
      </View>
        </View>
    )
}