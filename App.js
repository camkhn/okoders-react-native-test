import * as React from 'react';
import { View, Text,ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable } from 'react-native-paper'; 
import { useState, useEffect } from 'react';
import Moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { Searchbar } from 'react-native-paper';

function HomeScreen({navigation}) {
  Moment.locale('en');
  //initial Data
  const [data, setData] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCreatedAt, setsSortCreatedAt] = useState('descending');
  const [sortAuthor, setSortAuthor] = useState('ascending');
  const [sortTitle, setSortTitle] = useState('ascending'); 

  useEffect(() => {
    function fetchData()
  {  
    if(pageNumber>=data.length/20)
    {  
      fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page='+pageNumber)
       .then((response) => response.json())
       .then((json) => {
           setData(data.concat(json.hits))
           setOldData(data.concat(json.hits));
           console.log('data') 
           console.log(data) 
       })
       .catch((error) => {
         console.error(error);
       });
    }
  
  } 
  fetchData()
   const interval = setInterval(async () => { 
        setPageNumber(pageNumber+1)
        }, 10000); 
    return () => clearInterval(interval);
  }, [pageNumber]);
//for search filter
function changeData(query){

  setSearchQuery(query);
  console.log('flitered here with '+query)
  const filtered = data.filter(function (e) {
    return e.author.toLowerCase().includes(query.toLowerCase()) || e.title.toLowerCase().includes(query.toLowerCase())
   });
   console.log('flitered')
   console.log(filtered)

   setData(filtered)
    if(query=='')
     {
       setData(oldData);
     }
}
//for sorting starts
function sortTitleColumn(ascending){
  console.log("sorting")
  var sorted = data;
  if(ascending){
    sorted = data.sort(function(a, b) {
      var titleA = a.title.toUpperCase(); // ignore upper and lowercase
      var titleB = b.title.toUpperCase(); // ignore upper and lowercase
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });}

    else{
      sorted = data.sort(function(a, b) {
        var titleA = a.title.toUpperCase(); // ignore upper and lowercase
        var titleB = b.title.toUpperCase(); // ignore upper and lowercase
        if (titleA < titleB) {
          return 1;
        }
        if (titleA > titleB) {
          return -1;
        }
      
        // names must be equal
        return 0;
      });}
      setData(sorted)
}
function sortAuthorColumn(ascending){
  console.log("sorting")
  var sorted = data;
  if(ascending){
    sorted = data.sort(function(a, b) {
      var authorA = a.author.toUpperCase(); // ignore upper and lowercase
      var authorB = b.author.toUpperCase(); // ignore upper and lowercase
      if (authorA < authorB) {
        return -1;
      }
      if (authorA > authorB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });}

    else{
      sorted = data.sort(function(a, b) {
        var titleA = a.title.toUpperCase(); // ignore upper and lowercase
        var titleB = b.title.toUpperCase(); // ignore upper and lowercase
        if (titleA < titleB) {
          return 1;
        }
        if (titleA > titleB) {
          return -1;
        }
      
        // names must be equal
        return 0;
      });}
      setData(sorted)
}
function sortCreatedAtColumn(ascending){
  console.log("sorting")
  var sorted = data;
  if(ascending){
    sorted = data.sort(function(a, b) {
      var created_atA = a.created_at.toUpperCase(); // ignore upper and lowercase
      var created_atB = b.created_at.toUpperCase(); // ignore upper and lowercase
      if (created_atA < created_atB) {
        return -1;
      }
      if (created_atA > created_atB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });}

    else{
      sorted = data.sort(function(a, b) {
        var titleA = a.title.toUpperCase(); // ignore upper and lowercase
        var titleB = b.title.toUpperCase(); // ignore upper and lowercase
        if (titleA < titleB) {
          return 1;
        }
        if (titleA > titleB) {
          return -1;
        }
      
        // names must be equal
        return 0;
      });}
      setData(sorted)
}
//for sorting ends 
  let id = 0; //key for each row
  return (
    <View style={{ flex: 1}}>
      {data.length>0 ||oldData.length>0? <View>

    
<View style={{justifyContent:'center',alignItems:'center',padding:10}}>
   <Text style={{fontSize:20,margin:10}}>Total Data : {data.length}</Text>
 <Searchbar
  placeholder="Search Author or Title here"
  onChangeText={(query) => {
    changeData(query);
   }}
  value={searchQuery}
/>
</View>
<ScrollView>
     <DataTable>
    <DataTable.Header>
    <DataTable.Title sortDirection={sortCreatedAt} onPress={()=>{
      if(sortCreatedAt=='ascending')
      {
        setsSortCreatedAt('descending')
        sortCreatedAtColumn(false)
      }
      else{
        setsSortCreatedAt('ascending')
        sortCreatedAtColumn(true)
      }
    }}>Created At</DataTable.Title>
    <DataTable.Title sortDirection={sortAuthor} onPress={()=>{
      if(sortAuthor=='ascending')
      {
        setSortAuthor('descending')
        sortAuthorColumn(false)
      }
      else{
        setSortAuthor('ascending')
        sortAuthorColumn(true)
      }
    }}>Author</DataTable.Title>
    <DataTable.Title sortDirection={sortTitle} onPress={()=>{
      if(sortTitle=='ascending')
      {
        setSortTitle('descending')
        sortTitleColumn(false);
      }
      else{
        setSortTitle('ascending')
        sortTitleColumn(true);
      }
    }}> Title</DataTable.Title>
  </DataTable.Header>

  {data.map(oneRecord => (
 <DataTable.Row key={id++}  onPress={() => {
  /* 1. Navigate to the Details route with params */
  navigation.navigate('Details', {
    itemId: oneRecord,
  });
}}>
 <DataTable.Cell>{Moment(oneRecord.created_at).local().format('Do MMM YYYY')}</DataTable.Cell>
 <DataTable.Cell>{oneRecord.author}</DataTable.Cell>
 <DataTable.Cell>{oneRecord.title}</DataTable.Cell>
 </DataTable.Row>
 
    ))} 


  <DataTable.Pagination
    page={pageNumber}
    numberOfPages={pageNumber}
    onPageChange={(page) => {
      setPageNumber(page); 
     }}
    label={pageNumber}
    
  />
</DataTable>
</ScrollView>
</View>:
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<ActivityIndicator size="large" color="#0000ff" />
  </View>
}

    </View>
  );
}

function DetailsScreen({route}) {
  const { itemId } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center',padding:10 }}>
      <Text>Details : {JSON.stringify(itemId)}</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;