import TemplateAnalyse from "@/components/analyse/TemplateAnalyse";

function Page({ params }) {
  return <TemplateAnalyse id={params.id} />;
}

export default Page;
