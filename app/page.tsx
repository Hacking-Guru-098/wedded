"use client";

import FilmController from "./components/FilmController";
import LoadingScreen from "./components/LoadingScreen";
import SmoothScroll from "./components/SmoothScroll";

export default function Home() {
  const scenes = [
    {
      id: "door",
      folder: "DOOR",
      prefix: "door_",
      frameCount: 83,
      title: "With the Blessings of Our Families",
      subtitle: "February 2026 · Bhopal",
    },
    {
      id: "ganesh",
      folder: "GANESH",
      prefix: "ganesh_",
      frameCount: 86,
      title: "Ganesh Puja",
      secondary: "Wednesday, 11 February · 10:00 AM",
      subtitle: "Seeking divine blessings",
    },
    {
      id: "bhopal",
      folder: "BHOPAL",
      prefix: "bhopal_",
      frameCount: 94,
      title: "Bhopal",
      subtitle: "Where our celebration begins",
    },
    {
      id: "sangeet",
      folder: "SANGEET",
      prefix: "sangeet_",
      frameCount: 114,
      title: "Sangeet",
      secondary: "Tuesday, 10 February · 4:00 PM",
      subtitle: "An evening of music & celebration",
    },
    {
      id: "rangrasia",
      folder: "RANGRASIYA",
      prefix: "rangrasia_",
      frameCount: 112,
      title: "Rangrasiya",
      secondary: "Wednesday, 11 February · 11:00 AM – 5:00 PM",
      subtitle: "Colors of love and laughter",
    },
    {
      id: "baraat",
      folder: "BARAAT",
      prefix: "baraat_",
      frameCount: 77,
      title: "Baraat",
      secondary: "Thursday, 12 February · Afternoon",
      subtitle: "A celebration of arrival",
    },
    {
      id: "phera",
      folder: "PHERA",
      prefix: "pheraa_",
      frameCount: 68,
      title: "Pheras",
      secondary: "Thursday, 12 February · 1:15 PM",
      subtitle: "Bound by sacred vows",
    },
    {
      id: "reception",
      folder: "RECEPTION",
      prefix: "reception_",
      frameCount: 66,
      title: "Reception",
      secondary: "Thursday, 12 February · 8:00 PM",
      subtitle: "An evening to celebrate togetherness",
    },
    {
      id: "outro",
      folder: "OUTRO",
      prefix: "outro_",
      frameCount: 96,
      title: "With Love and Gratitude",
      subtitle: "Manisha & Shubham & Family",
    },
  ];

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <LoadingScreen />

      <SmoothScroll>
        <FilmController scenes={scenes} />
      </SmoothScroll>
    </main>
  );
}
