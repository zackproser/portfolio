import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LanguageSupportProps {
  databases: Database[]
}

export default function LanguageSupport({ databases }: LanguageSupportProps) {
  // Define programming languages with their SVG logos
  const languages = [
    {
      id: "python",
      name: "Python",
      logo: (
        <svg viewBox="0 0 128 128" className="h-6 w-6">
          <linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
            <stop offset="0" stopColor="#5A9FD4"/>
            <stop offset="1" stopColor="#306998"/>
          </linearGradient>
          <linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
            <stop offset="0" stopColor="#FFD43B"/>
            <stop offset="1" stopColor="#FFE873"/>
          </linearGradient>
          <path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"/>
          <path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/>
        </svg>
      ),
    },
    {
      id: "javascript",
      name: "JavaScript",
      logo: (
        <svg viewBox="0 0 128 128" className="h-6 w-6">
          <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"/>
          <path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"/>
        </svg>
      ),
    },
    {
      id: "java",
      name: "Java",
      logo: (
        <svg viewBox="0 0 128 128" className="h-6 w-6">
          <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
          <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/>
          <path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/>
          <path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/>
          <path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"/>
        </svg>
      ),
    },
    {
      id: "go",
      name: "Go",
      logo: (
        <svg viewBox="0 0 128 128" className="h-6 w-6">
          <path fill="#00ACD7" d="M108.2 64.8c-.1-.1-.2-.2-.4-.2l-.1-.1c-.1-.1-.2-.1-.2-.2l-.1-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.2-.1-.2-.1-.1 0-.1 0-.2-.1l-.3-.1c-.1 0-.1 0-.2-.1l-.3-.1h-.1l-.4-.1h-.2c-.1 0-.2 0-.3-.1h-2.3c-.4 0-.8.1-1.2.2l-.8.2c-.3.1-.6.2-.8.3l-.6.3-.6.4-.5.4c-.2.1-.3.3-.4.5l-.3.5-.3.6-.2.6-.1.6v.6c0 .2 0 .4.1.6l.1.6.2.6.3.6.3.5.4.5.5.4.6.4.6.3c.3.1.5.2.8.3l.8.2 1.2.1h2.3l.4-.1h.1l.3-.1h.2l.3-.1h.1l.3-.1h.1l.2-.1c.1 0 .1 0 .2-.1l.2-.1c.1 0 .2-.1.2-.1l.2-.1c.1 0 .2-.1.2-.1l.2-.1.1-.1.2-.2.1-.1.1-.1c.1-.1.1-.1.2-.2l.1-.1c.1-.1.1-.2.2-.3l.1-.2c0-.1.1-.2.1-.2l.1-.2c0-.1.1-.2.1-.3v-.1c0-.1.1-.2.1-.3v-.2c0-.1 0-.2.1-.3v-2.1c0-.1 0-.2-.1-.3v-.2c0-.1 0-.2-.1-.3v-.1c0-.1-.1-.2-.1-.3l-.1-.2c0-.1-.1-.2-.1-.2l-.1-.2c-.1-.1-.1-.2-.2-.3l-.1-.1c-.1-.1-.1-.1-.2-.2l-.1-.1-.1-.1-.2-.2-.1-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.1 0-.2-.1l-.3-.1h-.1l-.3-.1H108.2l-.3-.1h-.1z"/>
        </svg>
      ),
    },
    {
      id: "rust",
      name: "Rust",
      logo: (
        <svg viewBox="0 0 128 128" className="h-6 w-6">
          <path fill="#DEA584" d="M128 64c0 35.346-28.654 64-64 64S0 99.346 0 64 28.654 0 64 0s64 28.654 64 64z"/>
          <path fill="#000" d="M64 0C28.654 0 0 28.654 0 64s28.654 64 64 64 64-28.654 64-64S99.346 0 64 0zm0 120C33.072 120 8 94.928 8 64S33.072 8 64 8s56 25.072 56 56-25.072 56-56 56z"/>
          <path fill="#000" d="M64 16c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm0 88c-22.091 0-40-17.909-40-40s17.909-40 40-40 40 17.909 40 40-17.909 40-40 40z"/>
          <path fill="#000" d="M64 32c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm0 56c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24z"/>
          <path fill="#000" d="M64 48c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zm0 24c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Language Support</CardTitle>
          <CardDescription>Programming language support and SDK availability</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Language</TableHead>
                {databases.map((db) => (
                  <TableHead key={db.id}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {languages.map((lang) => (
                <TableRow key={lang.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {lang.logo}
                      <span>{lang.name}</span>
                    </div>
                  </TableCell>
                  {databases.map((db) => (
                    <TableCell key={`${db.id}-${lang.id}`}>
                      {db.search.queryLanguages[lang.id] === true ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : db.search.queryLanguages[lang.id] === false ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <Badge variant="outline">{db.search.queryLanguages[lang.id]}</Badge>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SDK Features</CardTitle>
          <CardDescription>Language-specific SDK features and capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Feature</TableHead>
                {databases.map((db) => (
                  <TableHead key={db.id}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { key: "typeSafety", label: "Type Safety" },
                { key: "asyncSupport", label: "Async/Await Support" },
                { key: "batchOperations", label: "Batch Operations" },
                { key: "errorHandling", label: "Error Handling" },
                { key: "documentation", label: "Documentation" },
              ].map((feature) => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium">{feature.label}</TableCell>
                  {databases.map((db) => (
                    <TableCell key={`${db.id}-${feature.key}`}>
                      {db.search.queryLanguages[feature.key] === true ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : db.search.queryLanguages[feature.key] === false ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <Badge variant="outline">{db.search.queryLanguages[feature.key]}</Badge>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 