import { UseCases } from "@/components/use-cases"

export default function UseCasesPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Use Cases</h1>
        <p className="mb-12 text-center text-gray-600">
          Discover the many ways ConfirmLog can help you securely share sensitive information
        </p>

        <UseCases />

        <div className="mt-12 text-center bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Ready to try it yourself?</h2>
          <p className="text-gray-600 mb-6">
            Create your first secure message and experience the simplicity and security firsthand.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Secure Message
          </a>
        </div>
      </div>
    </div>
  )
}
