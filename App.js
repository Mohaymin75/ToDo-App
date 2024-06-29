import React, { useState } from 'react';
import { View, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Header from './src/components/Header/Header';
import Tasks from './src/components/Tasks/Tasks';
import Form from './src/components/Form/Form';
import { v4 as uuidv4 } from 'uuid';

const Tab = createBottomTabNavigator();

export default function App() {
  const [tasks, setTasks] = useState([
    { id: uuidv4(), description: 'Feed the Dog', done: false },
    { id: uuidv4(), description: 'Finish the lab', done: true },
    { id: uuidv4(), description: 'Prepare for the job', done: false }
  ]);

  const handleAddTask = (newTask) => {
    if (newTask.description.trim()) {
      setTasks([...tasks, { id: uuidv4(), ...newTask }]);
    } else {
      Alert.alert('Warning', 'Task description cannot be empty!');
    }
  };

  const handleStatusChange = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, done: !task.done };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleTaskRemoval = (id) => {
    Alert.alert(
      'Remove Task',
      'This action will permanently delete this task. This action cannot be undone!',
      [
        {
          text: 'Confirm',
          onPress: () => {
            const updatedTasks = tasks.filter((task) => task.id !== id);
            setTasks(updatedTasks);
          },
        },
        {
          text: 'Cancel',
        },
      ]
    );
  };

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Header />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'List') {
                iconName = focused ? 'ios-list' : 'ios-list-outline';
              } else if (route.name === 'Add') {
                iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="List">
            {(props) => <Tasks {...props} tasks={tasks} onStatusChange={handleStatusChange} onTaskRemoval={handleTaskRemoval} />}
          </Tab.Screen>
          <Tab.Screen name="Add">
            {(props) => <Form {...props} onAddTask={handleAddTask} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}