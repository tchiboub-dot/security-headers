'use client'

/* eslint-disable react/no-unescaped-entities */

export default function Legal() {
  return (
    <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass rounded-2xl p-8 mb-8 border border-blue-400 border-opacity-30">
          <h1 className="text-4xl font-bold text-white mb-2">📋 Terms & Disclaimer</h1>
          <p className="text-gray-300">
            Important information about using Password & Phishing Lab
          </p>
        </div>

        <div className="space-y-6">
          {/* Educational Purpose */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white mb-4">📚 Educational Purpose</h2>
            <p className="text-gray-300 mb-3">
              Password & Phishing Lab is designed as an educational tool to help users understand:
            </p>
            <ul className="space-y-2 text-gray-300 ml-4">
              <li>✓ How to create and evaluate password strength</li>
              <li>✓ Common phishing tactics and red flags</li>
              <li>✓ Best practices for cybersecurity</li>
              <li>✓ How to protect personal information online</li>
            </ul>
          </div>

          {/* No Guarantee */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white mb-4">⚠️ Disclaimer</h2>
            <p className="text-gray-300 mb-3">
              This tool provides analysis and recommendations but is not a guarantee of security. Important disclaimers:
            </p>
            <ul className="space-y-2 text-gray-300 ml-4">
              <li>❌ Analysis results are recommendations only, not guarantees</li>
              <li>❌ A "strong" password from us doesn't guarantee account safety if:</li>
              <li className="ml-4">• The service is compromised via data breach</li>
              <li className="ml-4">• You use it on multiple accounts</li>
              <li className="ml-4">• Your device has malware</li>
              <li>❌ Phishing detection is not 100% accurate</li>
              <li>❌ New phishing techniques emerge constantly</li>
              <li>❌ Trust your instinct—if something feels wrong, it probably is</li>
            </ul>
          </div>

          {/* Privacy Policy */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white mb-4">🔒 Privacy Policy</h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-white font-semibold mb-2">What We Collect</h3>
                <ul className="ml-4 space-y-1">
                  <li>✓ Analysis results (if you enable history saving)</li>
                  <li>✓ Usage statistics (anonymized)</li>
                  <li>✓ Device information (browser, OS)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">What We DON&apos;T Collect</h3>
                <ul className="ml-4 space-y-1">
                  <li>✓ Raw passwords (never stored, only hashed for analysis)</li>
                  <li>✓ Personal information</li>
                  <li>✓ Email addresses (unless you choose to save history)</li>
                  <li>✓ Browsing history</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Data Security</h3>
                <p>
                  All data in transit is encrypted with HTTPS. Stored data is protected with industry-standard encryption.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Your Rights</h3>
                <ul className="ml-4 space-y-1">
                  <li>✓ Access your data anytime</li>
                  <li>✓ Delete your history with one click</li>
                  <li>✓ Opt out of history saving</li>
                  <li>✓ Request all your data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Terms of Service */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white mb-4">📜 Terms of Service</h2>
            
            <div className="space-y-4 text-gray-300 text-sm">
              <div>
                <h3 className="text-white font-semibold mb-2">Acceptable Use</h3>
                <p>
                  You agree to use this service for educational and legitimate security testing purposes only. Do not:
                </p>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>❌ Attack or test systems you don't own</li>
                  <li>❌ Use for illegal activities</li>
                  <li>❌ Abuse rate limits or attempt to overload servers</li>
                  <li>❌ Harass other users or share others' data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Liability</h3>
                <p>
                  This service is provided "as is" without warranty. We are not responsible for:
                </p>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>Account compromises despite "strong" password recommendations</li>
                  <li>Phishing attacks that bypass our detection</li>
                  <li>Service interruptions or data loss</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Changes to Service</h3>
                <p>
                  We may update these terms, features, or data policies at any time. Continued use means you accept changes.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="glass rounded-xl p-6 border border-green-400 border-opacity-20">
            <h2 className="text-2xl font-bold text-white mb-4">✓ Use With Best Practices</h2>
            <p className="text-gray-300 mb-4">
              For best results, combine this tool with these practices:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-green-400 font-semibold mb-2">Passwords</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>✓ Use a password manager</li>
                  <li>✓ Enable 2FA always</li>
                  <li>✓ Change if compromised</li>
                  <li>✓ Check haveibeenpwned.com</li>
                </ul>
              </div>
              <div>
                <h3 className="text-green-400 font-semibold mb-2">Phishing</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>✓ Hover to check URLs</li>
                  <li>✓ Contact companies directly</li>
                  <li>✓ Report to email provider</li>
                  <li>✓ Trust your instinct</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="glass rounded-xl p-6 border border-white border-opacity-10">
            <h2 className="text-2xl font-bold text-white mb-4">📧 Contact & Support</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                Have questions about our privacy practices, terms, or how your data is used?
              </p>
              <p>
                Email us at: <span className="text-blue-400 font-mono">security@phishlab.local</span>
              </p>
              <p className="text-sm mt-4">
                Last updated: March 2026
              </p>
            </div>
          </div>

          {/* Acceptance */}
          <div className="glass rounded-xl p-6 border border-blue-400 border-opacity-30">
            <p className="text-gray-300 text-sm">
              By using Password & Phishing Lab, you acknowledge that you have read and agree to these terms and our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
