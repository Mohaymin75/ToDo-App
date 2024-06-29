import React from 'react';
import { View, FlatList } from 'react-native';
import Task from './Task/Task';

export default function Tasks({ tasks, onStatusChange, onTaskRemoval }) {
  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Task task={item} onStatusChange={onStatusChange} onTaskRemoval={onTaskRemoval} />
        )}
      />
    </View>
  );
}