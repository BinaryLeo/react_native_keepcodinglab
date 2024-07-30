import { Image, View } from "react-native";
import { Text } from "react-native-paper";
import { TicketCardProps } from "../../../types/components";

export function TicketCard(props: Readonly<TicketCardProps>) {
    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 10,
                width: 300,
                paddingHorizontal: 20,
                paddingVertical: 20,
                justifyContent: "space-between",
                gap: 5,
            }}>
            <Text style={{ fontSize: 10, fontFamily: "Poppins_500Medium" }}>{`Ticket ${props.ticketnumber}`}</Text>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular" }}>{`Title: ${props.details.title}`}</Text>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular" }}>{`Description: ${props.details.description}`}</Text>
            <Image source={{ uri: props.details.attachment }} style={{ width: 100, height: 100 }} />
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular", color: props.status === 'Open' ? 'green' : 'red' }}>
              {`Status: ${props.status}`}
            </Text>
            <Text style={{ 
              fontSize: 12, 
              fontFamily: "Poppins_400Regular",
              color: props.priority === 'Low' ? 'green' :
                     props.priority === 'Medium' ? '#F3810F' :
                     props.priority === 'High' ? 'red' : 'black'
            }}>
              {` ${props.priority} Priority`}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular" }}>{`Created at: ${props.created}`}</Text>
            {props.updated &&
                <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular" }}>
                    {`Updated at: ${props.updated}`}
                </Text>
            }

        </View>
    );
}