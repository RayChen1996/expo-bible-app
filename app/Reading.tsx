import { FontAwesome } from "@expo/vector-icons";
import {
  HStack,
  Image,
  Pressable,
  Spinner,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
} from "@gluestack-ui/themed";
import { useToast } from "@gluestack-ui/themed";
import { FlatList, View } from "@gluestack-ui/themed";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import * as SQLite from "expo-sqlite";
import React, { memo, useEffect, useState } from "react";
import { Alert } from "react-native";

interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleResponse {
  reference: string;
  verses: Verse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

async function fetchBibleVerses(
  book: string,
  chapter: string
): Promise<BibleResponse> {
  const { data } = await axios.get(
    `https://bible-api.com/${book}+${chapter}?translation=cuv`
  );
  return data;
}
const loadingData = Array(20).fill(undefined);
/** - 開始 */
export default function Reading() {
  const params = useLocalSearchParams();
  const chapter = params.chapter ? parseInt(params.chapter) : null;
  const book = Array.isArray(params.book) ? params.book[0] : params.book;

  const initialChapter = chapter || 1;

  const [inputChapter, setInputChapter] = useState<string>("");
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const { data, isLoading, refetch, isFetching } = useQuery<BibleResponse>({
    queryKey: ["bibleVerses", book, currentChapter],
    queryFn: () =>
      fetchBibleVerses(decodeURI(book!), currentChapter.toString()),
  });

  //https://images.pexels.com/photos/272337/pexels-photo-272337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
  //https://images.pexels.com/photos/1848731/pexels-photo-1848731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
  //https://images.pexels.com/photos/273936/pexels-photo-273936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
  //https://images.pexels.com/photos/2258240/pexels-photo-2258240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
  //https://images.pexels.com/photos/273936/pexels-photo-273936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
  //https://images.pexels.com/photos/1771219/pexels-photo-1771219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
  useEffect(() => {
    refetch();
  }, [currentChapter, refetch, chapter]);

  if (isLoading) {
    return (
      <View>
        <Spinner size={"large"} />
      </View>
    );
  }

  return (
    <View px={10} py={2}>
      <FlatList
        data={data?.verses || loadingData}
        renderItem={({ item }) => {
          return <RenderItem item={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const RenderItem = memo(function ({ item }: { item: Verse }) {
  // const toast = useToast();

  const images = [
    "https://images.pexels.com/photos/272337/pexels-photo-272337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1848731/pexels-photo-1848731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/273936/pexels-photo-273936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2258240/pexels-photo-2258240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/273936/pexels-photo-273936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1771219/pexels-photo-1771219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  function getRandomImage() {
    return images[Math.floor(Math.random() * images.length)];
  }

  return (
    <VStack my={10}>
      <Pressable>
        <VStack>
          <Text>
            {item?.verse}. {item?.text}
          </Text>
          <HStack justifyContent="flex-end" my={10}>
            <Pressable
              onPress={async () => {
                const db = await SQLite.openDatabaseAsync("bibles");

                const statement = await db.prepareAsync(
                  "INSERT INTO scriptures (book, chapter, verse, content, date_added, read_count) VALUES (?, ?, ?, ?, ?, ?)"
                );
                try {
                  const result = await statement.executeAsync([
                    item.book_name,
                    item.chapter,
                    item.verse,
                    item.text,
                    new Date().toISOString().split("T")[0],
                    0,
                  ]);

                  const selectStatement = await db.prepareAsync(
                    "SELECT * FROM scriptures WHERE book = ? AND chapter = ? AND verse = ?"
                  );
                  try {
                    const selectResult = await selectStatement.executeAsync([
                      item.book_name,
                      item.chapter,
                      item.verse,
                    ]);

                    if (selectResult.changes === 0) {
                      Alert.alert("新增失敗");
                    } else {
                      // console.log("新增成功");
                      Alert.alert("新增成功");
                      // toast.show({
                      //   placement: "top",
                      //   render: ({ id }) => {
                      //     const toastId = "toast-" + id;
                      //     return (
                      //       <Toast nativeID={toastId} action="attention">
                      //         <VStack space="xs" flex={1}>
                      //           <Text> !! </Text>
                      //           <ToastTitle color="#000"> 新增成功</ToastTitle>
                      //           <ToastDescription></ToastDescription>
                      //         </VStack>
                      //       </Toast>
                      //     );
                      //   },
                      // });
                    }
                  } catch (e) {
                    console.log(e);
                  } finally {
                    await selectStatement.finalizeAsync();
                  }
                } catch (e) {
                  console.log(e);
                } finally {
                  await statement.finalizeAsync();
                }
              }}
            >
              <FontAwesome name="bookmark" size={20} />
            </Pressable>
          </HStack>

          {item.verse % 3 === 0 && (
            <Image
              w={"$full"}
              h={200}
              objectFit="cover"
              mt={10}
              source={{ uri: getRandomImage() }}
              alt="random"
            />
          )}
        </VStack>
      </Pressable>
    </VStack>
  );
});
