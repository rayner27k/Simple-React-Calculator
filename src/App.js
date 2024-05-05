import './App.css';
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num1: '',
      num2: '',
      operador: '',
      resultado: ''
    };
  }

  handleClick = (value) => {
    let { num1, num2, operador, resultado } = this.state;
  
    // Reseta a calculadora se um número ou '.' é pressionado após um resultado final
    if (resultado && (value === '.' || !isNaN(value))) {
      if (value === '.') {
        this.setState({ num1: '0.', num2: '', operador: '', resultado: '' });
      } else {
        this.setState({ num1: value, num2: '', operador: '', resultado: '' });
      }
      return;
    }

    // Configurar o operador e preparar para nova entrada após resultado de qualquer operação
    if (resultado && !num2 && ['+', '-', '×', '÷'].includes(value)) {
      this.setState({ operador: value, num1: resultado, num2: '', resultado: '' });
      return;
    }
  
    // Entrada numérica após seleção de operador e resultado de operação especial
    if (operador && !num2 && !isNaN(value)) {
      this.setState({ num2: value });
      return;
    }

    // Permitindo número negativo para num1 ou num2
    if (value === '-' && !num1 && !operador) {
      this.setState({ num1: '-' });
      return;
    } else if (value === '-' && operador && !num2) {
      this.setState({ num2: '-' });
      return;
    }

    if (value === '√' || value === 'ᵪ²') {
      // Verificações para operadores especiais: só operar se num1 é um número válido
      if (num1 && !isNaN(parseFloat(num1)) && num1 !== '-' && !num2) {
        this.calculateSpecialOperation(num1, value);
      }
      return;
    }

    // Lidar com entrada de operadores e números
    if (['+', '-', '×', '÷'].includes(value)) {
      if (!num1 || num1 === '-') { // num1 está vazio ou apenas com um sinal negativo
        if (value === '-') {
          this.setState({ num1: value }); // Aceita o sinal negativo como início de num1
        } else if (value !== '-' && num1 === '-') {
          this.setState({ num1: '', operador: '' }); // Limpa num1 se outro operador for digitado após '-'
        }
      } else if (operador && !num2) { // Se já houver operador, substitui pelo novo
        this.setState({ operador: value });
      } else if (!operador) { // Se não houver operador, define o novo
        this.setState({ operador: value, num1, num2: '', resultado: '' });
      }
      return;
    }
  
    if (value === '.') {
      if (num1 && !operador) {
        this.setState({ num1: num1.includes('.') ? num1 : num1 + '.' });
      } else if (num2) {
        this.setState({ num2: num2.includes('.') ? num2 : num2 + '.' });
      } else if (!num1) {
        this.setState({ num1: '0.' });
      } else if (operador && !num2) {
        this.setState({ num2: '0.' });
      }
      return;
    }
  
    if (value === 'AC') {
      this.clearAllValues();
      return;
    } else if (value === '←') {
      this.clearValues();
      return;
    }
  
    if (value === '√' || value === 'ᵪ²') {
      if (num1 && !num2) {
        this.calculateSpecialOperation(num1, value);
        return;
      }
    }
  
    if (['+', '-', '×', '÷'].includes(value)) {
      if (num1 && !num2 && operador) {
        this.setState({ operador: value });
      } else if (resultado) {
        this.setState({ num1: resultado, num2: '', operador: value, resultado: '' });
      } else {
        this.setState({ operador: value });
      }
      return;
    }
  
    if (value === '=') {
      if (num1 && operador && num2) {
        this.calculateResult();
      }
      return;
    }
  
    if (!operador) {
      this.setState({ num1: num1 + value });
    } else {
      this.setState({ num2: num2 + value });
    }
  };
  

  calculateSpecialOperation = (num, operation) => {
    let result = 0;
    num = parseFloat(num);
  
    if (operation === '√') {
      result = Math.sqrt(num);
    } else if (operation === 'ᵪ²') {
      result = Math.pow(num, 2);
    }

    // Formatar o resultado para no máximo 5 casas decimais
    result = parseFloat(result.toFixed(5));
  
    // Mantenha o operador até uma nova entrada ou limpeza.
    this.setState({ resultado: result.toString(), num1: result.toString(), operador: operation });
  };
  

  calculateResult = () => {
    let { num1, num2, operador } = this.state;
    let result = 0;
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    switch (operador) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '×':
        result = num1 * num2;
        break;
      case '÷':
        result = num1 / num2;
        break;
      default:
        break;
    }

    // Formatar o resultado para no máximo 5 casas decimais
    result = parseFloat(result.toFixed(5));

    this.setState({ resultado: result.toString(), num1: result.toString(), operador: '', num2: '' });
  };

  clearValues = () => {
    let { num1, num2, operador, resultado } = this.state;
    if (resultado) {
      this.clearAllValues();
    } else if (num2) {
      this.setState({ num2: num2.slice(0, -1) });
    } else if (operador) {
      this.setState({ operador: '' });
    } else {
      this.setState({ num1: num1.slice(0, -1) });
    }
  };

  clearAllValues = () => {
    this.setState({ num1: '', num2: '', operador: '', resultado: '' });
  };

  render() {
    const { num1, num2, resultado, operador } = this.state;
    const displayValue = resultado || num2 || num1 || '0';
    const displayOperator = operador && ['+', '-', '×', '÷', '√', 'ᵪ²'].includes(operador) ? operador : '';

    return (
      <div className="App">
        <table>
          <tbody>
          <tr>
              <td colSpan='3'>
                <input type='text' readOnly style={{ width: '100px', height: '30px' }} value={displayValue} />
              </td>
              <td>
                <input className='Operator' type='text' readOnly style={{ width: '30px', height: '30px' }} value={displayOperator} />
              </td>
            </tr>
            <tr>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('←')}>←</button></td>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('√')}>√</button></td>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('ᵪ²')}>ᵪ²</button></td>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('AC')}>AC</button></td>
            </tr>
            <tr>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('7')}>7</button></td>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('8')}>8</button></td>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('9')}>9</button></td>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('+')}>+</button></td>
            </tr>
            <tr>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('4')}>4</button></td>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('5')}>5</button></td>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('6')}>6</button></td>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('-')}>-</button></td>
            </tr>
            <tr>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('1')}>1</button></td>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('2')}>2</button></td>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('3')}>3</button></td>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('×')}>×</button></td>
            </tr>
            <tr>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('.')}>.</button></td>
              <td><button type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('0')}>0</button></td>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('=')}>=</button></td>
              <td><button className='SpecialCharacter' type='button' style={{ width: '30px', height: '30px' }} onClick={() => this.handleClick('÷')}>÷</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
