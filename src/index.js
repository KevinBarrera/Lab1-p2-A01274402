import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//A continuación se comentará la clase Square para convertirse en un componente de función, el cual no necesita ser definido en una clase
//Dado que ahora Board contrala a Square, a Square se le conoce como componente controlado
//class Square extends React.Component {
  /*Se crea el constructor que permitirá almacenar el valor actual de un cuadrado clickeado */
  /*
  El constructor ya no es necesario debido a que ahora Board es quien hace el seguimiento de los estados de Square
  constructor(props){
    super(props);//Siempre se llama primero al constructor del padre
    this.state = {
      value: null,
    };
  }*/
  //render() {
    //return (
      /*Se agrega la propiedad onClick para hacer el botón interactivo unicamente cuando se le da click y no siempre que se renderice */
      //<button className="square" 
        //onClick={()=>{
          // cuando el Square es clickeado la función onClick() de Board es llamada.
          // como en Board pasó onClick={() => this.handleClick(i)} square llama en sí a this.handleClick(i)
          //this.props.onClick() //cuando se le da click se re-renderiza el cuadrado y colocará en el estado aquello que la función de Board le indique
        //}}
      //>
        //{this.props.value} {/* Coloca en el botón el valor recibido de Board */}
      //</button>
    //);
  //}
//}

//Creando componente de función Square, es posible debido a que dentro de este elemento sólo se manejaba la función render()
function Square(props){
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
// se puede eliminar el constructor de Board ya que ahora elevaremos los estados a Game
  /*   //Se agrega el constructor en Board, padre de los elementos Square para poder ligar estados de los hijos
  constructor(props){
    super(props);
    // se establece como estado inicial un arreglo de 9 Square llenos de null
    // los null en el arreglo se irán sustituyendo por 'X' o 'O' cuando se de click a los cuadrados Square
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true, //boleano que nos ayuda a saber que símbolo es el siguiente
    };
  } */
  /* Esta función se moverá a Game
  //Definiendo handleClick(i)
  //Con esta función podemos llenar cada square con el valor mandado, sin embargo, ya es Board quien controla esta acción y no Square
  handleClick(i){
    const squares = this.state.squares.slice();//slice() crea una copia de los valores modificados en lugar de modificar el arreglo original
    // Se modifica para ignorar un click si alguien ha ganado o si Board está lleno
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    
    // Se ha modificado el valor a poner dentro de Square con un if ternario, el cual depende del booleano xIsNext
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // Cada que el estado de Board cambia los componentes Square se re-renderizan
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext, // cambia el booleano después de cada turno para alternar los símbolos
    });
  }*/

  renderSquare(i) {
    return (
    <Square 
      value={this.props.squares[i]} 
      // De cierta forma Board debe saber que ocurre con los cuadros que son clickeados, sin emabrago no es posible que Board sepa el estado de un Square debido a la privacidad
      // por lo anterior, lo que se hace es que desde Board pasamos una función a Square, mismo que llamará a esta función cuando se le de click
      onClick={()=>{
        return this.props.onClick(i); //ahora usará el método onClick de proporcionado por Game en props
      }}
    />// se manda a square los valores determinados por Board los cuales son 'X', 'O' o Null
    );
  }

  render() {
    //Debido a que ahora Game es quien renderiza el juego el ciertas partes de render en Board ya no son necesario
    // se llama a funcion calculateWinner para saber si alguno ganó y se sutiruye el texto de status
    /*const winner = calculateWinner(this.state.squares);
    let status;
    if(winner){
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    // Se mostrará que jugador tiene el siguiente turno
    //const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    */
    return (
      <div>
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  } 
}

class Game extends React.Component {
  //Se definirá el constructor que permitirá elevar el estado de Board a Game para tener acceso a un historial desde este componente
  constructor(props){
    super(props);
    this.state ={
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber:0,
      xIsNext: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);//si se regrese y se hace otro movimiento elimina todo el historial futuro que ahora no serviría
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]){
      return;
    }
    // Se ha modificado el valor a poner dentro de Square con un if ternario, el cual depende del booleano xIsNext
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // Cada que el estado de Board cambia los componentes Square se re-renderizan
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, // cambia el booleano después de cada turno para alternar los símbolos
    });
  }

  jumTo(step){
    this.setState({
      stepNumber: step, //refleja el movimiento mostrado al usuario
      xIsNext: (step%2 === 0),
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];//renderiza desde el movimiento seleccionado actualmente
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move)=>{
      const desc = move ?
        'Go to move #' + move:
        'Go to game start';
      return (
        <li key={move}>{/* Declarando move como Key */}
          <button onClick={()=> this.jumTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines [i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}