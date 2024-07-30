import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface pageProps {
    page: number;
    limit: number;
    total: number;
    setPage: (page: number) => void;
}
export function Pagination(props: pageProps) {
    const totalPages = Math.ceil(props.total / props.limit);
    totalPages <= 1 && null
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, width: "100%", paddingHorizontal: 40 }}>
            <Button mode='contained' style={{ borderRadius: 10 }}
                buttonColor="#F3810F" labelStyle={{ fontSize: 16, fontWeight: '500', color: "#121212" }}
                onPress={() => props.setPage(1)} disabled={props.page === 1}>
                <Ionicons name="chevron-back" size={16} color="#121212" />
            </Button>

            {Array.from(Array(totalPages).keys()).map((item, index) => {
                return (
                    <Button mode='contained' style={{ borderRadius: 10 }}
                        buttonColor="#F3810F" labelStyle={{ fontSize: 16, fontWeight: '500', color: "#121212" }}
                        key={index} onPress={() => props.setPage(index + 1)} >{index + 1}</Button>
                )
            })}

            <Button mode='contained' style={{ borderRadius: 10 }}
                buttonColor="#F3810F" labelStyle={{ fontSize: 16, fontWeight: '500', color: "#121212" }}
                onPress={() => props.setPage(totalPages)} disabled={props.page === totalPages}>
                <Ionicons name="chevron-forward" size={16} color="#121212" />
            </Button>
        </View>
    )
}