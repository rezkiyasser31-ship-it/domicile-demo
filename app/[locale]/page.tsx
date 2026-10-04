import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Hero");

  return (
    <div className="flex flex-col gap-8 p-8">
      <section className="bg-sand p-12 text-center rounded-lg">
        <h1 className="font-fraunces text-4xl mb-4 text-charcoal">
          {t("title")}
        </h1>
        <button className="bg-brand text-ivory px-6 py-2 rounded-md font-bold">
          {t("cta")}
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ivory border border-sand p-6 rounded-md">
          Living Room (Placeholder)
        </div>
        <div className="bg-ivory border border-sand p-6 rounded-md">
          Bedroom (Placeholder)
        </div>
        <div className="bg-ivory border border-sand p-6 rounded-md">
          Dining (Placeholder)
        </div>
      </section>

      <section className="bg-walnut text-ivory p-8 rounded-md mt-8">
        <h2 className="font-fraunces text-2xl mb-2">Showroom & Contact</h2>
        <p>123 Furniture Street, Oran, Algeria (Placeholder)</p>
        <p>+213 123 456 789 (Placeholder)</p>
      </section>
    </div>
  );
}
