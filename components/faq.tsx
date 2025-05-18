import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="encryption-method">
          <AccordionTrigger>What encryption method is used?</AccordionTrigger>
          <AccordionContent className="text-gray-700 space-y-2">
            <p>
              We use the Web Crypto API with AES-GCM (Advanced Encryption Standard in Galois/Counter Mode) for
              end-to-end encryption. This is a strong, industry-standard encryption algorithm that provides both
              confidentiality and integrity.
            </p>

            <p className="font-medium mt-2">Technical implementation:</p>

            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-mono text-sm">PBKDF2</span> (Password-Based Key Derivation Function 2) is used to
                derive a cryptographic key from your decryption key with 100,000 iterations and SHA-256 hashing
              </li>
              <li>A random 16-byte salt is generated for each message to prevent rainbow table attacks</li>
              <li>A random 12-byte initialization vector (IV) is generated for each encryption operation</li>
              <li>The derived key is used with AES-GCM to encrypt the message with a 256-bit key length</li>
              <li>
                The encrypted message is stored in the format:{" "}
                <span className="font-mono text-sm">base64(iv):base64(salt):base64(ciphertext)</span>
              </li>
            </ul>

            <p className="mt-2">
              All encryption and decryption happens in your browser. Your decryption key is never sent to our servers,
              ensuring true end-to-end encryption.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="message-security">
          <AccordionTrigger>How secure are the messages?</AccordionTrigger>
          <AccordionContent>
            <p>
              Messages are encrypted end-to-end using AES-256-GCM encryption. Only someone with the decryption key can
              read the message. The server only stores the encrypted content and cannot decrypt it. Additionally,
              messages are automatically deleted after being viewed once or when they expire.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="message-expiry">
          <AccordionTrigger>When do messages expire?</AccordionTrigger>
          <AccordionContent>
            <p>
              By default, messages expire after 7 days if they haven't been viewed. Once a message is viewed, its
              content is immediately deleted from our servers. A daily cleanup job also removes any expired messages.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-storage">
          <AccordionTrigger>What data is stored on your servers?</AccordionTrigger>
          <AccordionContent>
            <p>
              We store the encrypted message (which we cannot decrypt), a message ID, creation timestamp, expiration
              date, and access logs. Access logs may include IP address and general location information to help verify
              that the intended recipient accessed the message.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
