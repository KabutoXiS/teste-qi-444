// Configuração do MercadoPago
export const MERCADOPAGO_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || 'TEST-your-public-key',
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-7288312345146833-100720-1f8e03fe5b0c219d105fb14b13b5065a-291948548',
}

// Função para criar preferência de pagamento
export async function createPaymentPreference() {
  try {
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Teste de QI Premium - Resultado Completo',
        price: 0.99,
        quantity: 1,
      }),
    })

    if (!response.ok) {
      throw new Error('Erro ao criar preferência de pagamento')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    throw error
  }
}

// Função para verificar status do pagamento
export async function checkPaymentStatus(paymentId: string) {
  try {
    const response = await fetch(`/api/check-payment/${paymentId}`)
    
    if (!response.ok) {
      throw new Error('Erro ao verificar pagamento')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    throw error
  }
}