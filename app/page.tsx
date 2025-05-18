import { createSecureDropAction } from "./actions/secure-drop"
import SubmitForm from "./components/submit-form"
import { FAQ } from "@/components/faq"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center p-4 py-12 md:py-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Secure Message Sharing</h1>
        <p className="mb-8 text-center text-indigo-700 font-medium">
          with proof that a sensitive secret was retrieved, by the right person, just once, and securely.
        </p>
        <SubmitForm createSecureDropAction={createSecureDropAction} />
      </div>

      <div className="mt-24 w-full">
        <FAQ />
      </div>
    </div>
  )
}
