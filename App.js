import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BarCodeScanner, Permissions } from "expo";
import Modal from "react-native-modal";
import localDB from "./database";

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    visibleModal: null,
    data: null,
    scanned: [],
  };

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>{this.state.data}</Text>
      {this._renderButton("Close", () => this.setState({ visibleModal: null }))}
    </View>
  );

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return (
        <View style={{ justifyContent: "center" }}>
          <Text>Requesting for camera permission</Text>
        </View>
      );
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
          <Modal
            isVisible={this.state.visibleModal === 5}
            style={styles.bottomModal}
          >
            {this._renderModalContent()}
          </Modal>
        </View>
      );
    }
  }

  _handleBarCodeRead = async ({ type, data }) => {
    if (this.state.scanned.includes(data)) {
      console.log("Already been scanned");
    } else {
      try {
        let ticket = await localDB.get({
          _id: data,
        });
        // should find a better way of updating document
        let response = await localDB.put({
          _id: data,
          _rev: ticket._rev,
          scanned: true,
        })

      } catch (e) {
        console.log(e);
      }
    }
    scanned = this.state.scanned.slice()
    scanned.push(data)
    this.setState({ data, visibleModal: 5, scanned });
    // this.setState({visibleModal: 5})
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
});
