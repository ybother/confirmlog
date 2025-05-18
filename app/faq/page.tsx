import { FAQ } from "@/components/faq"

export default function FAQPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">Frequently Asked Questions</h1>
      <p className="mb-12 text-center text-gray-600">
        Learn more about how ConfirmLog works and how we keep your messages secure
      </p>

      <FAQ />

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Have more questions? Contact us at{" "}
          <a href="mailto:support@confirmlog.com" className="text-indigo-600 hover:underline">
            support@confirmlog.com
          </a>
        </p>
      </div>
    </div>
  )
}
