import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Switch, Alert, StyleSheet } from 'react-native';

export default function Task(props) {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleStatusChangePress = () => {
    props.onStatusChange(props.task.id);
  };

  const handleRemovePress = () => {
    props.onTaskRemoval(props.task.id);
    setShowModal(false);
  };

  return (
    <>
      <Pressable onPress={handleModalToggle}>
        <View style={styles.container}>
          <Text style={styles.text}>ID: {props.task.id}</Text>
          <Text style={styles.title}>{props.task.description}</Text>
          <Text style={styles.text}>Status: {props.task.done ? 'Completed' : 'Open'}</Text>
        </View>
      </Pressable>
      <Modal visible={showModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{props.task.description}</Text>
          <View style={styles.switchContainer}>
            <Switch value={props.task.done} onValueChange={handleStatusChangePress} />
            <Text>Toggle Status</Text>
          </View>
          <Pressable style={styles.button} onPress={handleRemovePress}>
            <Text>Remove</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleModalToggle}>
            <Text>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});