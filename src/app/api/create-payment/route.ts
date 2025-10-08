import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configuração do MercadoPago com token de produção
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-7288312345146833-100720-1f8e03fe5b0c219d105fb14b13b5065a-291948548',
  options: { timeout: 5000 }
})

export async function POST(request: NextRequest) {
  try {
    const { title, price, quantity } = await request.json()

    const preference = new Preference(client)

    // Detectar se estamos em produção ou desenvolvimento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? 'https://seusite.lasy.ai' 
                     : 'http://localhost:3000')

    const body = {
      items: [
        {
          id: 'iq-test-premium',
          title: title,
          quantity: quantity,
          unit_price: price,
          currency_id: 'BRL',
        },
      ],
      back_urls: {
        success: `${baseUrl}/payment/success`,
        failure: `${baseUrl}/payment/failure`,
        pending: `${baseUrl}/payment/pending`,
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 1,
      },
      statement_descriptor: 'TesteQI',
      external_reference: `teste_qi_producao_${Date.now()}`,
      notification_url: `${baseUrl}/api/webhook/mercadopago`,
    }

    const result = await preference.create({ body })

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    })
  } catch (error) {
    console.error('Erro ao criar preferência:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}