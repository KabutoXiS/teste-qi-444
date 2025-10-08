import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

// Configuração do MercadoPago com token de produção
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-7288312345146833-100720-1f8e03fe5b0c219d105fb14b13b5065a-291948548',
  options: { timeout: 5000 }
})

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID do pagamento é obrigatório' },
        { status: 400 }
      )
    }

    const payment = new Payment(client)
    const result = await payment.get({ id: paymentId })

    return NextResponse.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      external_reference: result.external_reference,
      transaction_amount: result.transaction_amount,
      date_created: result.date_created,
      date_approved: result.date_approved,
    })
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento', details: error },
      { status: 500 }
    )
  }
}