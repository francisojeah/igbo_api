import assign from 'lodash/assign';
import { REDIS_CACHE_EXPIRATION } from '../config';
import minimizeWords from '../controllers/utils/minimizeWords';

export const getCachedWords = async ({ key, redisClient }) => {
  console.time('Getting cached words');
  const rawCachedWords = await redisClient.get(key);
  const cachedWords = typeof rawCachedWords === 'string' ? JSON.parse(rawCachedWords) : rawCachedWords;
  console.log(`Retrieved cached data for words ${key}:`, !!cachedWords);
  console.timeEnd('Getting cached words');
  return cachedWords;
};

export const setCachedWords = async ({ key, data, redisClient, version }) => {
  const updatedData = assign(data);
  updatedData.words = minimizeWords(data.words, version);
  if (!redisClient.isFake) {
    await redisClient.set(key, JSON.stringify(updatedData), { EX: REDIS_CACHE_EXPIRATION });
  }
  return updatedData;
};

export const getCachedExamples = async ({ key, redisClient }) => {
  const rawCachedExamples = await redisClient.get(key);
  const cachedExamples = typeof rawCachedExamples === 'string' ? JSON.parse(rawCachedExamples) : rawCachedExamples;
  console.log(`Retrieved cached data for examples ${key}:`, !!cachedExamples);
  return cachedExamples;
};

export const setCachedExamples = async ({ key, data, redisClient }) => {
  if (!redisClient.isFake) {
    await redisClient.set(key, JSON.stringify(data), { EX: REDIS_CACHE_EXPIRATION });
  }
  return data;
};

export const getAllCachedVerbsAndSuffixes = async ({ key, redisClient }) => {
  console.time('Searching cached verbs and suffixes');
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${key}`;
  const rawCachedAllVerbsAndSuffixes = await redisClient.get(redisAllVerbsAndSuffixesKey);
  const cachedAllVerbsAndSuffixes =
    typeof rawCachedAllVerbsAndSuffixes === 'string'
      ? JSON.parse(rawCachedAllVerbsAndSuffixes)
      : rawCachedAllVerbsAndSuffixes;
  console.log(`Retrieved cached data for verbs and suffixes ${key}:`, !!cachedAllVerbsAndSuffixes);
  console.timeEnd('Searching cached verbs and suffixes');
  return cachedAllVerbsAndSuffixes;
};

export const setAllCachedVerbsAndSuffixes = async ({ key, data, redisClient, version }) => {
  const redisAllVerbsAndSuffixesKey = `verbs-and-suffixes-${key}`;
  const updatedData = minimizeWords(data, version);
  if (!redisClient.isFake) {
    await redisClient.set(redisAllVerbsAndSuffixesKey, JSON.stringify(updatedData), { EX: REDIS_CACHE_EXPIRATION });
  }
  return updatedData;
};
