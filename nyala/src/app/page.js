"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  useEffect(() => {
    router.push("admin");
  }, []);

  return <></>;
}
