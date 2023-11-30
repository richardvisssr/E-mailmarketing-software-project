"use client";

import SubscribeField from "@/components/subscribe/SubscribeField";

export default function page({ params }) {
  return <SubscribeField list={params.list} />;
}
