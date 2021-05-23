import React, {Children} from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import colors from '../config/colors'

const BottomButton = props => {
  return (
    <View style={styles.bottomButton}>
      <TouchableOpacity onPress={() => props.func()}>
        <View>
          <Text style={styles.bottomButtonText}>{props.text}</Text>
          {props.children}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: colors.black,
    marginTop: 'auto',
    margin: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
})

export default BottomButton
