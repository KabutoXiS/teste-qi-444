import { NextRequest, NextResponse } from 'next/server'

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-7288312345146833-100720-1f8e03fe5b0c219d105fb14b13b5065a-291948548'

export async function POST(request: NextRequest) {
  try {
    const { title, price, quantity = 1 } = await request.json()

    const paymentData = {
      transaction_amount: price,
      description: title,
      payment_method_id: 'pix',
      payer: {
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
        identification: {
          type: 'CPF',
          number: '12345678901'
        }
      }
    }

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro MercadoPago:', errorData)
      return NextResponse.json(
        { error: 'Erro ao criar pagamento PIX', details: errorData },
        { status: response.status }
      )
    }

    const payment = await response.json()
    
    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
      ticket_url: payment.point_of_interaction?.transaction_data?.ticket_url,
      payment_method_id: payment.payment_method_id,
      transaction_amount: payment.transaction_amount,
      date_of_expiration: payment.date_of_expiration
    })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}