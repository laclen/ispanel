import { StyleSheet, TouchableOpacity, Platform, GestureResponderEvent } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
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
    height: Platform.OS === "ios" ? hp(5.5) : hp(6),
    width: Platform.OS === "ios" ? wp(10) : wp(10),

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 20,
    backgroundColor: "black",
    shadowColor: "black",

    elevation: 10,
  },
});
