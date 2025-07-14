"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Mail, Search, User, ArrowRight, Building, Building2, CreditCard, Globe, Heart, History, SendToBack, Wallet } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionsPage() {
  // Navbar state
  const [user, setUser] = useState({ email: "user@example.com",personalProfile: { otherNames: "Doe" }  })
  const [selectedAccountType, setSelectedAccountType] = useState({ type: "Savings" })
  
  // Transactions state
  const [accountType, setAccountType] = useState([
    { id: "1", type: "Savings", accountNumber: "1234567890", accounts: [{ id: "acc1", name: "Main Account", activationStatus: "Complete", currencyBalances: {
          availableBalance: 250000,
          ledgerBalance: 250000
        }, type: "savings"}] }
  ])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [transactions, setTransactions] = useState([
    {
      id: "1",
      type: "TRANSFER",
      timestamp: new Date().toISOString(),
      amount: 1000,
      currency: "USD",
      status: "COMPLETED"
    },
    {
      id: "2",
      type: "EXCHANGE",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      amount: 500,
      currency: "EUR",
      status: "PENDING"
    }
  ])

  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)

  const fetchAccounts = async () => {
    const res = await axios.get('https://sbfserver.site/accounts/user/test')
    return res.data
  }

  const { data, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts
  })

useEffect(() => {
  if (data?.accountTypes) {
    setAccountType(data.accountTypes)

    // Automatically select the first sub-account as default
    if (data.accountTypes[0]?.accounts?.[0]) {
      setSelectedAccount(data.accountTypes[0].accounts[0].id)
    }

    // Set user details for navbar
    setUser({
      email: data.email,
      personalProfile: data.personalProfile,
    })

    setSelectedAccountType(data.accountTypes[0])
  }
}, [data])

  const formatCurrency = (amount: number, currencyCode: string) => {
    return `${currencyCode} ${amount.toLocaleString()}`
  }

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa]">
      <header className="px-6 pt-2 w-full bg-[#f5f3fa] backdrop-blur supports-[backdrop-filter]:bg-[#f5f3fa]/80">
        <div className="container flex h-14 !py-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search investments, accounts, or beneficiaries..."
                className="w-full pl-10 bg-white/50 border-gray-200 focus:border-[#2dd4bf] focus:ring-[#2dd4bf]/20 transition-colors"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Contacts
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-sm">
                <p className="font-medium">{user?.personalProfile?.otherNames || user?.email || "..."}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {selectedAccountType ? `${selectedAccountType.type.toLowerCase()} Account` : "..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
    <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div>
    <h1 className="text-4xl mb-1 font-bold bg-gradient-to-r from-[#0d9488] to-[#2dd4bf] bg-clip-text text-transparent">
      Transactions
    </h1>
    <p className="text-muted-foreground">
      Manage your money transfers and view transaction history
    </p>
  </div>

  <div>
    <Select value={selectedAccount || 'select an account'} onValueChange={setSelectedAccount}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent>
        {accountType.flatMap((type) =>
        (
           <SelectItem key={type.id} value={type.id}>
              {type.type.replace(/_/g, ' ').toLowerCase()} 
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  </div>
</div>

        <>
          {selectedAccount && (
                   <div className={`grid gap-4 ${accountType.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
              {isLoadingAccounts ? (
        Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </Card>
        ))
              ) : (
                accountType.map((accountType) => (
    <Card key={accountType.id}  className="mb-3 ml-2 w-full md:w-[100%]">
      <CardHeader>
        <h2 className="font-semibold text-lg text-[#0d9488]">{accountType.type} Account</h2>
        <p className="text-sm text-gray-500">Acc No: {accountType.accountNumber}</p>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-2">Sub-accounts:</CardDescription>
         <ul className="space-y-2 text-sm">
          {accountType.accounts.map((acc) => (
            <li key={acc.id} className="flex justify-between bg-zinc-100 text-black p-2 rounded bg-gradient-to-r from-[#2dd4bf]/10 to-[#34d399]/10">
              <span>{acc.type}</span>
              <span className="font-semibold">₦{(acc.currencyBalances?.availableBalance ?? 0).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )))}
</div>
          )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-[#2dd4bf]/10 to-[#34d399]/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-[#0d9488]">Internal Transfer</CardTitle>
                    <div className="p-3 rounded-full bg-[#2dd4bf]/10 group-hover:bg-[#2dd4bf]/20 transition-colors">
                      <SendToBack className="h-6 w-6 text-[#2dd4bf]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-gray-600 mb-4">
                    Transfer money between your own accounts instantly
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <span>Instant processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span>No transfer fees</span>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4 bg-gradient-to-r from-[#2dd4bf] to-[#34d399] hover:from-[#10b981] hover:to-[#2dd4bf] text-white">
                    <Link href="/internal-transfer">
                      Transfer Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-[#2dd4bf]/10 to-[#34d399]/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-[#0d9488]">External Transfer</CardTitle>
                    <div className="p-3 rounded-full bg-[#2dd4bf]/10 group-hover:bg-[#2dd4bf]/20 transition-colors">
                      <Globe className="h-6 w-6 text-[#2dd4bf]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-gray-600 mb-4">
                    Send money to accounts in other banks worldwide
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Multiple currencies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <span>1-2 business days</span>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4 bg-gradient-to-r from-[#2dd4bf] to-[#34d399] hover:from-[#10b981] hover:to-[#2dd4bf] text-white">
                    <Link href="/transaction/transfer/external">
                      Transfer Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-[#2dd4bf]/10 to-[#34d399]/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-[#0d9488]">Beneficiary Transfer</CardTitle>
                    <div className="p-3 rounded-full bg-[#2dd4bf]/10 group-hover:bg-[#2dd4bf]/20 transition-colors">
                      <Heart className="h-6 w-6 text-[#2dd4bf]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-gray-600 mb-4">
                    Send money to your saved beneficiaries quickly
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>Manage beneficiaries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <span>Quick transfers</span>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4 bg-gradient-to-r from-[#2dd4bf] to-[#34d399] hover:from-[#10b981] hover:to-[#2dd4bf] text-white">
                    <Link href="/transaction/transfer/beneficiary">
                      Transfer Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg pt-0 mb-12">
              <CardHeader className="bg-gradient-to-r py-4 from-[#2dd4bf] via-[#34d399] to-[#10b981] rounded-t-lg text-white relative overflow-hidden">
                <CardTitle>Transfer Limits</CardTitle>
                <CardDescription className="text-white/90">
                  Daily and monthly transfer limits
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-[#0d9488]">Internal Transfers</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Daily Limit</span>
                        <span className="font-semibold">$10,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Limit</span>
                        <span className="font-semibold">$100,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-[#0d9488]">External Transfers</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Daily Limit</span>
                        <span className="font-semibold">$5,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Limit</span>
                        <span className="font-semibold">$50,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 pt-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r py-4 from-[#2dd4bf] via-[#34d399] to-[#10b981] rounded-t-lg text-white relative overflow-hidden">
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription className="text-white/90">
                  Your latest transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingTransactions ? (
                  <div className="flex justify-center items-center h-40">
                   <h1 className="text-xl">Loading...</h1>
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="rounded-xl border-2 border-gray-100 p-4 hover:border-[#2dd4bf] transition-colors duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-full bg-[#ccfbf1]">
                              {transaction.type === "TRANSFER" ? (
                                <SendToBack className="h-5 w-5 text-[#2dd4bf]" />
                              ) : transaction.type === "EXCHANGE" ? (
                                <CreditCard className="h-5 w-5 text-[#2dd4bf]" />
                              ) : (
                                <Wallet className="h-5 w-5 text-[#2dd4bf]" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-[#0d9488]">
                                {transaction.type}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDateTime(transaction.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-[#2dd4bf]">
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </div>
                            <Badge
                              variant="outline"
                              className={`mt-2 ${
                                transaction.status === "COMPLETED"
                                  ? "border-green-200 text-green-700"
                                  : transaction.status === "PENDING"
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-red-200 text-red-700"
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No recent transactions found
                  </div>
                )}
              </CardContent>
            </Card>
          </>
            </main>
    </div>
  )
}