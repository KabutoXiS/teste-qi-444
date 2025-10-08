"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

export default function PaymentPending() {
  const router = useRouter()

  const handleBackToResult = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Clock className="w-16 h-16 text-[#FFB300] mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-[#333333]">
            Pagamento Pendente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#FFB300] bg-opacity-10 border border-[#FFB300] p-4 rounded-lg">
            <p className="text-[#FFB300] font-semibold">
              ⏳ Seu pagamento está sendo processado
            </p>
          </div>
          <p className="text-[#333333]">
            Dependendo do método de pagamento escolhido, pode levar alguns minutos ou até 2 dias úteis para ser aprovado.
          </p>
          <p className="text-[#333333] text-sm">
            Você receberá uma notificação assim que o pagamento for confirmado e poderá acessar seu resultado completo.
          </p>
          <Button 
            onClick={handleBackToResult}
            className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white"
          >
            Voltar ao Resultado
          </Button>
          <p className="text-xs text-[#333333] opacity-60">
            Você pode verificar o status do pagamento a qualquer momento
          </p>
        </CardContent>
      </Card>
    </div>
  )
}