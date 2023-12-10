import { View, Text, StyleSheet, TouchableOpacity, FlatList, 
  TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Iconify } from 'react-native-iconify'
import { db } from '../../firebase/firebase';
import { getCurrentUserId } from '../../src/authToken';
import { collection, onSnapshot, query, where, serverTimestamp, orderBy} from 'firebase/firestore'
import DropDownPicker from 'react-native-dropdown-picker';

const TransactionHistoryScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Month', value: 'thisMonth' }, // Add this item for filtering by current month
  ]);
  const [people, setPeople] = useState([])
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // New loading state variable
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  

  const handleContainerPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        const userToken = await getCurrentUserId();
        const userQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'Completed'),
          where('customerId', '==', userToken)
        );
  
        const unsubscribe = onSnapshot(userQuery, (snapshot) => {
          if (!isMounted) return;
  
          let orders = [];
          snapshot.docs.forEach((doc) => {
            orders.push({ ...doc.data(), id: doc.id });
          });
  
          const lowercaseSearchQuery = searchQuery.toLowerCase();
          let filteredOrders = orders;
  
          if (lowercaseSearchQuery) {
            filteredOrders = filteredOrders.filter((order) => {
              const branchNameIncludes = order.branchName.toLowerCase().includes(lowercaseSearchQuery);
              const idIncludes = order.id.toLowerCase().includes(lowercaseSearchQuery);
              return branchNameIncludes || idIncludes;
            });
          }
  
          if (selectedFilter === 'thisMonth') {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
  
            filteredOrders = filteredOrders.filter((order) => {
              const orderDate = order.completedAt.toDate();
              const orderMonth = orderDate.getMonth() + 1;
              const orderYear = orderDate.getFullYear();
              return orderMonth === currentMonth && orderYear === currentYear;
            });
          } else if (selectedFilter === 'today') {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            const currentDay = currentDate.getDate();
  
            filteredOrders = filteredOrders.filter((order) => {
              const orderDate = order.completedAt.toDate();
              const orderYear = orderDate.getFullYear();
              const orderMonth = orderDate.getMonth() + 1;
              const orderDay = orderDate.getDate();
  
              return orderYear === currentYear && orderMonth === currentMonth && orderDay === currentDay;
            });
          }
  
          setPeople(filteredOrders);
        });
  
        return () => {
          unsubscribe();
          isMounted = false;
        };
      } catch (error) {
        console.error("Error fetching user id:", error);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedFilter]);
  
  
  
  
  const renderItem = ({ item }) => {
    const completedAt = item.completedAt ? item.completedAt.toDate() : null;
    return (
      <View style={styles.details}>
        <View style={{marginLeft: 6, flex: 1}}>
          <Text style={{fontWeight: '700', fontSize: 14, marginBottom: 6}}>{item.branchName}</Text>
          {/* <Text style={{fontWeight: '300', fontSize: 11, marginBottom: 10}}>Address: {item.deliveryAddress}</Text> */}
          <Text style={{fontWeight: '300', fontSize: 11,marginBottom: 3, color: "#3C3C3C"}}>Order ID: {item.id.toUpperCase()}</Text>

        </View>
        <TouchableOpacity
          style={{ justifyContent: 'center', marginRight: 5 }}
          onPress={() => {
            setSelectedItem(item);
            setModalVisible(true);
          }}
        >
          <Iconify icon="mi:options-horizontal" size={30} color={'#3C3C3C'} />
        </TouchableOpacity>
      </View>

    )
  }
  return (
    <View style={styles.container}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>TRANSACTION HISTORY</Text>
        

        <View style={styles.line} />
        <View style={styles.searchFilterCont}>
        <TouchableOpacity 
              style={styles.searchCont} 
              nPress={handleContainerPress}
              activeOpacity={1}
              >
              <TextInput placeholder="Search transaction" 
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                style={styles.input}
                // other TextInput props...
              />
              <TouchableOpacity>
                <Iconify icon="circum:search" size={22} style={styles.iconSearch} />
              </TouchableOpacity>
            </TouchableOpacity>
          <View style={{ height: 40, width: "3%"}}>

          </View>
          <DropDownPicker
            open={open}
            value={selectedFilter}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedFilter}
            setItems={setItems}
            
            placeholderStyle={{
              color: "#3c3c3c",
              
            }}
            placeholder="Filters"
            style={{
              width: '32%',
              borderWidth: 1,
              borderColor: '#d9d9d9',
              borderRadius: 15,
             
            }}
            dropDownContainerStyle={{
              marginTop: 2,
              width: '54%',
              marginLeft: '-10.2%',
              borderWidth: 1,
              borderColor: '#fff',
              borderRadius: 0,
              elevation: 2,
            }}
            textStyle={{
              marginLeft: 5
            }}
          />
        </View>
        
        {people.length === 0 ? (
            <Text style={{ fontSize: 12, fontWeight: '300', padding: 15, paddingLeft: 10, color: '#4E4E4E' }}>No transactions</Text>
          ) : (
            <Text style={{ fontSize: 12, fontWeight: '300', padding: 15, paddingLeft: 10, color: '#4E4E4E' }}>Transactions</Text>
          )}
      
        <FlatList
          numColumns={1}
          data={people}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
        
        <Modal visible={isModalVisible} animationType="none" transparent={true}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Render your selected item details here */}
                {selectedItem && (
                  <View>
                    <Text style={{marginBottom: 20, fontSize: 20, fontWeight: '500'}}>Transaction Details</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{marginBottom: 15, fontSize: 14, fontWeight: '500', color: '#4e4e4e'}}>Order ID:</Text>
                      <Text style={{marginBottom: 15, fontSize: 14, fontWeight: '400', color: '#8E8E8E'}}> {selectedItem.id.toUpperCase()}</Text>
                    </View> 
                    <Text style={{marginBottom: 25, fontSize: 14, fontWeight: '600', color: '#4e4e4e'}}>{selectedItem.branchName}</Text>
                    <View style={styles.modalDets}>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#8E8E8E'}}>status</Text>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#4e4e4e'}}>{selectedItem.status}</Text>
                    </View>
                    <View style={styles.modalDets}>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#8E8E8E'}}>Date & Time</Text>
                      <Text style={{fontWeight: '500', fontSize: 12, marginBottom: 20, color: '#4e4e4e'}}>
                      {selectedItem.completedAt && selectedItem.completedAt.toDate() ? 
                        `${new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(selectedItem.completedAt.toDate())}`
                      : 'Invalid Date'}
                      </Text>
                    </View>
                    <View style={styles.modalDets}>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#8E8E8E'}}>Payment Method</Text>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#4e4e4e'}}>- {selectedItem.paymentMethod} -</Text>
                    </View>
                    <View style={styles.modalDets}>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#8E8E8E'}}>Item Quantity</Text>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#4e4e4e'}}>x{selectedItem.totalQuantity}</Text>
                    </View>
                    <View style={styles.modalDets}>
                      <Text style={{marginBottom: 5, fontSize: 12, fontWeight: '500', color: '#8E8E8E'}}>Amount</Text>
                      <Text style={{marginBottom: 5, fontSize: 12, fontWeight: '500', color: '#4e4e4e'}}>₱ {selectedItem.totalPrice}</Text>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.modalDets}>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#8E8E8E'}}>Rider Contact #.</Text>
                      <Text style={{marginBottom: 20, fontSize: 12, fontWeight: '500', color: '#4e4e4e'}}>{selectedItem.riderPhoneNumber}</Text>
                    </View>
                    {/* Add more details here */}
                  </View>
                )}
                <TouchableOpacity style={[{backgroundColor: '#DC3642'}, styles.buttons]} onPress={() => setModalVisible(false)}>
                  <Text style={{fontSize: 14, fontWeight: '700', color: 'white'}} >Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    
    backgroundColor: '#F5F5F5',
  },
  details: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginLeft: 'auto', // Push to the center horizontally
    marginRight: 'auto',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttons: {
    marginTop: 5,
    height: 40,
    width: "100%",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchFilterCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  searchCont: {
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
    borderRadius: 15,
    width: "65%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: '#d9d9d9',
    height: 51
  },
  iconSearch: {
    color: "black",
    marginRight: 8
  },
  iconFilterCont: {
    backgroundColor: "black",
    padding: 10,
    paddingRight: 14,
    paddingLeft: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000'
  },
  modalDets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10
    // Add other styles as needed...
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    elevation: 5,
    width: '85%'
  },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
    marginBottom: 20,
  },
  
})

export default TransactionHistoryScreen