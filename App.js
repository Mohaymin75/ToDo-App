

import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, StatusBar, Text, Button, TextInput, FlatList, Alert, Switch, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const Tab = createBottomTabNavigator();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP-Swg5hRlwNI8wK0vYoYFGJvQatqpGZE",
  authDomain: "todoapp-adv.firebaseapp.com",
  databaseURL: "https://todoapp-adv-default-rtdb.firebaseio.com",
  projectId: "todoapp-adv",
  storageBucket: "todoapp-adv.appspot.com",
  messagingSenderId: "675501354726",
  appId: "1:675501354726:web:18fba551f7a7621de1d527",
  measurementId: "G-RTKCZTMF7G"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Task context
const TaskContext = createContext();

function useTasks() {
  return useContext(TaskContext);
}

function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const updatedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(updatedTasks);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async (description, completed) => {
    if (description.trim() !== '') {
      await addDoc(collection(db, "tasks"), { description, done: completed });
    } else {
      Alert.alert('Error', 'The task description cannot be empty.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { done: newStatus });
  };

  const handleTaskRemoval = async (id) => {
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  };

  return (
    <TaskContext.Provider value={{ tasks, handleAddTask, handleStatusChange, handleTaskRemoval }}>
      {children}
    </TaskContext.Provider>
  );
}

function ListScreen() {
  const { tasks, handleStatusChange, handleTaskRemoval } = useTasks();

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.taskText}>{item.description}</Text>
          <Switch
            value={item.done}
            onValueChange={(newValue) => handleStatusChange(item.id, newValue)}
          />
          <Button title="Delete" onPress={() => handleTaskRemoval(item.id)} color="red" />
        </View>
      )}
    />
  );
}

function AddScreen() {
  const { handleAddTask } = useTasks();
  const [text, setText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <View style={styles.addContainer}>
      <TextInput
        placeholder="Enter task description"
        value={text}
        onChangeText={setText}
        style={styles.textInput}
      />
      <View style={styles.switchContainer}>
        <Text>Completed:</Text>
        <Switch
          value={isCompleted}
          onValueChange={setIsCompleted}
        />
      </View>
      <Button
        title="Add Task"
        onPress={() => {
          handleAddTask(text, isCompleted);
          setText('');
          setIsCompleted(false);
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'List') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            } else if (route.name === 'Add') {
              iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
          <Tab.Screen name="List" component={ListScreen} />
          <Tab.Screen name="Add" component={AddScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  taskText: {
    fontSize: 18,
    flex: 1
  },
  addContainer: {
    padding: 20
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  switch: {
    marginLeft: 10
  }
});
