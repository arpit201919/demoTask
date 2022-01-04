import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, FlatList, View, ViewStyle } from "react-native"
import { Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.lightGrey,
  flex: 1,
}

export const UserlistScreen = observer(function UserlistScreen() {
  // Pull in one of our MST stores
  const { userStore } = useStores()

  useEffect(() => {
    userStore.callGetUser();
  }, [])

  const [data, setData] = useState(userStore.userData)
  console.log("loading>>>", userStore.loading);

  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={ROOT} >
      {userStore.loading ? <ActivityIndicator
        size={"large"}
        color={color.primary}
      /> : null}
      {/* <Text preset="header" style={{ alignSelf: "center" }} text={`Total data-${data.length}`} /> */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          userStore.callLoadMore()
          setData(userStore.userData)
        }}
        renderItem={({ item, index }) => {
          return (
            <View style={{ marginHorizontal: 16, marginTop: 10, borderWidth: 1, borderColor: color.primary, padding: 16 }}>
              <Text
                text={item.title}
              />
            </View>
          )
        }}
      />
    </View>
  )
})
