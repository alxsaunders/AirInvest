// import Image from "next/image";
// import dynamic from 'next/dynamic'
// import { ZipCodeSearch } from '@/components/ZipCodeSearch'
// import { LocationSearch } from '@/components/LocationSearch'
// import Map from '../components/Map';

// const ThreeScene = dynamic(() => import('@/components/ThreeScene'), { ssr: false })

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="https://nextjs.org/icons/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="https://nextjs.org/icons/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>

//         {/* Three.js Scene */}
//         <div style={{ width: '100%', height: '400px' }}>
//           <ThreeScene />
//         </div>
//         <section className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Zillow Listings</h2>
//         <ZipCodeSearch />
//       </section>
//       <section>
//       <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">My Google Maps Page</h1>
//       <Map 
//         center={{ lat: 40.7128, lng: -74.0060 }}
//         zoom={13}
//         markers={[
//           {
//             position: { lat: 40.7128, lng: -74.0060 },
//             title: "New York City"
//           }
//         ]}
//       />
//     </div>
//       </section>
//         <section>
//         <h2 className="text-2xl font-semibold mb-4">Airbnb Listings</h2>
//         <LocationSearch />
//       </section>
//       </main>
//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         {/* ... footer content ... */} 
//       </footer>
//     </div>
//   );
// }