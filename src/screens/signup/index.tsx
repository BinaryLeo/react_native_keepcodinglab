import React, { useCallback } from "react";
import { View, Image, Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { auth } from "../../../config/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { USERPROPS } from "../../../types/auth";
export function Signup() {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageInfo, setMessageInfo] = React.useState("");
    const [invalidField, setInvalidField] = React.useState<string | null>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
    const navigator = useNavigation();
    const [user, setUser] = React.useState<USERPROPS>({ userName: "", userEmail: "", userPhone: "", userPassword: "" });
    React.useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setIsLoading(false);
                navigator.navigate("Signin");
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isLoading]);
    const handleUserDataValidation = useCallback(() => {
        const fields = [
            { value: user.userName, name: 'Username' },
            { value: user.userEmail, name: 'E-mail' },
            { value: user.userPhone, name: 'Phone' },
            { value: user.userPassword, name: 'Password' },
        ];
        for (let field of fields) {
            if (field.value === "") {
                Alert.alert("Keep Coding", `${field.name} cannot be empty.`);
                setInvalidField(field.name);
                return false;
            }
            if (field.name === "E-mail") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //? Simple regex for email validation 
                if (!emailRegex.test(field.value)) {
                    Alert.alert("Keep Coding", "Invalid e-mail.");
                    setInvalidField(field.name);
                    return false;
                }
            }
            if (field.name === "Phone") {
                if (field.value.length < 10) {
                    Alert.alert("Keep Coding", "Phone must have at least 10 characters.");
                    setInvalidField(field.name);
                    return false;
                }
            }
            if (field.name === "Password") {
                if (field.value.length < 6) {
                    Alert.alert("Keep Coding", "Password must have at least 6 characters.");
                    setInvalidField(field.name);
                    return false;
                }
            }
        }
        setInvalidField(null);
        handleNewUserWithFirebase();
        return true;
    }, [user]);

    const handleNewUserWithFirebase = useCallback(() => {
        createUserWithEmailAndPassword(auth, user.userEmail, user.userPassword)
            .then((userCredential) => {
                const newUser = userCredential.user;
                const customer: USERPROPS = {
                    userName: user.userName,
                    userEmail: user.userEmail,
                    userPhone: user.userPhone,
                    userPassword: user.userPassword,
                };
                return setDoc(doc(getFirestore(), "users", newUser.uid), customer);
            })
            .then(() => {
                if (auth.currentUser) {
                    return sendEmailVerification(auth.currentUser);
                }
            })
            .then(() => {
                setMessageInfo("User created successfully. Please verify your email.");
                setIsLoading(true);
            })
            .catch((error) => {
                let errorMessage = "Something went wrong. Please try again.";
                if (error.code === "auth/invalid-email") {
                    errorMessage = "Invalid e-mail.";
                } else if (error.code === "auth/invalid-password") {
                    errorMessage = "Invalid password.";
                }
                Alert.alert("Keep Coding", errorMessage);
            });
    }
        , [user]);

    const phoneMask = (phone: string) => {
        let maskedPhone = phone.replace(/\D/g, '');
        maskedPhone = maskedPhone.replace(/^(\d{2})(\d)/g, '($1) $2');
        maskedPhone = maskedPhone.replace(/(\d)(\d{4})$/, '$1-$2');
        setUser({
            ...user,
            userPhone: maskedPhone,
        });
        return maskedPhone;
    };
    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });
        return () => { keyboardDidShowListener.remove(); keyboardDidHideListener.remove(); };
    }, []);

    return (
        <>
            {isLoading ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#F3810F" />
                    <View style={{ display: "flex", flexDirection: "row", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 10 }}>
                        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '600' }}>{messageInfo}</Text>
                    </View>
                    <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '600' }}>Redirecting to SignIn...</Text>

                </View> :

                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >

                    {!isKeyboardVisible && <Image source={require('../../assets/character_one.png')} style={{ marginTop: 100, marginBottom: 10 }} />}
                    <View style={{ display: "flex", zIndex: 999, flexDirection: "column", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: isKeyboardVisible ? 60 : -80 }}>
                        <View style={{ display: "flex", flexDirection: "column", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 5 }}>
                            <TextInput
                                label="Name" theme={{ roundness: 20 }} outlineStyle={{}} mode="outlined"
                                style={[
                                    { height: 38, padding: 10, width: 300, marginTop: 5, fontSize: 18 },

                                ]}
                                onChangeText={(text) =>
                                    setUser({
                                        ...user,
                                        userName: text,
                                    })
                                }
                            />
                        </View>
                        <View style={{ display: "flex", flexDirection: "column", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 5 }}>
                            <TextInput

                                label="E-mail @" theme={{ roundness: 20 }} mode="outlined"
                                style={{ height: 38, padding: 10, width: 300, marginTop: 5, fontSize: 18 }}
                                onChangeText={(text) =>
                                    setUser({
                                        ...user,
                                        userEmail: text,
                                    })
                                }

                            />
                        </View>
                        <View style={{ display: "flex", flexDirection: "column", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 5 }}>
                            <TextInput
                                maxLength={15}
                                label="Phone (123)"
                                theme={{
                                    roundness: 20,
                                    colors: {
                                        primary: invalidField === "Telefone" ? "red" : "black",
                                    },
                                }}
                                mode="outlined"
                                style={{
                                    height: 38,
                                    borderRadius: 20,
                                    padding: 10,
                                    width: 300,
                                    marginTop: 5,
                                    fontSize: 18,
                                }}
                                onChangeText={(text) =>
                                    setUser({
                                        ...user,
                                        userPhone: phoneMask(text),
                                    })
                                }
                                value={user.userPhone}
                            />
                        </View>
                        <View style={{ display: "flex", flexDirection: "column", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 5 }}>
                            <TextInput
                                label="Password ***" theme={{ roundness: 20 }} mode="outlined"
                                style={{ height: 38, borderRadius: 20, padding: 10, width: 300, marginTop: 5, fontSize: 18 }}
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
                    </View>


                    <View style={{ display: "flex", flexDirection: "row", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 10 }}>
                        <View style={{ flex: 1, alignItems: "center" }}>

                            <Button
                                mode="contained"
                                buttonColor="#F3810F"
                                textColor="#121212"
                                labelStyle={{ fontSize: 16, fontWeight: '500' }}
                                onPress={() => {
                                    navigator.navigate("Signin");
                                }}
                                style={{ width: 135, marginTop: 10 }}
                            >
                                SignIn
                            </Button>

                        </View>
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Button
                                mode="contained"
                                buttonColor="#F3810F"
                                textColor="#121212"
                                labelStyle={{ fontSize: 16, fontWeight: '500' }}
                                onPress={() => handleUserDataValidation()}
                                style={{ width: 135, marginTop: 10 }}
                            >
                                SignUp
                            </Button>
                        </View>
                    </View>
                </View>
            }
        </>



    );
}