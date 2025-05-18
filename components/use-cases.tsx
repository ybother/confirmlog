import { Key, Globe, Briefcase, FileText, Clock, Gift, Code } from "lucide-react"

export function UseCases() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <span className="text-2xl">🔑</span> Use Cases
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Use Case 1 */}
        <div className="flex gap-4 p-4 rounded-lg bg-white/70 border border-gray-100">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Domain AUTH Code Transfer</h3>
            <p className="text-sm text-gray-600">
              Share domain transfer codes with buyers — and get proof they accessed it.
            </p>
          </div>
        </div>

        {/* Use Case 2 */}
        <div className="flex gap-4 p-4 rounded-lg bg-white/70 border border-gray-100">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Key className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Handing Over Passwords or Logins</h3>
            <p className="text-sm text-gray-600">
              Send credentials to clients, teammates, or vendors — safely, with a log of when they were retrieved.
            </p>
          </div>
        </div>

        {/* Use Case 4 */}
        <div className="flex gap-4 p-4 rounded-lg bg-white/70 border border-gray-100">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Client Handover for Agencies or Freelancers</h3>
            <p className="text-sm text-gray-600">
              After project completion, pass admin credentials or sensitive links and confirm delivery.
            </p>
          </div>
        </div>

        {/* Use Case: Gift Card Codes */}
        <div className="flex gap-4 p-4 rounded-lg bg-white/70 border border-gray-100">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
              <Gift className="h-5 w-5 text-pink-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Sending Gift Card Codes</h3>
            <p className="text-sm text-gray-600">
              Share digital gift card codes securely with recipients and get confirmation when they've been claimed.
            </p>
          </div>
        </div>

        {/* NEW Use Case: Software License Keys */}
        <div className="flex gap-4 p-4 rounded-lg bg-white/70 border border-gray-100">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
              <Code className="h-5 w-5 text-cyan-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Software License Keys</h3>
            <p className="text-sm text-gray-600">
              Distribute premium software licenses to customers with verification of delivery and activation.
            </p>
          </div>
        </div>

        {/* Use Case: Document Unlock Codes */}
        <div className="flex gap-4 p-4 rounded-lg bg-white/70 border border-gray-100">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Legal or Financial Document Unlock Codes</h3>
            <p className="text-sm text-gray-600">
              Send document passwords (e.g. PDF encryption) and verify when they've been opened.
            </p>
          </div>
        </div>

        {/* Use Case: Temporary Access */}
        <div className="flex gap-4 p-4 rounded-lg bg-white/70 border border-gray-100">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-teal-600" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Temporary Access for Contractors</h3>
            <p className="text-sm text-gray-600">
              Share a password, PIN, or SIM unlock code with short-term workers — with one-time view and audit trail.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
