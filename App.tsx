import React, {Suspense} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Navigation} from './src/navigation/Navigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaProvider>
      <Suspense>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar />
          <Navigation />
        </GestureHandlerRootView>
      </Suspense>
    </SafeAreaProvider>
  );
};

export default App;
