import React, { useCallback } from "react";;
import { View, FlatList } from "react-native";
import { Text, Tooltip } from "react-native-paper";
import { useSelector } from "react-redux";
import { IAuthSate } from "../../../types/auth";
import { Ionicons } from '@expo/vector-icons';
import { Pagination } from "../../components/Pagination";
import { BottomMenu } from "../../components/BottomMenu";
import { TicketCard } from "../../components/TicketCard";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { TicketCardProps } from "../../../types/components";
export function Home() {
  const authenticatedUser = {
    userEmail: useSelector((state: IAuthSate) => state.authState.userEmail),
    userName: useSelector((state: IAuthSate) => state.authState.userName),
    userRole: useSelector((state: IAuthSate) => state.authState.userRole),
    userPassword: useSelector((state: IAuthSate) => state.authState.userPassword),
  };
  const [ticketData, setTicketData] = React.useState<TicketCardProps[]>([]);
  const [itemsPerPage, setItemsPerPage] = React.useState(2);
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(ticketData.length / itemsPerPage);
  const indexLastItem = currentPage * itemsPerPage;
  const indexFirstItem = indexLastItem - itemsPerPage;
  const currentItems = ticketData.slice(indexFirstItem, indexLastItem);
  const ordernaDecrescente = useCallback(() => { setTicketData([...ticketData.sort((a, b) => a.ticketnumber - b.ticketnumber)]); }, [ticketData]);
  const ordernaCrescente = useCallback(() => { setTicketData([...ticketData.sort((a, b) => b.ticketnumber - a.ticketnumber)]); }, [ticketData]);
  const getTicketsFromFirebase = useCallback(async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user ? user.uid : null;
  
      if (!uid) {
        console.error("User is not authenticated");
        return;
      }
      const ticketsQuery = query(collection(db, "tickets"), where("createdBy", "==", auth.currentUser?.uid ));
      const unsubscribe = onSnapshot(ticketsQuery, (querySnapshot) => {
        const tickets = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ticketnumber: data.ticketnumber,
            details: data.details,
            status: data.status,
            priority: data.priority,
            createdBy: data.createdBy,
            created: data.created,
            updated: data.updated,
          };
        }
        );
        setTicketData(tickets);
      });
  
      return unsubscribe;
  }, []);
  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {getTicketsFromFirebase();}
       else {
        console.log("User is signed out"); //!Only for debugging
        if (authenticatedUser.userEmail && authenticatedUser.userPassword) {
          signInWithEmailAndPassword(auth, authenticatedUser.userEmail, authenticatedUser.userPassword)
            .then(() => {
              console.log("User signed in");//!Only for debugging
              getTicketsFromFirebase();
            })
            .catch((error) => {
  
              console.error("Error signing in: ", error);
            });
        }
      }
    });
    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []); 
  return (
    <View style={{ height: "95%", justifyContent: "center", alignItems: "center" }}>
      <View style={{ marginTop: 55, justifyContent: "flex-end", width: "100%", gap: 6, paddingHorizontal: 40, flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: "#242423", fontFamily: "Poppins_500Medium" }}>{`Hello, ${authenticatedUser.userName}. Welcome again!`}</Text>

      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
        <View style={{ flexDirection: "row", gap: 4, justifyContent: "flex-end", alignItems: "center", width: "100%", paddingHorizontal: 40, marginBottom: 10 }}>
          <Tooltip title="Sort ascending" >
            <Ionicons name="chevron-up" size={24} color="#121212" onPress={() => ordernaCrescente()} />
          </Tooltip>
          <Tooltip title="Sort descending" >
            <Ionicons name="chevron-down" size={24} color="#121212" onPress={() => ordernaDecrescente()} />
          </Tooltip>
        </View>
        <FlatList
          data={currentItems}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <TicketCard
              ticketnumber={item.ticketnumber}
              details={item.details}
              status={item.status}
              priority={item.priority}
              createdBy={item.createdBy}
              created={item.created}
              updated={item.updated}
            />
          )}
          keyExtractor={item => item.ticketnumber.toString()}
        />

      </View>
      <View style={{ width: "100%", height: 80, paddingHorizontal: 40, marginTop: 30 }}>
        <Pagination
          limit={itemsPerPage}
          page={currentPage}
          setPage={setCurrentPage}
          total={ticketData.length}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 4, justifyContent: "center", alignItems: "center", }}>
        <BottomMenu />

      </View>
    </View>
  );
}




