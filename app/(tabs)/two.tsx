import * as SQLite from "expo-sqlite";

import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Divider, HStack, View } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { VStack } from "@gluestack-ui/themed";

type Verse = {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  date_added: string;
  read_count: number;
};

export default function TabTwoScreen() {
  const [data, setData] = useState<Verse[]>([]);

  const fetchVerses = async () => {
    const db = await SQLite.openDatabaseAsync("bibles");
    try {
      await db.withTransactionAsync(async () => {
        const result = await db.getFirstAsync(
          "SELECT COUNT(*) FROM  scriptures"
        );
      });
    } catch (error) {}

    const allRows = await db.getAllAsync(
      "SELECT book, chapter, verse, content, date_added, read_count  FROM  scriptures"
    );

    setData(allRows as Verse[]);
  };

  useEffect(() => {
    fetchVerses();
  }, []);
  return (
    <View px={10} py={2}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.book.toString()}
        renderItem={({ item }) => {
          console.log(item);
          return (
            <VStack my={2} h={"$32"} py={2} px={4}>
              <Text>{item.content}</Text>
              <HStack justifyContent="flex-end" my={10}>
                <Text> {item.book}</Text>
                <Text>{item.chapter}：</Text>
                <Text>{item.verse}</Text>
              </HStack>
              <Divider />
            </VStack>
          );
        }}
      />
    </View>
  );
}
