'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'

export default function Page() {
  const [amount, setAmount] = useState('')

  const fetchAccounts = async () => {
    const res = await axios.get('https://sbfserver.site/accounts/user/test')
    return res.data
  }

  const { data, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        'https://sbfserver.site/transactions/transfer/test',
        { amount: Number(amount) }
      )
      return res.data
    },
    onSuccess: (response) => {
      alert('Transfer Successful!')
      setAmount('')
    },
    onError: (err: any) => {
      alert(`Transfer Failed: ${err.response?.data?.message || 'Unknown error'}`)
      console.error(err)
    },
  })

  const handleTransfer = () => {
    if (!amount) {
      alert('Please enter an amount to transfer')
      return
    }

    mutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Internal Transfer</h1>

      {data?.accountTypes.map((type: any) => (
        <Card
          key={type.id}
          className="max-w-2xl mx-auto bg-white shadow-lg mb-6"
        >
          <CardHeader className="text-center">
            <h2 className="font-semibold text-[#0d9488]">
              {type.type} Account
            </h2>
            <p className="text-sm text-gray-500">
              Account Number: {type.accountNumber}
            </p>
          </CardHeader>

          <CardContent>
            <CardDescription className="mb-4">
              Internal transfers allow you to move funds between your own
              accounts without incurring any fees.
            </CardDescription>

            <ul className="space-y-2 mb-4">
              {type.accounts.slice(0, 2).map((acc: any) => (
                <li
                  key={acc.id}
                  className="p-2 bg-gray-100 rounded"
                >
                  <p>Type: {acc.type.replace(/_/g, ' ')}</p>
                  <p>
                    Balance: ₦
                    {(acc.currencyBalances?.availableBalance ?? 5000000).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    From: {type.accountNumber}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2">
              <Input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button
                className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white"
                onClick={handleTransfer}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Transferring...' : 'Transfer'}
                      </Button>
                      {mutation.isSuccess && (
                          <p className="text-green-600 mt-2 text-center">Transfer Successful</p>
                      )}
                      {mutation.isError && (
                            <p className="text-red-600 mt-2 text-center">
                                Transfer Failed: {mutation.error.message}
                            </p>
                      )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
