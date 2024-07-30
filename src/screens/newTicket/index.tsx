import { Alert, Image, View } from "react-native";
import { Button, Text, TextInput, Checkbox} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { BottomMenu } from "../../components/BottomMenu";
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../../config/firebase";
import { TicketCardProps } from "../../../types/components";


export function NewTicket() {
    const navigation = useNavigation();
    const [newTicket, setNewTicket] = React.useState<TicketCardProps>({
        ticketnumber: Math.floor(100000000000 + Math.random() * 900000000000),
        details: {
            title: '',
            description: '',
            attachment: '',
        },
        status: 'Open',
        priority: '',
        createdBy:  auth.currentUser?.uid || '',
        created: new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).format(new Date()),
        updated: '',
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [image, setImage] = React.useState<string | null>('');

    const pickImage = async () => {
        setIsLoading(true);
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true, // Allow users to edit photos before choosing
                aspect: [4, 3], // Pick square image (4:3)
                quality: 1, // 100% quality
            });
            if (!result.canceled) { // If the user didn't cancel the image selection
                const manipResult = await ImageManipulator.manipulateAsync( // Manipulate the image
                    result.assets[0].uri, // Get the image uri
                    [{ resize: { width: 500 } }], // Reduce the image size to a width of 500 pixels
                    { compress: 0.7, format: ImageManipulator.SaveFormat.PNG } // Compress the image to 70% of its original size, and save it as PNG
                );
                setImage(manipResult.uri); // Set the image to be displayed
                //uploadImageToFirebase(manipResult.uri);// this is an async function that uploads the image to Firebase

                setNewTicket((prevState) => ({
                    ...prevState,
                    details: {
                        ...prevState.details,
                        attachment: manipResult.uri,
                    },
                }));

                setInterval(() => {
                    setIsLoading(false);
                }, 2000);
            } else {
                setImage(null);
                setInterval(() => {
                    setIsLoading(false);
                }, 2000);
            }
        } catch (error) {
            Alert.alert("Keep Coding", "Error selecting image");
        }
    };
    const uploadImageToFirebase = async (uri: string) => {
        try {
            const blob = await fetch(uri).then(r => r.blob());
            const storageRef = ref(storage, `ticketBucket/${uuidv4()}`);

            const uploadTask = uploadBytesResumable(storageRef, blob);
            console.log('Started upload task');

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            });

            uploadTask.then((snapshot) => {
                console.log('Upload completed');
                getDownloadURL(snapshot.ref).then((url) => {
                    console.log('Download URL obtained: ', url);
                    // Update Firestore document with the download URL
                    const db = getFirestore();
                    const userRef = doc(db, "tickets", newTicket.ticketnumber.toString());
                    updateDoc(userRef, {
                        "details.attachment": url,
                    }).then(() => {
                        console.log('Firestore document updated with new avatar URL');
                    }).catch((error) => {
                        console.error('Error updating Firestore document: ', error);
                    });
                });
            });
        } catch (error) {
            console.error('Error during upload: ', error);
        }
    };

    const handleNewTicketFirebase = useCallback(async () => {
        const db = getFirestore();
        const docRef = doc(db, "tickets", newTicket.ticketnumber.toString());
    
        if (!newTicket.details.attachment) {
            // If there's no image to upload, alert the user and do not continue
            Alert.alert('Keep Coding','An image is required to create a new ticket.');
            return; // Early return to stop the function execution
        }
    
        let uploadSuccessful = false;
        let uploadedImageUrl = null;
    
        try {
            uploadedImageUrl = await uploadImageToFirebase(newTicket.details.attachment);
            uploadSuccessful = true;
        } catch (error) {
            console.error('Image upload failed:', error);
            uploadSuccessful = false;
        }
    
        if (uploadSuccessful) {
            try {
                const ticketData = {
                    ticketnumber: newTicket.ticketnumber,
                    details: {
                        title: newTicket.details.title,
                        description: newTicket.details.description,
                        attachment: uploadedImageUrl || newTicket.details.attachment,
                    },
                    status: newTicket.status,
                    priority: newTicket.priority,
                    created: newTicket.created,
                    createdBy: newTicket.createdBy,
                    updated: newTicket.updated,
                };
    
                await setDoc(docRef, ticketData);
                // Navigate to Home only if the document is set successfully
                navigation.navigate("Home");
            } catch (error) {
                console.error('Failed to set document:', error);
            }
        }
    }, [newTicket]);
    return (
        <View style={{ display: "flex", height: "95%", flexDirection: "column", width: "100%", paddingHorizontal: 40, alignItems: "center", gap: 8, marginTop: 60, justifyContent: "space-between" }}>
            <View style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", gap: 8  }}>
                <Text>New Ticket</Text>
                <TextInput
                    label="Title" theme={{ roundness: 20 }} mode="outlined"
                    style={{ height: 50, borderRadius: 20, padding: 10, width: 300, marginTop: 10, fontSize: 18 }}
                    onChangeText={(text) =>
                        setNewTicket({
                            ...newTicket,
                            details: {
                                ...newTicket.details,
                                title: text,
                            },
                        })
                    }
                />
                <TextInput
                    label="Description" theme={{ roundness: 20 }} mode="outlined"
                    multiline={true}
                    style={{ height: 120, borderRadius: 20, padding: 10, width: 300, marginTop: 10, fontSize: 18 }}
                    onChangeText={(text) =>
                        setNewTicket({
                            ...newTicket,
                            details: {
                                ...newTicket.details,
                                description: text,
                            },
                        })
                    }
                />

                <View style={{ display: "flex", flexDirection: "row", width: "100%", borderWidth: 1, borderRadius: 8, borderColor: "#8e8b8b", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                    <Checkbox
                        color="#F3810F"
                        status={newTicket.priority === 'Low' ? 'checked' : 'unchecked'}
                        onPress={() => setNewTicket({ ...newTicket, priority: 'Low' })}
                    />
                    <Text>Low</Text>
                    <Checkbox
                        color="#F3810F"
                        status={newTicket.priority === 'Medium' ? 'checked' : 'unchecked'}
                        onPress={() => setNewTicket({ ...newTicket, priority: 'Medium' })}
                    />
                    <Text>Medium</Text>
                    <Checkbox
                        color="#F3810F"
                        status={newTicket.priority === 'High' ? 'checked' : 'unchecked'}
                        onPress={() => setNewTicket({ ...newTicket, priority: 'High' })}
                    />
                    <Text>High</Text>
                </View>
                <Button
                    icon={isLoading ? "loading" : "image"}
                    mode="contained" onPress={() => pickImage()} style={{ borderRadius: 10, width: "100%", marginTop: 8 }} buttonColor="#F3810F" labelStyle={{ fontSize: 16, fontWeight: '500', color: "#121212" }}>
                   {
                          isLoading ? "Loading..." : "Select Image"
                   }
                </Button>
                <Button mode="contained" onPress={() => handleNewTicketFirebase()} style={{ borderRadius: 10, width: "100%", marginTop: 8 }} buttonColor="#F3810F" labelStyle={{ fontSize: 16, fontWeight: '500', color: "#121212" }}>
                    Create Ticket
                </Button>
                {image ? (
                  <Image source={{ uri: image }} resizeMode="cover" style={{ width: 280, height: 200, marginTop: 10 }} />
                ) : (
                  // Render a placeholder or alternative content when image is null or undefined
                  <View style={{ width: 280, height: 200, marginTop: 10, backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center' }}>
                    <Text>
                        No image selected
                    </Text>
                  </View>
                )}
            </View>
            <View style={{ flexDirection: "row", gap: 4, justifyContent: "center", alignItems: "center", marginBottom: 80 }}>
                <BottomMenu />
            </View>
        </View>
    );
}