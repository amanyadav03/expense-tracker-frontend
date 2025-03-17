import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/Redux/store';
import Router from './src/Router/RouterComponent';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/Components/Screens/Login/Login/Login';
import RestoreLogin from './src/Utils/restoreLogin/RestoreLogin';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer independent ={true}>
        <RestoreLogin/>
      <Router/>
      </NavigationContainer>
    </Provider>
  );
}
