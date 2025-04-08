import AsyncStorage from "@react-native-async-storage/async-storage";

class ToDoRepository {
  constructor() {
    this.keys = [];
    this.key = 0;
  }

  StoreToDo = async (todo, key) => {
    this.keys.push(key);
    try {
      const jsonToDo = JSON.stringify(todo);
      await AsyncStorage.setItem(key, jsonToDo);
    } catch (e) {
      console.log("There was an error during the storing operation: ", e);
    }
  };

  GetToDo = async (key) => {
    try {
      const jsonToDo = await AsyncStorage.getItem(key);
      return jsonToDo != null ? JSON.parse(jsonToDo) : null;
    } catch (e) {
      console.log("There was an error during the receiveing operation: ", e);
    }
  };

  GetAllToDos = async () => {
    let ToDos = [];

    await Promise.all(
      this.keys.map(async (key) => {
        let todo = await this.GetToDo(key.toString());
        ToDos.push(todo);
      })
    );

    return ToDos;
  };

  RemoveToDo = async (key) => {
    this.keys = this.keys.filter((k) => k !== key);

    try {
      await AsyncStorage.removeItem(key.toString());
    } catch (e) {
      console.log("Error removing item from AsyncStorage: ", e);
    }
  };

  GetKey = () => {
    this.key++;
    return this.key.toString();
  };
}

const service = new ToDoRepository();

export default service;
