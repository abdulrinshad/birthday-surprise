import memory1 from '../assets/memories/memory-1.jpeg';
import memory2 from '../assets/memories/memory-2.jpeg';
import memory3 from '../assets/memories/memory-3.jpeg';
import memory4 from '../assets/memories/memory-4.jpeg';
import memory5 from '../assets/memories/memory-5.jpeg';

import voice1 from '../assets/memories/voice-1.mp3';
import voice2 from '../assets/memories/voice-2.mp3';
import voice3 from '../assets/memories/voice-3.mp3';
import voice4 from '../assets/memories/voice-4.mp3';
import voice5 from '../assets/memories/voice-5.mp3';

/**
 * MEMORIES DATA SOURCE
 * 
 * Each memory with its photo, voice recording, and personal message.
 */
export const MEMORIES = [
  {
    id: 1,
    tag: 'MEMORY 01',
    numStr: '01',
    image: memory1,
    audio: voice1,
    alt: 'First memory photo',
    caption: 'Ann iji voice aayakumboll njan ithokke ingane share aakki vekkal ind… 🥹🎙️'
  },
  {
    id: 2,
    tag: 'MEMORY 02',
    numStr: '02',
    image: memory2,
    audio: voice2,
    alt: 'Second memory photo',
    caption: 'Ath enthaan vechaal, ank ann oru swabhavam ind… voice ittaal appo thanne delete aakkum. 😂🎙️'
  },
  {
    id: 3,
    tag: 'MEMORY 03',
    numStr: '03',
    image: memory3,
    audio: voice3,
    alt: 'Third memory photo',
    caption: 'Pinne njan oraaley ishtapettal avarude enthum sookshikkum… entey kayyil aake sookshikkan korach photosum audiosum ee ulloo. ❤️🫶🏻'
  },
  {
    id: 4,
    tag: 'MEMORY 04',
    numStr: '04',
    image: memory4,
    audio: voice4,
    alt: 'Fourth memory photo',
    caption: 'Njan ee voice okke ittu vechath entha vechaal, ennenkilum nammal onnikkaanenkil ank kanich tharaan vendi aayirunnu… 🥹🤍'
  },
  {
    id: 5,
    tag: 'MEMORY 05',
    numStr: '05',
    image: memory5,
    audio: voice5,
    alt: 'Fifth memory photo',
    caption: 'Nee poyathinu shesham njan ee voice okke edakk edakk kekkum… 🥺🎧'
  }
];
