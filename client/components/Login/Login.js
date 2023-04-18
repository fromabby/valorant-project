import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import axios from 'axios'

const POST_COOKIE = `https://auth.riotgames.com/api/v1/authorization`
const GET_PLAYER_INFO = `https://auth.riotgames.com/userinfo`
const GET_STORE = (puuid) => `https://pd.ap.a.pvp.net/store/v2/storefront/${puuid}`

const Login = ({ navigation }) => {
  const [username, onChangeUsername] = useState('')
  const [password, onChangePassword] = useState('')
  const [data, setData] = useState('')

  const onLogin = async () => {
    const { data: { data } } = await axios.get(`http://127.0.0.1:3000/`)
    setData(data)
  }

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(data)}</Text>
      <TextInput 
        style={styles.input}
        placeholder='Username'
        onChangeText={onChangeUsername}
        value={username}
        nativeID='username'
      />
      <TextInput 
        style={styles.input}
        placeholder='Password'
        onChangeText={onChangePassword}
        value={password}
        nativeID='password'
        secureTextEntry
      />
      <Button
        title='Login'
        onPress={onLogin}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    padding: '5px',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    margin: '5px',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Login