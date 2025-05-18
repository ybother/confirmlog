import { ServerInfoDebug } from "@/components/server-info-debug"

export default function DebugPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Debug Information</h1>
        <p className="mb-8 text-center text-gray-600">
          This page displays technical information about the server and deployment.
        </p>

        <ServerInfoDebug />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">This page is intended for developers and administrators only.</p>
        </div>
      </div>
    </div>
  )
}
