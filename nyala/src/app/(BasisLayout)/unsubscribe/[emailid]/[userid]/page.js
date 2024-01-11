import UitschrijfForm from "@/components/unsubscribe/UnsubscribeForm";

export default function Page({ params }) {
  return (
    <div>
      <UitschrijfForm userid={params.userid} emailid={params.emailid} />
    </div>
  );
}
