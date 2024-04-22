/*
  Devido a limitações do próprio Cypress não é possível continuar o teste depois de abrir uma nova aba,
  por tanto, eu decidi fazer o teste em duas partes:
  Primeiro abro a pagina inicial da VR em seguida eu clico no botão Compre online e valido se a loja foi aberta na nova aba.
  Para a primeira parte do teste instalei um plugin oficial chamado Puppeteer que valida a abertura e existência do texto na nova aba.
  IMPORTANTE: devido ao uso do Puppeteer para validação é obrigatório o uso de um navegador chromiun então implementei um código para mostrar apenas os navegadores compativeis 
  Depois de validado eu fecho a aba e então abro a página da loja na aba principal do cypress e prossigo com o fluxo do teste até o final.
*/
//Depois de rodar o teste é necessário fechar o navegador e o cypress para então rodar novamente, por algum motivo quando rodar duas vezes seguidas o visit no dominio da VR o carregamento trava dando falha ao teste.
//Obs. Eu escolhi utilizar o design pattern Page Object no projeto, mas, devido ao problema de carregamento do Cypress não tive tempo hábil para aplicar esse padrão de projeto.

describe('Validar Adicionar cartão Auto ao carrinho', () => {
   it('Acessar a página da VR e Clico no botão Compre Online e valido se uma nova aba foi aberto com a loja e um banner dizendo "Bem-vindo(a) à  Loja VR!"',() => {
 // Apliquei um tratamento de exceção para evitar que o teste falhe depois do site aberto, pode ser alguma chamada do site que fica sem resposta ou mesmo um erro 
 // na minha maquina, esse erro não interfere no fluxo do cenário de teste
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('getAttribute')) return false
    })
    // abro o site da VR
    cy.visit('vr.com.br')
    //clico no botão Compre Online
    cy.get('#buttonCompreOnline').should('be.visible').click();
    //Aqui o Puppeteer aguarda a nova aba abrir e exibir o banner "Bem-vindo(a) à  Loja VR!" e valida seu texto
    cy.puppeteer('switchTabAndGetContent')
    .should('equal', 'Bem-vindo(a) à  Loja VR!')
    //Aqui coloco mais uma exceção para evitar o travamento do Cypress ao se deparar com uma requisição sem resposta.
      cy.on('uncaught:exception', (err) => {
        if (err.message.includes('Refused to evaluate a string')) return false
      })
      //iniciando a segunda parte de testes
      //abro a loja 
      cy.visit('loja.vr.com.br')
      //fecho o banner de boas vindas 
      cy.get('.close-button').click();
      //clico em VR cartões
      cy.get('#btn-selecionar-modalidade-avulso').click()
      //coloco uma quantidade no cartão auto 
      cy.get('#produto-auto-quantidade').type('2')
      //coloco um valor acima de 1,00
      cy.get('#produto-auto-valor').type('543,21')
      //clico no botão add ao carrinho 
      cy.get('#btn-adicionar-carrinho-auto').click()
      //Valido se a mensagem de sucesso aparece e tiro print
      cy.get('.product-in-cart-view__content').should('contain', 'Produto adicionado!')
      cy.screenshot('Validado com sucesso', { clip: { x: 0, y: 0, width: 1500, height: 1300 } }) 
      // A evidencia de sucesso esta na pasta ./VR_Beneficios_Cypress/cypress/screenshots
  })
  })
 
