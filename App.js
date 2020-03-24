import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk'

export default class App extends Component {
  state = { userInfo: {} }

  logoutWithFacebook = () => {
    LoginManager.logOut()
    this.setState({ userInfo: {} })
  }

  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name, first_name, last_name'
      },
    }

    const profileRequest = new GraphRequest('/me', { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, result) => {
        if (error) {
          console.log('Login Info has an error:', err)
        }
        else {
          this.setState({ userInfo: result })
          console.log('result:', result)
        }
      },
    )
    new GraphRequestManager().addRequest(profileRequest).start()
  }

  loginWithFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('login canceled')
        }
        else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString()
            this.getInfoFromToken(accessToken)
          })
        }
      },
      error => {
        console.log('login fail with error: ' + console.error());
      },
    )
  }

  state = { userInfo: {} }

  render() {
    const isLogin = this.state.userInfo.name
    const buttonText = isLogin ? 'Logout with facebook' : 'login with facebook'
    const onPressButton = isLogin ? this.logoutWithFacebook : this.loginWithFacebook

    return (
      <View style={{ flex: 1, margin: 50 }}>

        <TouchableOpacity onPress={onPressButton}
          style={{
            backgroundColor: 'blue',
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center'
          }}>

        <Text>{buttonText}</Text>
        </TouchableOpacity>
        {this.state.userInfo.name && (<Text style={{ fontSize: 16, marginVertical: 16 }} >
          Logged in as {this.state.userInfo.name}
        </Text>
        )}

      </View>
    )
  }
}
