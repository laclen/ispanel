import { StyleSheet, TouchableOpacity, GestureResponderEvent } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const BackButton = (props: { onPress: (event: GestureResponderEvent) => void }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <FontAwesome name="chevron-left" size={11} color="white" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    height: 45,
    width: 45,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 45 / 2,
    backgroundColor: "black",
    shadowColor: "black",

    elevation: 16,
  },
});
