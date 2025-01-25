import { Text, VStack } from "@gluestack-ui/themed";
import { FlatList, View } from "@gluestack-ui/themed";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";

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

/** - 開始 */
export default function Reading() {
  const params = useLocalSearchParams();
  const chapter = params.chapter ? parseInt(params.chapter) : null;
  const book = Array.isArray(params.book) ? params.book[0] : params.book;

  const initialChapter = chapter || 1;

  console.log(params.book);

  const [inputChapter, setInputChapter] = useState<string>("");
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const { data, isLoading, refetch, isFetching } = useQuery<BibleResponse>({
    queryKey: ["bibleVerses", book, currentChapter],
    queryFn: () =>
      fetchBibleVerses(decodeURI(book!), currentChapter.toString()),
  });

  console.log(data);
  useEffect(() => {
    refetch();
    // setCurrentChapter(chapter);
  }, [currentChapter, refetch, chapter]);

  const loadingData = Array(20).fill(undefined);

  return (
    <View px={10} py={2}>
      <FlatList
        data={data?.verses || loadingData}
        renderItem={({ item }) => {
          return (
            <VStack my={10}>
              <Text>
                {item?.verse}. {item?.text}
              </Text>
            </VStack>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
