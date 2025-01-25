import { Button, ButtonText, HStack } from "@gluestack-ui/themed";
import { FlatList, View } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function PickChap() {
  const params = useLocalSearchParams();

  const book = params.book ? parseInt(params.book) : null;

  const total = params.totalChapters ? parseInt(params.totalChapters) : null;

  const { push } = useRouter();
  return (
    <View mx={4} my={20}>
      <FlatList
        data={Array.from({ length: total }, (_, i) => i + 1)}
        numColumns={2}
        renderItem={({ item }) => {
          return (
            <HStack w={"$1/2"} justifyContent={"center"} alignItems="center">
              <Button
                onPress={() => {
                  console.log("item");
                  console.log(item);
                  console.log("book", params.book);
                  push(`/Reading?chapter=${item}&book=${params.book}`);
                }}
                size="md"
                my={2}
                w={"$2/3"}
              >
                <ButtonText>{`章節 ${item}`}</ButtonText>
              </Button>
            </HStack>
          );
        }}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
}
