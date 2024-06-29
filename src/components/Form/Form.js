import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Switch } from 'react-native';
import styles from './styles';

export default function Form(props) {
  const [task, setTask] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAddTask = () => {
    if (task.trim()) {
      props.onAddTask({ description: task, done: isCompleted });
      setTask('');
      setIsCompleted(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={(text) => setTask(text)}
        placeholder="Enter task"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Task completed:</Text>
        <Switch
          value={isCompleted}
          onValueChange={(value) => setIsCompleted(value)}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, !task.trim() && styles.disabledButton]}
        onPress={handleAddTask}
        disabled={!task.trim()}
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}