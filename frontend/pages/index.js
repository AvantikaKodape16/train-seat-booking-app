import Head from "next/head";
import SeatGrid from "../components/SeatGrid";

export default function Home() {
  return (
    <>
      <Head>
        <title>Train Seat Booking</title>
      </Head>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
        <SeatGrid />
      </main>
    </>
  );
}
