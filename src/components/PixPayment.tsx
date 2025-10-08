"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, CheckCircle, QrCode, Clock, CreditCard } from 'lucide-react'

interface PixPaymentProps {
  amount: number
  title: string
  onPaymentSuccess: () => void
  onCancel: () => void
}

export default function PixPayment({ amount, title, onPaymentSuccess, onCancel }: PixPaymentProps) {
  const [pixData, setPixData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)

  const createPixPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-pix-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          price: amount,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento PIX')
      }

      const data = await response.json()
      setPixData(data)
      
      // Iniciar verificação automática do pagamento
      startPaymentCheck(data.id)
    } catch (error) {
      console.error('Erro ao criar PIX:', error)
      alert('Erro ao gerar PIX. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const startPaymentCheck = (paymentId: string) => {
    setCheckingPayment(true)
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-payment/${paymentId}`)
        const data = await response.json()
        
        if (data.status === 'approved') {
          clearInterval(interval)
          setCheckingPayment(false)
          onPaymentSuccess()
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error)
      }
    }, 3000) // Verifica a cada 3 segundos

    // Para de verificar após 10 minutos
    setTimeout(() => {
      clearInterval(interval)
      setCheckingPayment(false)
    }, 600000)
  }

  const copyPixCode = async () => {
    if (pixData?.qr_code) {
      try {
        await navigator.clipboard.writeText(pixData.qr_code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Erro ao copiar:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-[#333333] mb-2">
              Gerando PIX...
            </h2>
            <p className="text-[#333333] opacity-70">
              Aguarde enquanto criamos seu código PIX
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!pixData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <QrCode className="w-16 h-16 text-[#4A90E2] mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-[#333333]">
              Pagamento via PIX
            </CardTitle>
            <p className="text-lg text-[#333333] opacity-80">
              Forma mais rápida e segura de pagar
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#B3D4FC] p-6 rounded-lg text-white text-center">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <div className="text-4xl font-bold mb-2">
                R$ {amount.toFixed(2).replace('.', ',')}
              </div>
              <p className="opacity-90">Pagamento único • Acesso imediato</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#4CAF50] bg-opacity-10 border border-[#4CAF50] p-4 rounded-lg">
                <h4 className="font-semibold text-[#4CAF50] mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Vantagens do PIX:
                </h4>
                <ul className="text-[#333333] space-y-1 text-sm">
                  <li>• Pagamento instantâneo 24h por dia</li>
                  <li>• Sem taxas adicionais</li>
                  <li>• Máxima segurança</li>
                  <li>• Funciona em qualquer banco</li>
                </ul>
              </div>

              <Button 
                onClick={createPixPayment}
                className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white text-lg py-6 flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Gerar Código PIX
              </Button>

              <div className="flex gap-4">
                <Button 
                  onClick={onCancel}
                  variant="outline"
                  className="flex-1 border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-white"
                >
                  Voltar
                </Button>
                <Button 
                  className="flex-1 bg-[#FFB300] hover:bg-[#E6A200] text-white flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-8 h-8 text-[#4A90E2]" />
            <Badge className="bg-[#4CAF50] text-white">
              PIX Gerado
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-[#333333]">
            Escaneie o QR Code ou copie o código
          </CardTitle>
          <p className="text-[#333333] opacity-70">
            Use o app do seu banco para pagar
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status do pagamento */}
          {checkingPayment && (
            <div className="bg-[#FFB300] bg-opacity-10 border border-[#FFB300] p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-[#FFB300] animate-pulse" />
                <span className="font-semibold text-[#FFB300]">
                  Aguardando pagamento...
                </span>
              </div>
              <p className="text-[#333333] text-sm">
                Assim que você pagar, liberaremos seu resultado automaticamente
              </p>
            </div>
          )}

          {/* Valor */}
          <div className="bg-gradient-to-r from-[#4A90E2] to-[#B3D4FC] p-4 rounded-lg text-white text-center">
            <p className="text-lg">Valor a pagar:</p>
            <p className="text-3xl font-bold">
              R$ {amount.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-[#4A90E2] inline-block">
              {pixData.qr_code_base64 ? (
                <img 
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code PIX"
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-sm text-[#333333] opacity-70 mt-2">
              Abra o app do seu banco e escaneie o código
            </p>
          </div>

          {/* Código PIX para copiar */}
          <div className="space-y-3">
            <p className="font-semibold text-[#333333] text-center">
              Ou copie o código PIX:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-white p-2 rounded border text-[#333333] break-all">
                  {pixData.qr_code}
                </code>
                <Button
                  onClick={copyPixCode}
                  size="sm"
                  className={`${
                    copied 
                      ? 'bg-[#4CAF50] hover:bg-[#45A049]' 
                      : 'bg-[#4A90E2] hover:bg-[#3A7BC8]'
                  } text-white`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-[#B3D4FC] bg-opacity-20 p-4 rounded-lg">
            <h4 className="font-semibold text-[#333333] mb-2">Como pagar:</h4>
            <ol className="text-[#333333] text-sm space-y-1">
              <li>1. Abra o app do seu banco</li>
              <li>2. Procure por "PIX" ou "Pagar com QR Code"</li>
              <li>3. Escaneie o código ou cole o código copiado</li>
              <li>4. Confirme o pagamento de R$ {amount.toFixed(2).replace('.', ',')}</li>
              <li>5. Seu resultado será liberado automaticamente!</li>
            </ol>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <Button 
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-white"
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-[#4CAF50] hover:bg-[#45A049] text-white"
              disabled={checkingPayment}
            >
              {checkingPayment ? 'Verificando...' : 'Já Paguei'}
            </Button>
          </div>

          {/* Informações de segurança */}
          <div className="text-center text-xs text-[#333333] opacity-60">
            <p>🔒 Pagamento 100% seguro via MercadoPago</p>
            <p>Seus dados estão protegidos com criptografia SSL</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}