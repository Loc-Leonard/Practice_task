describe('Dembo-Rubinstein survey flow', () => {
  it('fills all scales and shows results page', () => {
    // главная страница
    cy.visit('/')

    // проверяем, что форма отрисовалась
    cy.get('#survey-form').should('be.visible')
    cy.get('.scale-card').should('have.length', 7) // здоровье + 6 шкал

    // двигаем все ползунки (чтобы прошла валидация)
    cy.get('.slider.now-slider').each(($slider) => {
      cy.wrap($slider).invoke('val', 50).trigger('input')
    })
    cy.get('.slider.ideal-slider').each(($slider) => {
      cy.wrap($slider).invoke('val', 70).trigger('input')
    })

    // кнопка должна разблокироваться
    cy.get('#submit-btn')
      .should('not.be.disabled')
      .click()

    // после POST /api/save должен быть редирект на /result?v=...
    cy.url().should('include', '/result')
    cy.get('#result-title')
      .should('be.visible')
      .and('contain', 'Результаты самооценки по методике Дембо-Рубинштейн')

    // проверяем, что таблица с результатами есть
    cy.get('table.results-table').should('be.visible')
    cy.contains('th', 'Шкала').should('exist')
    cy.contains('td', 'Здоровье').should('exist')
    cy.contains('td', 'Ум/способности').should('exist')

    // блок интерпретации
    cy.contains('h3', 'Интерпретация результатов').should('exist')
    cy.contains('Самооценка:').should('exist')
    cy.contains('Уровень притязаний:').should('exist')
  })
})
