```javascript
#!/usr/bin/env node

const readline = require('readline');

class BudgetSimulator {
  constructor() {
    this.income = 0;
    this.expenses = [];
    this.savings = 0;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  }

  addIncome(amount, source = 'General') {
    this.income += amount;
    console.log(`✓ Ingreso agregado: $${amount.toFixed(2)} (${source})`);
  }

  addExpense(category, amount, description = '') {
    this.expenses.push({
      category,
      amount,
      description,
      date: new Date().toLocaleDateString('es-ES')
    });
    console.log(`✓ Gasto agregado: $${amount.toFixed(2)} - ${category} ${description ? `(${description})` : ''}`);
  }

  calculateTotal() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  calculateBalance() {
    return this.income - this.calculateTotal();
  }

  getExpensesByCategory() {
    const categories = {};
    this.expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    return categories;
  }

  displayReport() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║    REPORTE DE PRESUPUESTO MENSUAL      ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log(`📊 INGRESOS TOTALES:        $${this.income.toFixed(2)}`);
    console.log(`💸 GASTOS TOTALES:          $${this.calculateTotal().toFixed(2)}`);
    
    const balance = this.calculateBalance();
    const balanceSymbol = balance >= 0 ? '✓' : '✗';
    const balanceColor = balance >= 0 ? '✓' : '✗';
    console.log(`${balanceColor} BALANCE:                   $${balance.toFixed(2)}`);

    const percentageUsed = this.income > 0 ? ((this.calculateTotal() / this.income) * 100).toFixed(2) : 0;
    console.log(`📈 PORCENTAJE GASTADO:      ${percentageUsed}%\n`);

    const categories = this.getExpensesByCategory();
    if (Object.keys(categories).length > 0) {
      console.log('GASTOS POR CATEGORÍA:');
      console.log('─────────────────────────────────────────');
      Object.entries(categories).forEach(([category, amount]) => {
        const percentage = this.income > 0 ? ((amount / this.income) * 100).toFixed(1) : 0;
        console.log(`  ${category.padEnd(20)} $${amount.toFixed(2).padStart(12)} (${percentage}%)`);
      });
    }

    if (this.expenses.length > 0) {
      console.log('\nÚLTIMOS GASTOS REGISTRADOS:');
      console.log('─────────────────────────────────────────');
      this.expenses.slice(-5).reverse().forEach(expense => {
        const desc = expense.description ? ` - ${expense.description}` : '';
        console.log(`  [${expense.date}] ${expense.category}: $${expense.amount.toFixed(2)}${desc}`);
      });
    }

    console.log('\n');
  }

  async mainMenu() {
    let running = true;

    while (running) {
      console.log('\n╔════════════════════════════════════════╗');
      console.log('║   SIMULADOR DE PRESUPUESTO PERSONAL    ║');
      console.log('╚════════════════════════════════════════╝');
      console.log('1. Agregar ingreso');
      console.log('2. Agregar gasto');
      console.log('3. Ver reporte');
      console.log('4. Cargar datos de ejemplo');
      console.log('5. Salir\n');

      const choice = await this.question('Selecciona una opción (1-5): ');

      switch (choice) {
        case '1':
          const incomeAmount = parseFloat(await this.question('Monto del ingreso ($): '));
          const incomeSource = await this.question('Fuente de ingreso (ej: Salario): ');
          if (!isNaN(incomeAmount) && incomeAmount > 0) {
            this.addIncome(incomeAmount, incomeSource || 'General');
          } else {
            console.log('❌ Monto inválido');
          }
          break;

        case '2':
          const category = await this.question('Categoría (ej: Alimentos, Transporte, Entretenimiento): ');
          const expenseAmount = parseFloat(await this.question('Monto del gasto ($): '));
          const description = await this.question('Descripción (opcional): ');
          if (!isNaN(expenseAmount) && expenseAmount > 0 && category) {
            this.addExpense(category, expenseAmount, description);
          } else {
            console.log('❌ Datos inválidos');
          }
          break;

        case '3':
          this.displayReport();
          break;

        case '4':
          console.log('\n📋