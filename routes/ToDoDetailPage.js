import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import service from "../models/ToDoRepository";
import ToDo from "../models/Todo";
import { useFocusEffect } from "@react-navigation/native";

export default function ToDoDetailPage({ route, navigation }) {
  const [inputText, setInputText] = useState("");
  const [todoKey, setKey] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      async function checkToDo() {
        if (route.params !== undefined) {
          const todo = route.params;

          setInputText(todo.text);
          setKey(todo.key);
        }
      }

      checkToDo();
    }, [])
  );

  const storeTodo = async () => {
    let key;

    if (todoKey) {
      await service.RemoveToDo(todoKey);
      key = todoKey;
    } else {
      key = service.GetKey();
    }

    const date = new Date();
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    const todo = new ToDo(inputText, formattedDate, key);

    service.StoreToDo(todo, key);

    navigation.navigate("ToDoListPage");
  };

  const removeTodo = async () => {
    await service.RemoveToDo(todoKey);

    navigation.navigate("ToDoListPage");
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(newText) => setInputText(newText)}
        style={styles.input}
        value={inputText}
      />

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View style={styles.buttonWrap}>
          <Button title="Uložit" onPress={storeTodo} />
        </View>

        <View style={styles.buttonWrap}>
          <Button title="Smazat" onPress={() => removeTodo()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: "center",
  },
  buttonWrap: {
    width: "40%",
    margin: 10,
  },
  input: {
    fontSize: 22,
    width: "90%",
    height: 150,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
});
