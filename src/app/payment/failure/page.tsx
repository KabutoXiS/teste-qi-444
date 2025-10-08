"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function PaymentFailure() {
  const router = useRouter()

  const handleBackToResult = () => {
    router.push('/')
  }

  const handleTryAgain = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <XCircle className="w-16 h-16 text-[#E53935] mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-[#333333]">
            Pagamento Não Realizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#E53935] bg-opacity-10 border border-[#E53935] p-4 rounded-lg">
            <p className="text-[#E53935] font-semibold">
              ❌ Houve um problema com seu pagamento
            </p>
          </div>
          <p className="text-[#333333]">
            Não se preocupe! Você pode tentar novamente ou escolher outro método de pagamento.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={handleTryAgain}
              className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white"
            >
              Tentar Novamente
            </Button>
            <Button 
              onClick={handleBackToResult}
              variant="outline"
              className="w-full border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
            >
              Voltar ao Resultado
            </Button>
          </div>
          <p className="text-xs text-[#333333] opacity-60">
            Se o problema persistir, entre em contato conosco
          </p>
        </CardContent>
      </Card>
    </div>
  )
}