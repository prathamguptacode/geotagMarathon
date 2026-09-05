import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <div className="h-screen flex justify-center items-center flex-col gap-16">
    <img src="hello-kitty.svg" />
    <h1 className="text-4xl font-semibold">Geotags</h1>
    <div className="text-[12px] text-gray-300 absolute bottom-2 right-4">*We provide Tamper-resistant Geo-taged Images </div>
  </div>
}
