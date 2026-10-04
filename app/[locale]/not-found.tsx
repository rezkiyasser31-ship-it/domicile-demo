import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-4xl font-fraunces mb-4 text-charcoal">
        404 - Not Found
      </h2>
      <p className="mb-6">Could not find requested resource</p>
      <Link
        href="/"
        className="px-4 py-2 bg-brand text-ivory rounded-md font-bold"
      >
        Return Home
      </Link>
    </div>
  );
}
