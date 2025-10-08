"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function PaymentSuccess() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentId = searchParams.get('payment_id')
      const status = searchParams.get('status')

      if (status === 'approved' && paymentId) {
        try {
          const response = await fetch(`/api/check-payment/${paymentId}`)
          const data = await response.json()

          if (data.status === 'approved') {
            setPaymentVerified(true)
            // Salvar no localStorage que o pagamento foi aprovado
            localStorage.setItem('iq_test_paid', 'true')
            localStorage.setItem('payment_id', paymentId)
          }
        } catch (error) {
          console.error('Erro ao verificar pagamento:', error)
        }
      }

      setIsVerifying(false)
    }

    verifyPayment()
  }, [searchParams])

  const handleBackToResult = () => {
    router.push('/')
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#333333] mb-2">
              Verificando seu pagamento...
            </h2>
            <p className="text-[#333333] opacity-70">
              Aguarde enquanto confirmamos sua transação
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CheckCircle className="w-16 h-16 text-[#4CAF50] mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-[#333333]">
            {paymentVerified ? 'Pagamento Confirmado!' : 'Processando Pagamento'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentVerified ? (
            <>
              <div className="bg-[#4CAF50] bg-opacity-10 border border-[#4CAF50] p-4 rounded-lg">
                <p className="text-[#4CAF50] font-semibold">
                  ✅ Seu resultado completo foi desbloqueado!
                </p>
              </div>
              <p className="text-[#333333]">
                Agora você pode ver seu QI completo, análise detalhada e baixar seu certificado.
              </p>
              <Button 
                onClick={handleBackToResult}
                className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white"
              >
                Ver Meu Resultado Completo
              </Button>
            </>
          ) : (
            <>
              <div className="bg-[#FFB300] bg-opacity-10 border border-[#FFB300] p-4 rounded-lg">
                <p className="text-[#FFB300] font-semibold">
                  ⏳ Seu pagamento está sendo processado
                </p>
              </div>
              <p className="text-[#333333]">
                Isso pode levar alguns minutos. Você receberá uma confirmação em breve.
              </p>
              <Button 
                onClick={handleBackToResult}
                variant="outline"
                className="w-full border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
              >
                Voltar ao Teste
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}