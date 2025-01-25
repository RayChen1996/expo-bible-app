import {
  Button,
  ButtonText,
  Divider,
  FlatList,
  HStack,
  ScrollView,
  Text,
  View,
} from "@gluestack-ui/themed";
import { Book, oldTestament } from "@/util/options/oldTestament";
import { newTestament } from "@/util/options/newTestament";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMemo } from "react";
import { useRouter } from "expo-router";
export default function TabOneScreen() {
  const { push } = useRouter();
  const old_data: Book[] = useMemo(() => oldTestament, []);
  const new_data: Book[] = useMemo(() => newTestament, []);
  return (
    <SafeAreaProvider>
      <ScrollView px={20} my={20}>
        <View>
          <FlatList
            data={old_data}
            numColumns={2}
            renderItem={({ item }) => {
              return (
                <HStack
                  w={"$1/2"}
                  justifyContent={"center"}
                  alignItems="center"
                >
                  <Button
                    onPress={() => {
                      push(
                        `/pickChap?book=${item.bookName}&totalChapters=${item.totalChapters}`
                      );
                    }}
                    size="md"
                    my={2}
                    w={"$2/3"}
                  >
                    <ButtonText>{item.bookName}</ButtonText>
                  </Button>
                </HStack>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <Divider my={50} />
        <View>
          <FlatList
            data={new_data}
            numColumns={2}
            renderItem={({ item }) => {
              return (
                <HStack
                  justifyContent={"center"}
                  alignItems="center"
                  key={"new"}
                  w={"$1/2"}
                >
                  <Button
                    onPress={() => {
                      push(
                        `/pickChap?book=${item.bookName}&totalChapters=${item.totalChapters}`
                      );
                    }}
                    my={2}
                    w={"$2/3"}
                  >
                    <ButtonText>{item.bookName}</ButtonText>
                  </Button>
                </HStack>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
