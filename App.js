import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, TextInput, View} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {

  const apikey = process.env.EXPO_PUBLIC_API_KEY;

  const myHeaders = new Headers();
  myHeaders.append("apikey", apikey);

  const [pick, setPick] = useState('GBP');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [rates, setRates] = useState([]);

  const options = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  const getData = async () => {
    fetch(`https://api.apilayer.com/exchangerates_data/symbols`, options)
    .then(response => {
      if (!response.ok)
        throw new Error("Error in fetch:" + response.statusText);
        
      return response.json()
    })
    .then(data =>  setRates(data.symbols))
    .catch(err => console.error(err))
  }

  useEffect(() => { getData() }, []);

  const convert = () => {
  fetch(`https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${pick}&amount=${amount}`, options)
  .then(response => {
    if (!response.ok)
      throw new Error("Error in fetch:" + response.statusText);
      
    return response.json()
    })
    .then(data => setResult(data.result.toFixed(2) + " €"))
    .catch(error => console.log('error', error));
  };

  //console.log(rates)

  return (
    <View style={styles.container}>
      <Text>
        {result}
      </Text>
      <View style={styles.input}>
        <TextInput 
          placeholder='amount'
          onChangeText={text => setAmount(text) }
          value={amount} />
        <Picker
          style={styles.picker}
          mode='dropdown'
          selectedValue={pick}
          onValueChange={(itemValue, itemIndex) => 
            setPick(itemValue)}
        >
          {Object.keys(rates).sort().map(key => 
          <Picker.Item label={key} value={key} key={key} />)}
        </Picker>
      </View>
      <Button title="Convert" onPress= {convert} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flexDirection: 'row',
  },
  picker: {
    width: 150,
  }
});
