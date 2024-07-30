
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Tooltip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import { beUnlogged } from "../../../store/modules/auth.store";
export function BottomMenu() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
                maxHeight: 50,
                padding: 10,
                flexDirection: "row",
                paddingVertical: 10,
                marginTop: 10,
                marginBottom: 10,
            }}
            contentContainerStyle={{
                width: "100%",
                justifyContent: "space-between",
            }}
        >
            <Tooltip title="List" >
                <TouchableOpacity style={{ margin: 4, width: 30, height: 30 }} onPress={ () => {
                    navigation.navigate("Home");
                }
                }>
                    <Ionicons name="list" size={30} color="#595454" />
                </TouchableOpacity>
            </Tooltip>
            <Tooltip title="Open a new Ticket" >
                <TouchableOpacity style={{ margin: 4, width: 30, height: 30 }} onPress={
                    () => {
                        navigation.navigate("NewTicket");
                    }
                }>
                    <Ionicons name="add" size={30} color="#595454" />
                </TouchableOpacity>
            </Tooltip>
            <Tooltip title="Manage tickets" >
                <TouchableOpacity style={{ margin: 4, width: 30, height: 30 }}>
                    <Ionicons name="list-circle-sharp" size={30} color="#595454" />
                </TouchableOpacity>
            </Tooltip>
            <Tooltip title="Logout" >
                <TouchableOpacity style={{ margin: 4, width: 30, height: 30 }}
                    onPress={() => dispatch(beUnlogged())}>
                    <Ionicons name="log-out" size={30} color="#595454" />
                </TouchableOpacity>
            </Tooltip>
        </ScrollView>
    );
}