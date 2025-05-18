import { createSecureDropAction } from "./actions/secure-drop"
import SubmitForm from "./components/submit-form"
import { FAQ } from "@/components/faq"
import { HowItWorks } from "@/components/how-it-works"
import { UseCases } from "@/components/use-cases"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center p-4 py-12 md:py-24">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border-2 border-green-500">
        <h1 className="text-3xl font-bold mb-2 text-center">Secure Message Sharing</h1>
        <p className="mb-8 text-center text-gray-800 font-medium">
          with proof that a sensitive secret was retrieved, by the right person, just once, and securely.
        </p>
        <SubmitForm createSecureDropAction={createSecureDropAction} />
      </div>

      <div className="mt-24 w-full">
        <HowItWorks />
      </div>

      <div className="mt-16 w-full">
        <UseCases />
      </div>

      <div className="mt-16 w-full">
        <FAQ />
      </div>
    </div>
  )
}
