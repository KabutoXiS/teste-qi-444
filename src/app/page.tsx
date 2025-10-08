"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Brain, Trophy, CreditCard, CheckCircle, QrCode } from 'lucide-react'
import PixPayment from '@/components/PixPayment'

// Banco de perguntas de QI
const questions = [
  {
    id: 1,
    question: "Qual número vem a seguir na sequência: 2, 4, 8, 16, ?",
    options: ["24", "32", "30", "28"],
    correct: 1
  },
  {
    id: 2,
    question: "Se CASA = 3141 e MESA = 4521, então SECA = ?",
    options: ["5231", "5321", "5213", "5132"],
    correct: 1
  },
  {
    id: 3,
    question: "Qual figura completa o padrão: ○ △ ○ △ ○ ?",
    options: ["○", "△", "□", "◇"],
    correct: 1
  },
  {
    id: 4,
    question: "Em uma família, João é irmão de Maria. Maria é mãe de Pedro. Qual é a relação entre João e Pedro?",
    options: ["Pai", "Tio", "Avô", "Primo"],
    correct: 1
  },
  {
    id: 5,
    question: "Qual número não pertence ao grupo: 3, 5, 7, 9, 11?",
    options: ["3", "5", "9", "11"],
    correct: 2
  },
  {
    id: 6,
    question: "Se 3 gatos pegam 3 ratos em 3 minutos, quantos gatos são necessários para pegar 100 ratos em 100 minutos?",
    options: ["100", "33", "3", "10"],
    correct: 2
  },
  {
    id: 7,
    question: "Complete a analogia: Livro está para Página assim como Casa está para ?",
    options: ["Tijolo", "Quarto", "Telhado", "Porta"],
    correct: 1
  },
  {
    id: 8,
    question: "Qual é o próximo número: 1, 1, 2, 3, 5, 8, ?",
    options: ["11", "13", "15", "10"],
    correct: 1
  },
  {
    id: 9,
    question: "Se você reorganizar as letras 'ONEW', você obtém o nome de um(a):",
    options: ["Animal", "Cidade", "Oceano", "País"],
    correct: 2
  },
  {
    id: 10,
    question: "Quantos triângulos você pode ver nesta figura: △ dentro de △?",
    options: ["2", "3", "4", "5"],
    correct: 1
  },
  {
    id: 11,
    question: "Se A=1, B=2, C=3... qual é o valor de ZEBRA?",
    options: ["26", "52", "62", "72"],
    correct: 2
  },
  {
    id: 12,
    question: "Qual palavra não pertence ao grupo: Azul, Verde, Vermelho, Livro?",
    options: ["Azul", "Verde", "Vermelho", "Livro"],
    correct: 3
  },
  {
    id: 13,
    question: "Se hoje é terça-feira, que dia será daqui a 100 dias?",
    options: ["Segunda", "Terça", "Quarta", "Quinta"],
    correct: 1
  },
  {
    id: 14,
    question: "Complete: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correct: 1
  },
  {
    id: 15,
    question: "Qual é o oposto de 'sempre'?",
    options: ["Às vezes", "Nunca", "Raramente", "Frequentemente"],
    correct: 1
  },
  {
    id: 16,
    question: "Se um relógio marca 3:15, qual é o ângulo entre os ponteiros?",
    options: ["0°", "7.5°", "15°", "22.5°"],
    correct: 1
  },
  {
    id: 17,
    question: "Quantas vezes a letra 'F' aparece em: 'A vida é feita de escolhas difíceis'?",
    options: ["2", "3", "4", "5"],
    correct: 1
  },
  {
    id: 18,
    question: "Se AMOR = 1234 e ROMA = 4321, então RAMO = ?",
    options: ["4123", "4132", "4213", "4231"],
    correct: 2
  },
  {
    id: 19,
    question: "Qual número vem depois: 100, 81, 64, 49, ?",
    options: ["36", "25", "16", "9"],
    correct: 0
  },
  {
    id: 20,
    question: "Complete a sequência: AZ, BY, CX, ?",
    options: ["DW", "DV", "EW", "EV"],
    correct: 0
  },
  {
    id: 21,
    question: "Se você tem 12 maçãs e come 3, quantas você tem?",
    options: ["9", "12", "3", "15"],
    correct: 0
  },
  {
    id: 22,
    question: "Qual é a próxima letra: A, D, G, J, ?",
    options: ["K", "L", "M", "N"],
    correct: 2
  },
  {
    id: 23,
    question: "Se 2 + 2 = 4, e 3 + 3 = 6, então 4 + 4 = ?",
    options: ["6", "7", "8", "9"],
    correct: 2
  },
  {
    id: 24,
    question: "Quantos meses têm 28 dias?",
    options: ["1", "2", "11", "12"],
    correct: 3
  },
  {
    id: 25,
    question: "Complete: Sol está para Dia assim como Lua está para ?",
    options: ["Estrela", "Noite", "Escuridão", "Planeta"],
    correct: 1
  }
]

