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
import { Link } from "expo-router";
export default function TabOneScreen() {
  const old_data: Book[] = useMemo(() => oldTestament, []);
  const new_data: Book[] = useMemo(() => newTestament, []);
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View mx={4}>
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
                  <Button size="md" my={2} w={"$2/3"}>
                    <Link
                      href={`/Reading?book=${item.bookName}&chapter=1`}
                      asChild
                    >
                      <ButtonText>{item.bookName}</ButtonText>
                    </Link>
                  </Button>
                </HStack>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <Divider />
        <View mx={4} mt={50}>
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
                  <Button my={2} w={"$2/3"}>
                    <Link
                      href={`/Reading?book=${item.bookName}&chapter=1`}
                      asChild
                    >
                      <ButtonText>{item.bookName}</ButtonText>
                    </Link>
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
