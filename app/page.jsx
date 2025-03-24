
'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BusanTripMapWithGoogle from "@/components/BusanTripMapWithGoogle";

export default function Page() {
  const [addresses, setAddresses] = useState([
    "서울특별시 강남구 광평로 281",
    "부산광역시 동구 중앙대로 206",
    "부산광역시 영도구 흰여울길 249-1",
    "부산광역시 영도구 청학로 14",
    "부산광역시 영도구 봉래나루로 225",
    "부산광역시 영도구 대평동1가 11",
    "부산광역시 수영구 광안해변로 165",
    "부산광역시 부산진구 전포동",
    "부산광역시 수영구 남천동로108번길 8",
    "부산광역시 남구 용호동 산 1-1",
    "부산광역시 수영구 광안해변로 197번길 10",
    "부산광역시 수영구 광안해변로 257"
  ]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🗺️ 부산 1박 2일 동선 지도</h1>
      <div className="space-y-2">
        {addresses.map((addr, idx) => (
          <Input
            key={idx}
            value={addr}
            onChange={(e) => {
              const newAddresses = [...addresses];
              newAddresses[idx] = e.target.value;
              setAddresses(newAddresses);
            }}
          />
        ))}
      </div>
      <Button onClick={() => window.open("https://www.google.com/maps/dir/" + addresses.map(encodeURIComponent).join("/"), "_blank")}>
        📍 구글 지도에서 동선 보기
      </Button>

      <div className="mt-10">
        <BusanTripMapWithGoogle />
      </div>
    </div>
  );
}
