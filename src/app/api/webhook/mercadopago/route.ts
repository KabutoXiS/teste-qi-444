import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// Configuração do MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-7288312345146833-100720-1f8e03fe5b0c219d105fb14b13b5065a-291948548',
  options: { timeout: 5000 }
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log para debug
    console.log('Webhook MercadoPago recebido:', body)

    // Verificar se é uma notificação de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data?.id

      if (paymentId) {
        // Buscar detalhes do pagamento
        const payment = new Payment(client)
        const paymentData = await payment.get({ id: paymentId })

        console.log('Status do pagamento:', paymentData.status)
        
        // Aqui você pode implementar lógica adicional
        // como salvar no banco de dados, enviar email, etc.
        
        if (paymentData.status === 'approved') {
          console.log('Pagamento aprovado:', paymentId)
          // Implementar lógica de aprovação
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}