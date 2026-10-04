export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="p-8">
      <h1 className="font-fraunces text-3xl">Product: {slug}</h1>
    </div>
  );
}
