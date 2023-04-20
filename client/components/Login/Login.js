import { useMemo, useState } from 'react'
import { StyleSheet, Image, Text, View, TextInput, Button } from 'react-native'
import data from '../../constants/skins'
import axios from 'axios'

const Login = ({ navigation }) => {
  const [username, onChangeUsername] = useState('')
  const [password, onChangePassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [store, setStore] = useState([])

  const onLogin = async () => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const { data } = await axios.post(`http://127.0.0.1:3000/login`, {
        username,
        password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if(data.success === true) {
        setStore(data.store)
      } else {
        setErrorMessage(data.message)
      }
      setIsLoading(false)
    } catch (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
    }
  }

  const images = useMemo(() => {
    const list = []
    if (store.length > 0) {
      store.map(item => {
        data.skins.map(({ displayName, fullRender }) => {
          if (item === displayName) {
            list.push([displayName, fullRender])
          }
        })
      })
    }

    return list
  }, [store])

  return (
    <View style={styles.container}>
      {images.length > 0 &&
        <View style={styles.flexContainer} >
          {images.map(item => 
            <View key={item[0]} style={styles.imageContainer}>
              <Image source={{ uri: item[1] }} style={styles.image}/>
              <Text>{item[0]}</Text>
            </View>
          )}
        </View>
      }
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
      {errorMessage && <Text>{errorMessage}</Text>}
      <Button
        title='Login'
        onPress={onLogin}
        disabled={isLoading || !username || !password}
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
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
}
})

export default Login