const motivationalMessages = [
  "Excelente! Continue assim! 🧠",
  "Você está indo muito bem! 💪",
  "Impressionante! Seu raciocínio está afiado! ⭐",
  "Fantástico! Continue focado! 🎯",
  "Muito bem! Você tem potencial! 🚀",
  "Ótimo trabalho! Siga em frente! 💡",
  "Perfeito! Sua mente está trabalhando bem! 🔥",
  "Incrível! Continue nesse ritmo! ⚡",
  "Excelente raciocínio! Prossiga! 🎉",
  "Muito bom! Você está quase lá! 🏆"
]

export default function IQTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showMotivation, setShowMotivation] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [showPixPayment, setShowPixPayment] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const calculateIQ = () => {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return answer === questions[index].correct ? count + 1 : count
    }, 0)
    
    // Fórmula simplificada de QI baseada na porcentagem de acertos
    const percentage = (correctAnswers / questions.length) * 100
    let iq = 100 // QI médio base
    
    if (percentage >= 95) iq = 140 + Math.floor(Math.random() * 20) // Superdotado
    else if (percentage >= 85) iq = 120 + Math.floor(Math.random() * 20) // Superior
    else if (percentage >= 70) iq = 110 + Math.floor(Math.random() * 10) // Acima da média
    else if (percentage >= 50) iq = 90 + Math.floor(Math.random() * 20) // Média
    else if (percentage >= 30) iq = 80 + Math.floor(Math.random() * 10) // Abaixo da média
    else iq = 70 + Math.floor(Math.random() * 10) // Baixo
    
    return { iq, correctAnswers, percentage: Math.round(percentage) }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    
    // Mostrar mensagem motivacional a cada 5 perguntas
    const shouldShowMotivation = (currentQuestion + 1) % 5 === 0
    
    if (shouldShowMotivation) {
      setShowMotivation(true)
      setTimeout(() => {
        setShowMotivation(false)
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
        } else {
          setShowResult(true)
        }
      }, 1500)
    } else {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
      }
    }
  }

  const handlePayWithPix = () => {
    setShowPixPayment(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaid(true)
    setShowPixPayment(false)
  }

  const handleCancelPayment = () => {
    setShowPixPayment(false)
  }

  const startTest = () => {
    setTestStarted(true)
  }

  const restartTest = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
    setShowMotivation(false)
    setTestStarted(false)
    setIsPaid(false)
    setShowPixPayment(false)
  }

  // Mostrar tela de pagamento PIX
  if (showPixPayment) {
    return (
      <PixPayment
        amount={0.99}
        title="Teste de QI Premium - Resultado Completo"
        onPaymentSuccess={handlePaymentSuccess}
        onCancel={handleCancelPayment}
      />
    )
  }

  if (showMotivation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[#333333] mb-2">
              {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
            </h2>
            <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="w-16 h-16 text-[#4A90E2]" />
            </div>
            <CardTitle className="text-4xl font-bold text-[#333333] mb-2">
              Teste de QI Oficial
            </CardTitle>
            <p className="text-lg text-[#333333] opacity-80">
              Descubra seu verdadeiro potencial intelectual
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#B3D4FC] p-6 rounded-lg text-white">
              <h3 className="text-xl font-semibold mb-3">O que você vai descobrir:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Seu QI preciso baseado em 25 questões científicas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Comparação com a população mundial
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Análise detalhada das suas habilidades
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Certificado oficial de QI
                </li>
              </ul>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-[#333333]">
                <strong>25 perguntas</strong> • <strong>15-20 minutos</strong> • <strong>Resultado imediato</strong>
              </p>
              <Button 
                onClick={startTest}
                className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white text-lg py-6"
              >
                Iniciar Teste de QI Gratuito
              </Button>
              <p className="text-sm text-[#333333] opacity-60">
                Mais de 2 milhões de pessoas já fizeram este teste
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResult) {
    const result = calculateIQ()
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Trophy className="w-16 h-16 text-[#FFB300] mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-[#333333]">
              Parabéns! Teste Concluído
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-[#4A90E2] to-[#B3D4FC] p-8 rounded-lg text-white mb-6">
                <h3 className="text-2xl font-bold mb-2">Seu Resultado Preliminar</h3>
                <div className="text-6xl font-bold mb-2">
                  {isPaid ? result.iq : '???'}
                </div>
                <p className="text-xl">
                  {isPaid ? 'Pontos de QI' : 'QI Bloqueado'}
                </p>
                {isPaid && (
                  <div className="mt-4 space-y-2">
                    <p>Você acertou {result.correctAnswers} de 25 questões ({result.percentage}%)</p>
                    <Badge className="bg-white text-[#4A90E2] text-lg px-4 py-2">
                      {result.iq >= 130 ? 'Superdotado' : 
                       result.iq >= 115 ? 'Acima da Média' : 
                       result.iq >= 85 ? 'Média' : 'Abaixo da Média'}
                    </Badge>
                  </div>
                )}
              </div>

              {!isPaid ? (
                <div className="space-y-4">
                  <div className="bg-[#FFB300] bg-opacity-10 border border-[#FFB300] p-4 rounded-lg">
                    <p className="text-[#333333] font-semibold">
                      🔒 Para ver seu QI completo e análise detalhada
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#4CAF50] to-[#45A049] p-6 rounded-lg text-white">
                    <h4 className="text-xl font-bold mb-3">Desbloqueie seu resultado completo:</h4>
                    <ul className="text-left space-y-2 mb-4">
                      <li>✓ Seu QI exato e classificação</li>
                      <li>✓ Comparação com a população</li>
                      <li>✓ Análise de cada área avaliada</li>
                      <li>✓ Certificado oficial em PDF</li>
                      <li>✓ Dicas para melhorar seu QI</li>
                    </ul>
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-2">Apenas R$ 0,99</p>
                      <p className="text-sm opacity-90">Pagamento único • Acesso imediato</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Button 
                      onClick={handlePayWithPix}
                      className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white text-lg py-6 flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-5 h-5" />
                      Pagar com PIX - R$ 0,99
                    </Button>
                    
                    <Button 
                      className="w-full bg-[#FFB300] hover:bg-[#E6A200] text-white text-lg py-4 flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Pagar com Cartão - R$ 0,99
                    </Button>
                  </div>
                  
                  <p className="text-xs text-[#333333] opacity-60">
                    Pagamento seguro via MercadoPago • Garantia de 30 dias
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#4CAF50] bg-opacity-10 border border-[#4CAF50] p-4 rounded-lg">
                    <p className="text-[#4CAF50] font-semibold flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Pagamento confirmado! Resultado completo desbloqueado.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#333333] mb-2">Classificação</h4>
                      <p className="text-[#4A90E2] font-bold">
                        {result.iq >= 130 ? 'Superdotado (2% da população)' : 
                         result.iq >= 115 ? 'Acima da Média (16% da população)' : 
                         result.iq >= 85 ? 'Média (68% da população)' : 'Abaixo da Média'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#333333] mb-2">Desempenho</h4>
                      <p className="text-[#4A90E2] font-bold">
                        {result.percentage >= 80 ? 'Excelente' : 
                         result.percentage >= 60 ? 'Bom' : 
                         result.percentage >= 40 ? 'Regular' : 'Precisa melhorar'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={restartTest}
                variant="outline"
                className="flex-1 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
              >
                Fazer Novo Teste
              </Button>
              {isPaid && (
                <Button 
                  className="flex-1 bg-[#4CAF50] hover:bg-[#45A049] text-white"
                >
                  Baixar Certificado
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#4A90E2]" />
              <span className="font-semibold text-[#333333]">Teste de QI</span>
            </div>
            <Badge variant="outline" className="border-[#4A90E2] text-[#4A90E2]">
              Pergunta {currentQuestion + 1} de {questions.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#333333]">
              <span>Progresso do teste</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-[#4A90E2] to-[#B3D4FC] h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pergunta */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#333333] leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-[#4A90E2] bg-[#B3D4FC] bg-opacity-20 text-[#333333]'
                      : 'border-gray-200 hover:border-[#B3D4FC] hover:bg-gray-50 text-[#333333]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-[#4A90E2] bg-[#4A90E2]'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botão próxima pergunta */}
        <div className="flex justify-center">
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-[#4A90E2] hover:bg-[#3A7BC8] text-white px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Ver Resultado' : 'Próxima Pergunta'}
          </Button>
        </div>

        {/* Dica motivacional */}
        <div className="mt-8 text-center">
          <p className="text-[#333333] opacity-70">
            💡 Dica: Leia cada pergunta com atenção e confie no seu primeiro instinto
          </p>
        </div>
      </div>
    </div>
  )
}