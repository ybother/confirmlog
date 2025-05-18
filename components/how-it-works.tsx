import { LockKeyhole, Share2, Key, FileCheck } from "lucide-react"

export function HowItWorks() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/70">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <LockKeyhole className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">1. Encrypt the Secret</h3>
          <p className="text-sm text-gray-600">
            You enter a secret and a decrypt key. It's encrypted in your browser — we never see it.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/70">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <Share2 className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">2. Share the Link</h3>
          <p className="text-sm text-gray-600">
            We give you a one-time link. You send it and the decrypt key via trusted channels (e.g. Signal, email).
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/70">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <Key className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">3. Recipient Unlocks</h3>
          <p className="text-sm text-gray-600">
            They open the link, enter the key, and decrypt the secret — all in their browser.
          </p>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/70">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <FileCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">4. Logged & Burned</h3>
          <p className="text-sm text-gray-600">
            We log the time and IP. The secret is deleted after one view. You get a receipt as proof it was accessed.
          </p>
        </div>
      </div>
    </div>
  )
}
